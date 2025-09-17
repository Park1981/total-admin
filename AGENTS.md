# Repository Guidelines

## 프로젝트 구조 & 모듈
- `backend/`: Express 앱 코어 (`app.js`, `server.js`), `routes/`, `controllers/`, `services/`, `lib/supabaseClient.js`
- `public/`: 정적 자산과 HTML 엔트리
- `supabase/migrations/`: Supabase CLI로 관리하는 SQL 마이그레이션
- `scripts/`: 개발 유틸 스크립트 (`pipeline.ps1`, `seed.js`)
- `src/types/db.ts`: Supabase 링크에서 생성된 타입 정의
- `docs/`, `config/`, `.github/`: 문서, 배포 설정, CI/CD 워크플로

## 빌드·테스트·로컬 실행
- `npm run dev` / `npm start`: 로컬 API 실행 (기본 `PORT=3001`)
- `npm test`: Jest(+Supertest) 테스트 실행 (ESM 구성)
- `npm run seed`: 데모 데이터 시드 (Supabase 환경변수 필요)
- `npm run typegen`: Supabase 타입 생성 → `src/types/db.ts`
- `npm run dbpush`: 링크된 DB에 마이그레이션 적용
- `npm run pipeline`: Windows PowerShell 작업 헬퍼

## 코딩 스타일 & 네이밍
- Node.js ESM (`type: module`): `import`/`export` 사용
- 들여쓰기 2칸, 탭 금지
- 파일명: `kebab-case` + 레이어 접미사 (예: `employees.route.js`, `.controller.js`, `.service.js`)
- 라우트는 얇게, 데이터 접근은 `services/`, Supabase는 `lib/supabaseClient.js` 재사용

## 테스트 가이드
- 프레임워크: Jest + Supertest (ESM)
- ESM 모킹: `jest.unstable_mockModule` + 동적 `import()` 패턴 (참고: `backend/server.test.js`)
- 테스트 파일명: 대상/행동 중심 (예: `server.test.js`)
- 실행: `npm test` (단위 테스트 우선, 필요한 곳에 집중 추가)

## 커밋 & PR
- 커밋: 명령형 한 줄 요약(“Add employees list endpoint”), 작은 단위로 묶기
- 이슈 참조: 본문에 `#123` 링크
- PR: 변경 요약, 이유, 스크린샷(UI 시), 테스트 방법 포함. 관련 이슈 연결

## 보안 & 설정
- 필수 환경변수: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (로컬 `.env`, 커밋 금지)
- 배포/환경은 `config/`, `render.yaml` 참고. 비밀정보는 절대 저장소에 올리지 말기
