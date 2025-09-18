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
- Currently uses 'customers' table as primary entity (acting as employees)
- Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
- TypeScript types auto-generated in src/types/db.ts

**API Design**
- RESTful endpoints under /api prefix (routed through backend/routes/)
- Health check at /healthz endpoint
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
- Database operations currently focused on 'customers' table
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