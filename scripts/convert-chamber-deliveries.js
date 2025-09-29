import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.resolve(__dirname, '..', 'data_ex', '목록_납품실적_대형챔버시스템(유니태크 주식회사)_241023.xlsx');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'data_ex', 'processed');
const CONTACT_FILE = path.resolve(__dirname, '..', 'data_ex', '연락처.xlsx');

if (!fs.existsSync(INPUT_FILE)) {
  console.error('❌ 입력 엑셀 파일을 찾을 수 없습니다:', INPUT_FILE);
  process.exit(1);
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function clean(value) {
  if (value == null) return '';
  if (typeof value === 'number') return String(value).trim();
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeKey(value) {
  const base = clean(value)
    .replace(/\([^)]*\)/g, '')
    .replace(/[㈜]/g, '')
    .replace(/주식회사/gi, '')
    .replace(/\//g, ' ')
    .trim();
  return base.replace(/\s+/g, '').toLowerCase();
}

function excelDateToISO(value) {
  if (!value) return '';
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return '';
    const { y, m, d } = parsed;
    return [y, m, d].map((part, idx) => String(part).padStart(idx === 0 ? 4 : 2, '0')).join('-');
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const asDate = new Date(value);
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toISOString().slice(0, 10);
  }
  return '';
}

function toCsv(rows) {
  const escape = (value) => {
    if (value == null) return '';
    const text = String(value);
    if (text === '') return '';
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };
  return rows.map(row => row.map(escape).join(',')).join('\n');
}

const workbook = XLSX.readFile(INPUT_FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(sheet, { range: 1, defval: null });

const normalized = rawRows
  .filter(row => row['번호'] != null && row['업체명'])
  .map(row => {
    const seq = Number(row['번호']);
    const accountName = clean(row['업체명']);
    const siteRaw = clean(row['부서/소재지']);
    const categoryRaw = clean(row['종류(구분)']);
    const chamberCount = row['챔버수/채널수'] != null ? Number(row['챔버수/채널수']) : '';
    const modelNo = clean(row['Model No.']);
    const serialNo = clean(row['Serial No.']);
    const notes = clean(row['비고']);
    const deliveredOn = excelDateToISO(row['납품일']);

    const categoryMatch = categoryRaw.match(/([^()]+)(?:\(([^)]+)\))?/);
    const categoryBase = categoryMatch ? clean(categoryMatch[1]) : '';
    const categoryVariant = categoryMatch && categoryMatch[2] ? clean(categoryMatch[2]) : '';

    return {
      seq,
      accountName,
      siteRaw,
      categoryRaw,
      categoryBase,
      categoryVariant,
      chamberCount,
      deliveredOn,
      modelNo,
      serialNo,
      notes
    };
  });

if (normalized.length === 0) {
  console.error('❌ 엑셀에서 유효한 행을 찾지 못했습니다.');
  process.exit(1);
}

const accountMap = new Map();
const accountCodeMap = new Map();
const siteMap = new Map();
const templateMap = new Map();
const siteCounters = new Map();
const deliveries = [];
const sitesByAccount = new Map();

const ADDRESS_OVERRIDES = new Map([
  ['ACC-002', '경기도 수원시 영통구 매탄동'],
  ['ACC-005', '경기도 평택시 진위면 엘지로 222'],
  ['ACC-010', '경기도 수원시 장안구 수일로123번길 20'],
  ['ACC-011', '서울시 금천구 가산디지털 1로 88 IT 프리미어타워 15층'],
  ['ACC-012', '경기도 포천시 자작로 155'],
  ['ACC-013', '세종특별자치시 라온로 66'],
  ['ACC-014', '서울특별시 마포구 성암로 179 한샘상암사옥'],
  ['ACC-015', '경기도 화성시 초록로693번길 47'],
  ['ACC-016', '경기도 성남시 수정구 연내개울로 26'],
  ['ACC-018', '경기도 화성시 동탄산단10길 20']
]);

const ACCOUNT_NAME_OVERRIDES = new Map([
  [normalizeKey('한국토지주택연구원'), { account_name: 'LH공사사', account_alias: 'LH' }]
]);

for (const record of normalized) {
  const accountKey = record.accountName;
  let account = accountMap.get(accountKey);
  if (!account) {
    const nextIdx = accountMap.size + 1;
    const accountCode = `ACC-${String(nextIdx).padStart(3, '0')}`;
    const aliasMatch = accountKey.match(/\(([^)]+)\)/);
    const accountAlias = aliasMatch ? clean(aliasMatch[1]) : '';
    const cleanName = clean(accountKey.replace(/\([^)]*\)/g, ''));

    account = {
      account_code: accountCode,
      account_name: cleanName || accountKey,
      account_alias: accountAlias,
      account_type: 'customer',
      region: '',
      address: '',
      notes: ''
    };

    const nameOverride = ACCOUNT_NAME_OVERRIDES.get(normalizeKey(account.account_name));
    if (nameOverride) {
      if (nameOverride.account_name) account.account_name = nameOverride.account_name;
      if (nameOverride.account_alias) account.account_alias = nameOverride.account_alias;
    }
    accountMap.set(accountKey, account);
    accountCodeMap.set(accountCode, account);
  }

  if (!account.region && record.siteRaw) {
    account.region = record.siteRaw;
  }

  const siteName = record.siteRaw || '본사';
  const siteKey = `${account.account_code}|${siteName}`;
  let site = siteMap.get(siteKey);
  if (!site) {
    const count = (siteCounters.get(account.account_code) ?? 0) + 1;
    siteCounters.set(account.account_code, count);
    const siteCode = `SITE-${account.account_code.slice(-3)}-${String(count).padStart(2, '0')}`;

    site = {
      site_code: siteCode,
      account_code: account.account_code,
      site_name: siteName,
      address: siteName,
      notes: ''
    };
    siteMap.set(siteKey, site);

    const bucket = sitesByAccount.get(account.account_code) ?? [];
    bucket.push(site);
    sitesByAccount.set(account.account_code, bucket);
  }

  if (record.notes) {
    site.notes = site.notes ? `${site.notes}; ${record.notes}` : record.notes;
  }

  const templateKey = record.modelNo || `${record.categoryBase}-${record.categoryVariant}`;
  if (!templateMap.has(templateKey)) {
    const templateCode = record.modelNo || `MODEL-${String(templateMap.size + 1).padStart(3, '0')}`;
    const baseLabel = record.categoryBase || '제품';
    const variantLabel = record.categoryVariant ? ` ${record.categoryVariant}` : '';
    const templateName = `${baseLabel} 챔버 시스템${variantLabel}`.trim();

    const categoryCode = (() => {
      const base = record.categoryBase;
      if (!base) return 'CHAMBER';
      if (/\b펌프|PUMP/i.test(base)) return 'EQUIPMENT';
      if (/멸균/i.test(base)) return 'AUTOCLAVE';
      return 'CHAMBER';
    })();

    const baseSpecifications = {};
    if (record.categoryVariant) {
      baseSpecifications['규격'] = record.categoryVariant;
    }
    if (record.chamberCount) {
      baseSpecifications['챔버수'] = record.chamberCount;
    }

    templateMap.set(templateKey, {
      template_code: templateCode,
      template_name: templateName,
      category: categoryCode,
      description: record.categoryRaw,
      base_specifications: JSON.stringify(baseSpecifications),
      is_consumable: 'false',
      status: 'active'
    });
  }

  const template = templateMap.get(templateKey);
  const year = record.deliveredOn ? record.deliveredOn.slice(0, 4) : '0000';
  const deliveryCode = `DEL-${year}-${String(record.seq).padStart(3, '0')}`;

  deliveries.push({
    delivery_code: deliveryCode,
    account_code: account.account_code,
    site_code: site.site_code,
    template_code: template.template_code,
    model_no: record.modelNo,
    serial_no: record.serialNo,
    chamber_count: record.chamberCount,
    delivered_on: record.deliveredOn,
    notes: record.notes
  });
}

