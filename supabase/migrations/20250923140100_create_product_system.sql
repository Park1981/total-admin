-- 제품 관리 시스템 DB 스키마
-- 2025-09-23: 맞춤형 제작업에 최적화된 제품 템플릿 + 옵션 시스템

-- 1. 제품 템플릿 (기본 모델들)
CREATE TABLE product_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) UNIQUE NOT NULL,     -- CH-LARGE, CH-SMALL, PUMP, PARTS 등
    template_name VARCHAR(200) NOT NULL,           -- 대형챔버시스템, 소형챔버시스템 등
    category VARCHAR(100) NOT NULL,                -- 챔버시스템, 측정장비, 소모품
    description TEXT,                               -- 제품 설명
    base_specifications JSONB,                     -- 기본 사양 (JSON 형태)

    -- 이미지 및 파일
    main_image_url TEXT,                           -- 메인 이미지
    image_urls TEXT[],                             -- 추가 이미지들
    catalog_file_url TEXT,                         -- 카탈로그 파일

    -- 소모품 여부
    is_consumable BOOLEAN DEFAULT FALSE,           -- 소모품인지 여부

    -- 상태
    status VARCHAR(20) DEFAULT 'active',           -- active, inactive, draft

    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES employees(employee_id)
);

-- 2. 제품 옵션 (미리 정의된 선택지들)
CREATE TABLE product_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES product_templates(template_id) ON DELETE CASCADE,

    -- 옵션 분류
    option_type VARCHAR(50) NOT NULL,              -- size, channel, temperature, feature 등
    option_type_label VARCHAR(100) NOT NULL,      -- 크기, 채널수, 온도범위, 추가기능 등

    -- 옵션 값
    option_value VARCHAR(200) NOT NULL,           -- 24m³, 9ch, 15~40°C 등
    option_label VARCHAR(200) NOT NULL,           -- 사용자에게 보여질 라벨

    -- 추가 정보
    additional_specs JSONB,                       -- 이 옵션 선택시 추가되는 사양
    is_default BOOLEAN DEFAULT FALSE,             -- 기본 선택 옵션인지
    sort_order INTEGER DEFAULT 0,                -- 표시 순서

    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES employees(employee_id)
);

-- 3. 제품 카테고리 (참조용)
CREATE TABLE product_categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_code VARCHAR(50) UNIQUE NOT NULL,    -- CHAMBER, EQUIPMENT, PARTS
    category_name VARCHAR(100) NOT NULL,          -- 챔버시스템, 측정장비, 소모품
    description TEXT,
    parent_category_id UUID REFERENCES product_categories(category_id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_product_templates_category ON product_templates(category);
CREATE INDEX idx_product_templates_code ON product_templates(template_code);
CREATE INDEX idx_product_templates_status ON product_templates(status);

CREATE INDEX idx_product_options_template ON product_options(template_id);
CREATE INDEX idx_product_options_type ON product_options(option_type);
CREATE INDEX idx_product_options_sort ON product_options(template_id, option_type, sort_order);

-- 샘플 카테고리 데이터 삽입
INSERT INTO product_categories (category_code, category_name, description) VALUES
('CHAMBER', '챔버시스템', 'VOC 및 포름알데히드 측정용 챔버 시스템'),
('EQUIPMENT', '측정장비', '샘플링펌프 및 기타 측정 장비'),
('PARTS', '소모품', '교체용 부품 및 소모성 자재'),
('AUTOCLAVE', '멸균기', '오토클레이브 및 멸균 장비');

-- 샘플 제품 템플릿 데이터 삽입
INSERT INTO product_templates (template_code, template_name, category, description, base_specifications, is_consumable) VALUES
('CH-LARGE', '대형 챔버 시스템', 'CHAMBER', '대형 건축 내장재, 가구, 가전제품 등 대형 시험체의 VOC 및 포름알데히드 분석 솔루션',
 '{"온도범위": "15~30°C", "습도범위": "30~80%RH", "온도정밀도": "±0.5°C", "습도정밀도": "±3%RH"}', FALSE),

('CH-SMALL', '소형 챔버 시스템', 'CHAMBER', '건축자재 및 가구 VOC/포름알데히드 포집장치',
 '{"온도범위": "15~30°C", "온도정밀도": "±0.2°C", "기본채널": "9ch"}', FALSE),

('PUMP-SAMPLING', '샘플링펌프', 'EQUIPMENT', '각종 시험에서의 공기 포집 최고의 솔루션',
 '{"유량정밀도": "±3%", "기본채널": "2ch", "타이머기능": "있음"}', FALSE),

('AUTO-CLAVE', '멸균기(Auto Clave)', 'AUTOCLAVE', '멸균기(AUTOCLAVE) 시리즈',
 '{"온도범위": "100~137°C", "용적": "40L", "형식": "CLS-40S"}', FALSE);

-- 샘플 옵션 데이터 삽입 (대형 챔버)
INSERT INTO product_options (template_id, option_type, option_type_label, option_value, option_label, is_default, sort_order)
SELECT t.template_id, 'size', '크기', '24m³', '24m³ (4.0×3.0×2.0m)', TRUE, 1
FROM product_templates t WHERE t.template_code = 'CH-LARGE';

INSERT INTO product_options (template_id, option_type, option_type_label, option_value, option_label, sort_order)
SELECT t.template_id, 'size', '크기', '26m³', '26m³ (4.0×3.5×2.8m)', 2
FROM product_templates t WHERE t.template_code = 'CH-LARGE';

INSERT INTO product_options (template_id, option_type, option_type_label, option_value, option_label, sort_order)
SELECT t.template_id, 'size', '크기', '40m³', '40m³ (5.0×4.0×2.0m)', 3
FROM product_templates t WHERE t.template_code = 'CH-LARGE';

-- 샘플 옵션 데이터 삽입 (소형 챔버)
INSERT INTO product_options (template_id, option_type, option_type_label, option_value, option_label, is_default, sort_order)
SELECT t.template_id, 'channel', '채널수', '9ch', '9채널', TRUE, 1
FROM product_templates t WHERE t.template_code = 'CH-SMALL';

INSERT INTO product_options (template_id, option_type, option_type_label, option_value, option_label, sort_order)
SELECT t.template_id, 'channel', '채널수', '12ch', '12채널', 2
FROM product_templates t WHERE t.template_code = 'CH-SMALL';

INSERT INTO product_options (template_id, option_type, option_type_label, option_value, option_label, sort_order)
SELECT t.template_id, 'channel', '채널수', '18ch', '18채널', 3
FROM product_templates t WHERE t.template_code = 'CH-SMALL';

-- 업데이트 트리거 설정
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_templates_modtime
    BEFORE UPDATE ON product_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();