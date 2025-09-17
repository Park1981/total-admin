-- Drop customers table and add sample employee data
-- 기존 customers 테이블 삭제 및 직원 샘플 데이터 추가

BEGIN;

-- 1. customers 테이블 삭제
DROP TABLE IF EXISTS customers;

-- 2. employees 테이블에 샘플 데이터 삽입
-- 비밀번호는 일단 평문으로 (나중에 bcrypt로 변경)
INSERT INTO employees (username, password_hash, name, title, mobile, email, role, active) VALUES
('admin', 'admin123', '관리자', '시스템 관리자', '010-1111-1111', 'admin@unitech.co.kr', 'admin', true),
('manager1', 'manager123', '김매니저', '생산팀장', '010-2222-2222', 'manager1@unitech.co.kr', 'manager', true),
('staff1', 'staff123', '이직원', '기술사원', '010-3333-3333', 'staff1@unitech.co.kr', 'staff', true),
('staff2', 'staff123', '박사원', 'A/S 담당', '010-4444-4444', 'staff2@unitech.co.kr', 'staff', true),
('jpark', 'jpark123', '박정완', '개발팀장', '010-5555-5555', 'jpark@unitech.co.kr', 'manager', true);

-- 3. 기본 거래처 및 납품지 샘플 데이터
INSERT INTO accounts (name, type, main_phone, main_email, region) VALUES
('삼성전자', 'customer', '02-2255-0114', 'contact@samsung.com', '수원'),
('LG화학', 'customer', '02-3773-1114', 'info@lgchem.com', '여의도'),
('포스코', 'customer', '054-220-0114', 'contact@posco.com', '포항'),
('현대자동차', 'customer', '02-3464-1114', 'info@hyundai.com', '양재');

-- 4. 납품지 샘플 데이터 (각 거래처별로 1-2개씩)
INSERT INTO sites (account_id, name, address, contact_person, contact_phone, contact_email)
SELECT
    a.account_id,
    CASE
        WHEN a.name = '삼성전자' THEN '기흥 반도체 공장'
        WHEN a.name = 'LG화학' THEN '여의도 본사 R&D센터'
        WHEN a.name = '포스코' THEN '포항제철소 1공장'
        WHEN a.name = '현대자동차' THEN '울산공장 품질센터'
    END as name,
    CASE
        WHEN a.name = '삼성전자' THEN '경기도 용인시 기흥구'
        WHEN a.name = 'LG화학' THEN '서울 영등포구 여의도동'
        WHEN a.name = '포스코' THEN '경북 포항시 남구'
        WHEN a.name = '현대자동차' THEN '울산광역시 북구'
    END as address,
    CASE
        WHEN a.name = '삼성전자' THEN '김기흥'
        WHEN a.name = 'LG화학' THEN '이여의'
        WHEN a.name = '포스코' THEN '박포항'
        WHEN a.name = '현대자동차' THEN '정울산'
    END as contact_person,
    CASE
        WHEN a.name = '삼성전자' THEN '031-1234-5678'
        WHEN a.name = 'LG화학' THEN '02-5678-1234'
        WHEN a.name = '포스코' THEN '054-9876-5432'
        WHEN a.name = '현대자동차' THEN '052-1111-2222'
    END as contact_phone,
    CASE
        WHEN a.name = '삼성전자' THEN 'kiheung@samsung.com'
        WHEN a.name = 'LG화학' THEN 'yeouido@lgchem.com'
        WHEN a.name = '포스코' THEN 'pohang@posco.com'
        WHEN a.name = '현대자동차' THEN 'ulsan@hyundai.com'
    END as contact_email
FROM accounts a;

-- 5. 장비 모델 샘플 데이터
INSERT INTO equipment_models (model_name, category, spec) VALUES
('대기오염측정기 AP-1000', '대기측정', '{"measurement_range": "PM2.5, PM10, SO2, NO2", "accuracy": "±5%", "power": "220V"}'),
('수질분석기 WQ-500', '수질측정', '{"parameters": "pH, DO, COD, BOD", "range": "0-14 pH", "power": "12V DC"}'),
('소음측정기 NM-200', '소음측정', '{"range": "30-130 dB", "frequency": "20Hz-20kHz", "accuracy": "±1.5dB"}'),
('진동측정기 VM-300', '진동측정', '{"range": "0.1-1000 Hz", "sensitivity": "100mV/g", "temp_range": "-40~85°C"}');

-- 6. 장비 샘플 데이터
INSERT INTO equipment (code, name, model_id, serial_no, purchase_type, status, notes)
SELECT
    'EQP-2025-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
    CASE
        WHEN ROW_NUMBER() OVER() = 1 THEN '대기오염측정기 #001'
        WHEN ROW_NUMBER() OVER() = 2 THEN '수질분석기 #001'
        WHEN ROW_NUMBER() OVER() = 3 THEN '소음측정기 #001'
        WHEN ROW_NUMBER() OVER() = 4 THEN '진동측정기 #001'
        WHEN ROW_NUMBER() OVER() = 5 THEN '대기오염측정기 #002'
    END,
    model_id,
    CASE
        WHEN ROW_NUMBER() OVER() = 1 THEN 'AP1000-2024-001'
        WHEN ROW_NUMBER() OVER() = 2 THEN 'WQ500-2024-001'
        WHEN ROW_NUMBER() OVER() = 3 THEN 'NM200-2024-001'
        WHEN ROW_NUMBER() OVER() = 4 THEN 'VM300-2024-001'
        WHEN ROW_NUMBER() OVER() = 5 THEN 'AP1000-2024-002'
    END,
    CASE
        WHEN ROW_NUMBER() OVER() <= 3 THEN '제조'
        ELSE '구매대행'
    END,
    'stored',
    CASE
        WHEN ROW_NUMBER() OVER() = 1 THEN '신규 제작 완료, 검교정 대기'
        WHEN ROW_NUMBER() OVER() = 2 THEN '고객사 납품 예정'
        ELSE '재고 보관 중'
    END
FROM equipment_models;

COMMIT;