const accountLookup = new Map();
for (const [originalKey, account] of accountMap.entries()) {
  const candidates = [
    originalKey,
    account.account_name,
    account.account_alias
  ];
  candidates
    .map(candidate => normalizeKey(candidate))
    .filter(Boolean)
    .forEach(key => {
      if (!accountLookup.has(key)) {
        accountLookup.set(key, account.account_code);
      }
    });
}

const accountContacts = [];
if (fs.existsSync(CONTACT_FILE)) {
  try {
    const contactWorkbook = XLSX.readFile(CONTACT_FILE);
    const preferredSheet = ['연락처DB', '연락처'].find(name => contactWorkbook.Sheets[name]);
    const contactSheet = contactWorkbook.Sheets[preferredSheet || contactWorkbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(contactSheet, { range: 1, defval: '' });

    rows.forEach(row => {
      const companyRaw = clean(row['업체명']);
      const contactNameRaw = clean(row['성명']);
      if (!companyRaw || !contactNameRaw) return;

      const normalizedKeys = [normalizeKey(companyRaw)]
        .concat(companyRaw.split('/').map(part => normalizeKey(part)));

      let accountCode = '';
      for (const key of normalizedKeys) {
        if (!key) continue;
        const found = accountLookup.get(key);
        if (found) {
          accountCode = found;
          break;
        }
      }

      if (!accountCode) {
        return;
      }

      const contactName = clean(contactNameRaw.replace(/\([^)]*\)/g, ''));
      const title = clean(row['직급']);
      const mobile = clean(row['핸드폰']);
      const office = clean(row['사무실']);
      const fax = clean(row['팩스']);
      const email = clean(row['E-mail']).replace(/\r?\n/g, '; ');
      const homepage = clean(row['홈페이지']);
      const address = clean(row['주소']);
      const notes = clean(row['비고']);
      const group = clean(row['구분']);

      accountContacts.push({
        account_code: accountCode,
        contact_name: contactName,
        title,
        mobile_phone: mobile,
        office_phone: office,
        fax,
        email,
        homepage,
        address,
        group,
        notes
      });

      const account = accountCodeMap.get(accountCode);
      if (account && !account.address && address) {
        account.address = address;
      }

      const siteList = sitesByAccount.get(accountCode);
      if (address && siteList && siteList.length === 1) {
        const [site] = siteList;
        if (!site.address || site.address === site.site_name) {
          site.address = address;
        }
      }
    });
  } catch (error) {
    console.warn('⚠️ 연락처 엑셀을 처리하는 중 문제가 발생했습니다:', error.message);
  }
}

