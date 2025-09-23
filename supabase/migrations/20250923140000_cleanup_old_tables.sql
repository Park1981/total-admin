-- 기존 안 쓰는 테이블들 정리 및 새로운 제품 시스템 준비
-- 2025-09-23: 비즈니스 요구사항 변경에 따른 테이블 정리

-- 기존에 있을 수 있는 안 쓰는 테이블들 정리
-- (존재하지 않아도 에러가 나지 않도록 IF EXISTS 사용)

-- 1. 기존 생산관리 관련 테이블들 (사용하지 않음)
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS production_lines CASCADE;
DROP TABLE IF EXISTS production_schedules CASCADE;
DROP TABLE IF EXISTS quality_checks CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;

-- 2. 기존 직원관리 외 테이블들 (employees는 유지)
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS positions CASCADE;

-- 3. 기존 임시/테스트 테이블들
DROP TABLE IF EXISTS temp_data CASCADE;
DROP TABLE IF EXISTS test_table CASCADE;
DROP TABLE IF EXISTS sample_records CASCADE;

-- 4. 기존 customers 테이블 (이미 employees로 마이그레이션됨)
DROP TABLE IF EXISTS customers CASCADE;

-- 정리 완료 로그
INSERT INTO employees (username, name, title, role, mobile, email, active, password_hash, created_at)
SELECT 'system', 'System Log', 'Database Cleanup', 'admin', '000-0000-0000', 'system@unitech.co.kr', false, 'N/A', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE username = 'system');