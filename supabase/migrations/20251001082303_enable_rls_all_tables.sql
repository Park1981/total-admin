-- =====================================================
-- RLS (Row Level Security) 활성화
-- 목적: Supabase Security Advisor 경고 해결
-- 날짜: 2025-10-01
-- =====================================================

-- 서버 전용 환경이므로 RLS만 활성화, 정책(Policy)은 생성하지 않음
-- Service Role Key는 RLS를 우회하므로 정책 불필요

-- =====================================================
-- 1. 제품 관리 시스템
-- =====================================================

ALTER TABLE public.product_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_models ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. 거래처 관리 시스템
-- =====================================================

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. 납품 관리 시스템
-- =====================================================

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. A/S 관리 시스템
-- =====================================================

ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. 기타 시스템 테이블
-- =====================================================

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 참고 사항:
-- - RLS 활성화로 외부 공격 차단
-- - 서버는 SUPABASE_SERVICE_ROLE_KEY로 접근하여 RLS 우회
-- - 클라이언트는 API를 통해서만 접근 (직접 DB 접근 불가)
-- =====================================================
