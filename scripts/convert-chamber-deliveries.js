import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.resolve(__dirname, '..', 'data_ex', '목록_납품실적_대형챔버시스템(유니태크 주식회사)_241023.xlsx');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'data_ex', 'processed');

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
const siteMap = new Map();
const templateMap = new Map();
const siteCounters = new Map();
const deliveries = [];

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
      notes: ''
    };
    accountMap.set(accountKey, account);
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
writeCsv('accounts_seed.csv', ['account_code', 'account_name', 'account_alias', 'account_type', 'region', 'notes'], accountRows);

const siteRows = Array.from(siteMap.values())
  .sort((a, b) => a.site_code.localeCompare(b.site_code));
writeCsv('sites_seed.csv', ['site_code', 'account_code', 'site_name', 'address', 'notes'], siteRows);

const templateRows = Array.from(templateMap.values())
  .sort((a, b) => a.template_code.localeCompare(b.template_code));
writeCsv('product_templates_seed.csv', ['template_code', 'template_name', 'category', 'description', 'base_specifications', 'is_consumable', 'status'], templateRows);

const deliveryRows = deliveries.sort((a, b) => a.delivery_code.localeCompare(b.delivery_code));
writeCsv('deliveries_seed.csv', ['delivery_code', 'account_code', 'site_code', 'template_code', 'model_no', 'serial_no', 'chamber_count', 'delivered_on', 'notes'], deliveryRows);

console.log('🎉 변환이 완료되었습니다.');
