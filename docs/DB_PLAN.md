# 유니태크(주) 관리자 사이트 — DB 스키마 (v1)

> **DB**: PostgreSQL (Supabase)
> **정책**: 장비 단위 대표 검교정(Inspection) 1건씩 기록 / 상태값은 DB 마스터 없이 **CHECK 제약**으로 고정
> **ID**: DB PK는 `uuid`, 사람이 보는 코드는 규칙(`EQP-YYYY-XXXXXX`)으로 별도 컬럼에 보관

---

## 0) 사전 설정

* Supabase는 `pgcrypto` 확장이 기본 제공됨 (없으면 아래 주석 해제)
* 모든 타임스탬프는 `timestamptz`, 날짜는 `date`

```sql
-- 확장 모듈 (필요 시)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;
```

---

## 1) 공통: 상태/역할 체크 제약 상수

> v1은 ENUM 대신 **CHECK 제약**을 사용해 간단·유연성 유지

```sql
-- 상태/역할 값 설명 (참고):
-- equipment.status ∈ ('active','stored','delivered','installed','retired')
-- service_tickets.status ∈ ('open','in_progress','on_hold','done','canceled')
-- employees.role ∈ ('admin','manager','staff')
-- service_tickets.priority ∈ ('low','normal','high')
```

---

## 2) 직원/권한 · 거래처/납품지 · 담당자

```sql
-- 2.1 employees: 직원 + 내부 로그인/RBAC
CREATE TABLE IF NOT EXISTS employees (
  employee_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username         text NOT NULL UNIQUE,              -- 로그인 ID
  password_hash    text NOT NULL,                     -- Bcrypt 등 해시값
  name             text NOT NULL,                     -- 표시명
  title            text,                              -- 직책
  mobile           text,                              -- 연락처
  email            text,                              -- 이메일
  role             text NOT NULL DEFAULT 'staff',     -- admin/manager/staff
  active           boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_employees_role CHECK (role IN ('admin','manager','staff'))
);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(active);

-- 2.2 accounts: 거래처 (법인 단위)
CREATE TABLE IF NOT EXISTS accounts (
  account_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,                     -- 상호명
  type             text NOT NULL DEFAULT 'customer',  -- customer/partner/supplier
  main_phone       text,
  main_email       text,
  region           text,                              -- 본사/지역 메모
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts(name);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(type);

-- 2.3 sites: 납품지 (현장/지사 주소)
CREATE TABLE IF NOT EXISTS sites (
  site_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       uuid NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  name             text NOT NULL,                     -- 예: 가산R&D 7층 실험실
  address          text,
  contact_person   text,
  contact_phone    text,
  contact_email    text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sites_account ON sites(account_id);
CREATE INDEX IF NOT EXISTS idx_sites_name ON sites(name);

-- 2.4 account_contacts: 거래처/납품지 담당자
--  - site_id 가 NULL이면 거래처 공통 담당자
--  - site_id 가 있으면 해당 납품지 전담 담당자
CREATE TABLE IF NOT EXISTS account_contacts (
  contact_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       uuid NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  site_id          uuid REFERENCES sites(site_id) ON DELETE CASCADE,
  name             text NOT NULL,
  title            text,
  phone            text,
  email            text,
  is_primary       boolean NOT NULL DEFAULT false,
  notes            text,
  active           boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contacts_account ON account_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_contacts_site ON account_contacts(site_id);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON account_contacts(name);
```

---

## 3) 장비 모델 · 장비(요약 필드 포함)

```sql
-- 3.1 equipment_models (선택): 모델/카테고리/사양
CREATE TABLE IF NOT EXISTS equipment_models (
  model_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name       text NOT NULL,
  category         text,                               -- 대형/소형/토양·해양/흡착/냄새/펌프/필터 등
  spec             jsonb,                              -- 사양(자유)
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_model_name ON equipment_models(model_name);
CREATE INDEX IF NOT EXISTS idx_model_category ON equipment_models(category);

-- 3.2 equipment: 장비 (검교정 요약 필드 포함)
CREATE TABLE IF NOT EXISTS equipment (
  equipment_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                 text NOT NULL,                  -- 사람친화 코드(EQP-YYYY-XXXXXX)
  name                 text NOT NULL,                  -- 장비명(목록 기본표시)
  model_id             uuid REFERENCES equipment_models(model_id) ON DELETE SET NULL,
  serial_no            text NOT NULL UNIQUE,           -- 시리얼
  purchase_type        text NOT NULL,                  -- 제조/구매대행 등
  status               text NOT NULL DEFAULT 'stored', -- active/stored/delivered/installed/retired
  installed_site_id    uuid REFERENCES sites(site_id) ON DELETE SET NULL,
  installed_at         date,
  last_service_at      date,                           -- 최근 A/S 일자(요약)
  last_inspection_at   date,                           -- 최근 검교정 일자(요약)
  next_inspection_due  date,                           -- 다음 검교정 예정일(요약)
  warranty_until       date,                           -- 보증만료
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_equipment_status CHECK (status IN ('active','stored','delivered','installed','retired'))
);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_site ON equipment(installed_site_id);
CREATE INDEX IF NOT EXISTS idx_equipment_next_due ON equipment(next_inspection_due);
```

---

## 4) 납품 (헤더 + 아이템)