ADDRESS_OVERRIDES.forEach((address, accountCode) => {
  const account = accountCodeMap.get(accountCode);
  if (account) {
    account.address = address;
  }

  const siteList = sitesByAccount.get(accountCode) || [];
  siteList.forEach(site => {
    if (!site.address || site.address === site.site_name || site.address.trim() === '') {
      site.address = address;
    }
  });
});

function writeCsv(filename, headers, rows) {
  const headerRow = headers;
  const dataRows = rows.map(row => headers.map(h => row[h] ?? ''));
  const csv = toCsv([headerRow, ...dataRows]);
  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, csv, 'utf8');
  console.log('✅ CSV 생성:', outputPath);
}

const accountRows = Array.from(accountMap.values())
  .sort((a, b) => a.account_code.localeCompare(b.account_code));
writeCsv('accounts_seed.csv', ['account_code', 'account_name', 'account_alias', 'account_type', 'region', 'address', 'notes'], accountRows);

const siteRows = Array.from(siteMap.values())
  .sort((a, b) => a.site_code.localeCompare(b.site_code));
writeCsv('sites_seed.csv', ['site_code', 'account_code', 'site_name', 'address', 'notes'], siteRows);

const templateRows = Array.from(templateMap.values())
  .sort((a, b) => a.template_code.localeCompare(b.template_code));
writeCsv('product_templates_seed.csv', ['template_code', 'template_name', 'category', 'description', 'base_specifications', 'is_consumable', 'status'], templateRows);

const deliveryRows = deliveries.sort((a, b) => a.delivery_code.localeCompare(b.delivery_code));
writeCsv('deliveries_seed.csv', ['delivery_code', 'account_code', 'site_code', 'template_code', 'model_no', 'serial_no', 'chamber_count', 'delivered_on', 'notes'], deliveryRows);

if (accountContacts.length > 0) {
  const contactRows = accountContacts.sort((a, b) =>
    a.account_code.localeCompare(b.account_code) || a.contact_name.localeCompare(b.contact_name)
  );
  writeCsv('account_contacts_seed.csv', [
    'account_code',
    'contact_name',
    'title',
    'group',
    'mobile_phone',
    'office_phone',
    'fax',
    'email',
    'homepage',
    'address',
    'notes'
  ], contactRows);
}

console.log('🎉 변환이 완료되었습니다.');
