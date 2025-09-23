# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm start              # Start development server (backend/server.js on port 3001)
npm run dev            # Same as npm start
npm run pipeline       # Execute full development pipeline (recommended)
npm test              # Run Jest test suite (backend/*.test.js)
```

### Database Operations
```bash
npm run typegen        # Generate TypeScript types from Supabase schema
npm run dbpush         # Apply migrations to linked Supabase project
npm run seed          # Insert seed data using scripts/seed.js
```

### Project Setup
```bash
supabase login         # Authenticate with Supabase CLI
supabase link --project-ref your-project-ref  # Link to Supabase project
supabase db pull       # Pull latest schema changes
```

## Project Architecture

### Technology Stack
- **Backend**: Node.js + Express.js (ES modules, MVC pattern)
- **Database**: Supabase (PostgreSQL with automatic migrations)
- **Frontend**: Static HTML/CSS/JavaScript served from public/
- **Testing**: Jest with supertest for API testing
- **Deployment**: Vercel (frontend) + Render (backend API)
- **Package Manager**: npm with package-lock.json

### Key Architecture Patterns

**MVC Structure (Refactored)**
- `backend/app.js`: Express app configuration and middleware
- `backend/server.js`: Server startup and port binding
- `backend/lib/supabaseClient.js`: Shared Supabase client instance
- `backend/routes/`: Route definitions (index.js, employees.route.js)
- `backend/controllers/`: Business logic handlers (employees.controller.js)
- `backend/services/`: Data access layer (employees.service.js)
- `backend/server.test.js`: API endpoint testing

**Supabase Integration**
- Centralized client in `backend/lib/supabaseClient.js`
- Currently uses 'employees' table for authentication and user management
- Migration completed: customers → employees (2025-09-17)
- Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
- TypeScript types auto-generated in src/types/db.ts

**API Design**
- RESTful endpoints under /api prefix (routed through backend/routes/)
- Health check at /healthz endpoint
- Login endpoint: POST /api/employees/login (username/password auth)
- Static file serving from public/ directory
- CORS enabled for cross-origin requests
- Modular route organization

**Testing Framework**
- Jest configured with ES modules support
- API testing with supertest
- Mocking capabilities for external dependencies
- Run with `npm test`

### Project Structure Context
```
total-admin/
├── backend/           # Express.js server (MVC structure)
│   ├── app.js         # Express app configuration
│   ├── server.js      # Server startup
│   ├── server.test.js # API tests
│   ├── lib/           # Shared utilities
│   ├── routes/        # Route definitions
│   ├── controllers/   # Request handlers
│   └── services/      # Data access layer
├── public/           # Frontend static files
├── scripts/          # Automation scripts (pipeline.ps1, seed.js)
├── src/types/        # Generated TypeScript definitions
├── supabase/         # Database migrations and configuration
├── config/           # Configuration files
└── docs/             # Project documentation
```

### Development Workflow

**Pipeline Process (npm run pipeline)**
1. Generate diff migration file (auto timestamped)
2. Push database migrations to Supabase
3. Generate TypeScript types from schema
4. Run seed data insertion
5. Execute health check against API_BASE_URL

**Testing Workflow**
- Run `npm test` to execute all tests
- Tests are located in backend/*.test.js files
- API endpoints tested with supertest
- Database operations can be mocked for unit testing

**Environment Configuration**
- .env file contains SUPABASE_URL, SUPABASE_ANON_KEY, API_BASE_URL
- Scripts/pipeline.ps1 reads SUPABASE_DB_PW for direct database connections
- Vercel deployment configured via vercel.json with routing rules

### Important Notes
- Server runs on port 3001 by default (configurable via PORT env var)
- Database operations use 'employees' table (migrated from customers 2025-09-17)
- Login credentials: admin/admin123, manager1/manager123, staff1/staff123, staff2/staff123, jpark/jpark123
- Frontend calls Render API: https://total-admin.onrender.com/api/employees/login
- Jest test framework configured with ES modules support
- MVC pattern separates concerns for better maintainability
- Pipeline script requires PowerShell execution policy bypass
- Direct database URLs use port 5432 instead of pooler port 6543 for better performance

### ⚠️ CRITICAL: 작업 전 문서 확인 필수
**구조 변경이나 문제 해결 전에 반드시 docs/ 폴더 확인!**
- `docs/DEPLOYMENT_MANUAL.md`: 배포 아키텍처 및 정확한 구조
- `docs/CURRENT_STATUS.md`: 이전 이슈들과 해결된 문제들
- `docs/PLAN.md` & `docs/DB_PLAN.md`: 원래 기획 의도
- **교훈**: 2025-09-18 로그인 문제 해결 과정에서 docs 확인 후 올바른 아키텍처 발견
- **원칙**: 기존 문서가 정답을 담고 있을 가능성이 높음 - 새로 만들기 전에 문서부터!

## 현재 배포 상태 (2025-09-23)

### 배포 URL
- **프론트엔드**: https://total-admin-brown.vercel.app (Vercel)
- **백엔드 API**: https://total-admin.onrender.com (Render)
- **GitHub**: https://github.com/Park1981/total-admin
- **데이터베이스**: Supabase (tgxmccwadzxjnxxusupw.supabase.co)

### 현재 구현된 기능 (2025-09-23 업데이트)

#### 1. 인증 시스템 🔐
- ✅ 로그인 시스템 (employees 테이블 기반, bcrypt 암호화)
- ✅ 글래스모피즘 디자인 (다크/라이트 테마 자동 감지)
- ✅ 세션 관리 (sessionStorage 기반)
- ✅ 계정: admin/admin123, manager1/manager123, jpark/jpark123

#### 2. 대시보드 📊
- ✅ 글래스모피즘 UI (다크/라이트 테마 자동 감지)
- ✅ 실시간 통계 카드 (제품, 납품, 거래처, A/S 현황)
- ✅ 최근 활동 리스트 (각 섹션별 최신 이력)
- ✅ 토스트 알림 시스템 (기존 alert 대신)
- ✅ 메뉴 구조: 제품관리/납품관리/거래처관리/A/S관리

#### 3. 제품관리 시스템 📦
- ✅ 제품 템플릿 기반 구조 (대형챔버, 소형챔버, 샘플링펌프, 멸균기)
- ✅ 옵션 시스템 (크기, 채널수, 기능별 선택 옵션)
- ✅ 카테고리 분류 (CHAMBER, EQUIPMENT, PARTS, AUTOCLAVE)
- ✅ 맞춤형 제작업에 최적화된 유연한 구조
- ✅ 제품 목록 표시 UI (글래스모피즘 디자인)

#### 4. 자동화 시스템 🤖
- ✅ GitHub Actions (4일마다 DB 연결 유지)
- ✅ Supabase 무료 플랜 대응 자동화
- ✅ 자동 배포 (Git push → Vercel/Render)

### 데이터베이스 스키마 (2025-09-23)

#### 핵심 테이블
```sql
-- 사용자 관리
employees (employee_id, username, password_hash, name, role, ...)

-- 제품 시스템 (NEW)
product_templates (template_id, template_code, template_name, category, ...)
product_options (option_id, template_id, option_type, option_value, ...)
product_categories (category_id, category_code, category_name, ...)
```

#### 비즈니스 로직
- **맞춤형 제조**: 템플릿 + 옵션 조합으로 고객 요구사항 대응
- **유연한 구조**: 새로운 제품군 쉽게 추가 가능
- **업계 특성 반영**: 챔버시스템, 측정장비, 소모품, 멸균기 카테고리