```sql
-- 4.1 deliveries: 납품 헤더 (거래처/납품지/일자/담당자)
CREATE TABLE IF NOT EXISTS deliveries (
  delivery_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       uuid NOT NULL REFERENCES accounts(account_id) ON DELETE RESTRICT,
  site_id          uuid NOT NULL REFERENCES sites(site_id) ON DELETE RESTRICT,
  delivery_date    date NOT NULL,                      -- 납품일자
  delivered_by     uuid REFERENCES employees(employee_id) ON DELETE SET NULL,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_deliveries_date ON deliveries(delivery_date);
CREATE INDEX IF NOT EXISTS idx_deliveries_account ON deliveries(account_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_site ON deliveries(site_id);

-- 4.2 delivery_items: 납품 품목(장비 다건)
CREATE TABLE IF NOT EXISTS delivery_items (
  delivery_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id      uuid NOT NULL REFERENCES deliveries(delivery_id) ON DELETE CASCADE,
  equipment_id     uuid NOT NULL REFERENCES equipment(equipment_id) ON DELETE RESTRICT,
  status_at_delivery text,                              -- 납품 시 상태(선택)
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_delivery_items_delivery ON delivery_items(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_items_equipment ON delivery_items(equipment_id);
```

---

## 5) A/S (티켓)

```sql
CREATE TABLE IF NOT EXISTS service_tickets (
  ticket_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id     uuid NOT NULL REFERENCES equipment(equipment_id) ON DELETE RESTRICT,
  account_id       uuid NOT NULL REFERENCES accounts(account_id) ON DELETE RESTRICT,
  site_id          uuid NOT NULL REFERENCES sites(site_id) ON DELETE RESTRICT,
  requested_at     timestamptz NOT NULL DEFAULT now(), -- 접수(등록) 일시
  completed_at     timestamptz,                        -- 완료 일시
  status           text NOT NULL DEFAULT 'open',       -- open/in_progress/on_hold/done/canceled
  priority         text NOT NULL DEFAULT 'normal',     -- low/normal/high
  symptom          text NOT NULL,                      -- 증상
  cause            text,                               -- 원인(선택)
  action           text,                               -- 조치(선택)
  assigned_to      uuid REFERENCES employees(employee_id) ON DELETE SET NULL,
  photos           jsonb,                              -- 첨부(선택)
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_ticket_status CHECK (status IN ('open','in_progress','on_hold','done','canceled')),
  CONSTRAINT chk_ticket_priority CHECK (priority IN ('low','normal','high'))
);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON service_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_requested ON service_tickets(requested_at);
CREATE INDEX IF NOT EXISTS idx_tickets_equipment ON service_tickets(equipment_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON service_tickets(assigned_to);
```

---

## 6) 검교정 (대표 1건씩, 이력 누적)

```sql
CREATE TABLE IF NOT EXISTS inspections (
  inspection_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id     uuid NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
  type             text NOT NULL DEFAULT '정기',       -- 정기/수시/교정
  performed_at     date NOT NULL,                      -- 실행일
  result           text NOT NULL DEFAULT 'pass',       -- pass/fail
  next_due_at      date,                               -- 다음 예정일
  provider         text,                               -- 내부/외부기관명
  certificate_no   text,                               -- 성적서 번호
  attachments      jsonb,                              -- 파일 URL 배열 등
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inspections_equipment ON inspections(equipment_id);
CREATE INDEX IF NOT EXISTS idx_inspections_next_due ON inspections(next_due_at);
CREATE INDEX IF NOT EXISTS idx_inspections_performed ON inspections(performed_at);
```

> **업무 규칙(v1)**: 검교정 입력/수정 후 API 레이어(서버)에서 `equipment.last_inspection_at`, `equipment.next_inspection_due`를 동시 갱신
> **v1.1**: 트리거/함수로 자동화 가능 (원하면 별도 제공)

---

## 7) 공용 첨부 (선택)

```sql
CREATE TABLE IF NOT EXISTS attachments (
  attachment_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      text NOT NULL,                      -- equipment/inspection/ticket/delivery
  entity_id        uuid NOT NULL,                      -- 대상 PK
  file_url         text NOT NULL,                      -- 업로드 경로
  caption          text,
  uploaded_by      uuid NOT NULL REFERENCES employees(employee_id) ON DELETE SET NULL,
  uploaded_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(entity_type, entity_id);
```

---

## 8) 내보내기 로그 (선택, 감사 대용 최소)

```sql
CREATE TABLE IF NOT EXISTS exports_log (
  export_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id      uuid REFERENCES employees(employee_id) ON DELETE SET NULL,
  module           text NOT NULL,                      -- equipment / deliveries / tickets / accounts ...
  filter_json      jsonb,                              -- 당시 필터/정렬 스냅샷
  row_count        int,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exports_module ON exports_log(module);
CREATE INDEX IF NOT EXISTS idx_exports_employee ON exports_log(employee_id);
```

---

## 9) 마무리

```sql
COMMIT;
```

---

### 비고

* **FK 삭제 정책**:

  * 납품 헤더 삭제 시 아이템은 `CASCADE`
  * 직원/사이트/거래처 삭제는 운영상 거의 없음 → 대부분 `RESTRICT`/`SET NULL`
* **성능**: 날짜/상태/관계키에 인덱스 적용. 텍스트 검색은 초기 LIKE, 추후 `pg_trgm` 확장 고려
* **라벨/색상**: 프론트에서 코드→한글 라벨/색상 맵핑 (설정 화면은 읽기 전용)
* **사람친화 코드**: `equipment.code`는 서버에서 생성 규칙 적용(`EQP-YYYY-XXXXXX`)
* **시드 데이터**: 원하면 별도 `INSERT` 스크립트 제공 가능
