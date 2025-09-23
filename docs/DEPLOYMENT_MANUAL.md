# 🚀 유니태크(주) 관리시스템 배포 메뉴얼
> UNITECH Co., Ltd. - UNITECH PORTAL 배포 가이드

## 📋 프로젝트 개요

**Node.js + Supabase + Vercel + Render** 기반의 완전 자동화 배포 시스템

### 🔗 배포된 URL
- **프론트엔드**: https://total-admin-brown.vercel.app
- **백엔드 API**: https://total-admin.onrender.com
- **GitHub**: https://github.com/Park1981/total-admin
- **데이터베이스**: Supabase (tgxmccwadzxjnxxusupw.supabase.co)

## 🛠️ 기술 스택

### Frontend (Vercel)
- **HTML/CSS/JavaScript**: 반응형 관리 페이지
- **자동 배포**: GitHub push → Vercel 자동 빌드
- **CDN**: 전 세계 배포

### Backend (Render)
- **Node.js + Express**: RESTful API 서버
- **Supabase JS**: 데이터베이스 연동
- **자동 배포**: GitHub push → Render 자동 빌드

### Database (Supabase)
- **PostgreSQL**: 클라우드 데이터베이스
- **RLS**: Row Level Security 적용
- **자동 타입 생성**: TypeScript 지원

---

## 📁 프로젝트 폴더 구조

### ✅ **최적화된 폴더 구조 (2024-09-16 개선)**
```
📁 total-admin/
├── 🌐 public/              (프론트엔드)
│   ├── index.html
│   ├── dashboard.html
│   └── test.html
│
├── ⚙️ backend/             (백엔드 서버)
│   ├── app.js              (Express 앱 구성)
│   ├── server.js           (Express 서버 실행)
│   ├── server.test.js      (API 테스트)
│   ├── 📁 lib/
│   │   └── supabaseClient.js
│   ├── 📁 routes/
│   │   ├── index.js
│   │   └── employees.route.js
│   ├── 📁 controllers/
│   │   └── employees.controller.js
│   └── 📁 services/
│       └── employees.service.js
│
├── 🔧 config/              (설정 파일들)
│   ├── render.yaml
│   ├── render-env-vars.txt
│   └── render-setup-guide.md
│
├── 📜 docs/                (문서)
│   ├── DEPLOYMENT_MANUAL.md
│   └── QUICK_START.md
│
├── 📜 scripts/             (자동화 스크립트)
├── 📜 src/                 (타입 정의)
├── 📜 supabase/            (DB 마이그레이션)
├── 📄 package.json         (의존성 관리)
└── 📄 vercel.json          (Vercel 설정)
```

### 🎯 **구조 설명**
- **public/**: 정적 HTML 파일들 (Vercel에서 서빙)
- **backend/**: Express.js API 서버 (Render에서 실행)
- **config/**: 배포 및 환경 설정 파일들
- **docs/**: 프로젝트 문서 (메뉴얼, 가이드)

---

## 🚀 전체 배포 프로세스 (처음부터)

### 1단계: 프로젝트 기본 구조 생성

```bash
# 프로젝트 폴더 생성
mkdir total-admin
cd total-admin

# package.json 초기화
npm init -y
npm pkg set type="module"

# 필수 의존성 설치
npm install express cors @supabase/supabase-js dotenv

# 개선된 폴더 구조
mkdir -p public backend config docs scripts src/types supabase/migrations .github/workflows
```

### 2단계: 핵심 파일들 생성

#### `backend/lib/supabaseClient.js` (Supabase 공용 클라이언트)
```javascript
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### `backend/app.js` (Express 앱 구성)
```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import apiRouter from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// App-level routes
app.get('/healthz', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'total-admin',
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// API routes
app.use('/api', apiRouter);

export default app;
```

#### `backend/server.js` (Express 서버 실행)
```javascript
import app from './app.js';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ 유니태크(주) 관리시스템 서버 실행 중: http://localhost:${port}`);
  console.log(`📊 테스트 페이지: http://localhost:${port}`);
  console.log(`🔗 API 엔드포인트: http://localhost:${port}/api`);
});
```

#### `vercel.json` (Vercel 설정) - 루트에 위치
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "./public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*\\.(css|js|png|jpg|jpeg|gif|ico|svg))",
      "dest": "/public/$1"
    },
    {
      "src": "/",
      "dest": "/public/index.html"
    },
    {
      "src": "/api/(.*)",
      "dest": "./backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"
    }
  ]
}
```

#### `config/render.yaml` (Render 설정)
```yaml
services:
  - type: web
    name: total-admin-api
    env: node
    plan: free
    buildCommand: "npm install"
    startCommand: "node backend/server.js"
    autoDeploy: true
    healthCheckPath: /healthz
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### `package.json` 완전한 설정 (⚠️ 중요)
```json
{
  "name": "total-admin",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
    "pipeline": "powershell -ExecutionPolicy Bypass -File ./scripts/pipeline.ps1",
    "typegen": "npx supabase gen types typescript --linked > src/types/db.ts",
    "seed": "node ./scripts/seed.js",
    "dbpush": "npx supabase db push --linked",
    "start": "node backend/server.js",
    "dev": "node backend/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "cross-env": "^10.0.0",
    "jest": "^30.1.3",
    "supabase": "^2.40.7",
    "supertest": "^7.1.4"
  }
}
```

**⚠️ 중요**: `@supabase/supabase-js`와 `dotenv`는 반드시 `dependencies`에 있어야 함! `devDependencies`에 있으면 production 배포시 설치되지 않아서 에러 발생!

### 3단계: Supabase 설정

```bash
# Supabase CLI 설치 (로컬 프로젝트)
npm install supabase --save-dev

# Supabase 로그인
npx supabase login

# 프로젝트 연결
npx supabase link --project-ref your-project-ref

# 스키마 생성 (예시)
npx supabase db diff --file supabase/migrations/initial.sql

# DB 푸시
npx supabase db push --linked

# 타입 생성
npx supabase gen types typescript --linked > src/types/db.ts
```

### 4단계: GitHub 저장소 설정

```bash
# Git 초기화
git init
git add .
git commit -m "🎉 초기 프로젝트 설정"

# GitHub 저장소 생성 (GitHub CLI 사용)
set GH_TOKEN=your-github-token
gh repo create Park1981/total-admin --public --source=. --push
```

### 5단계: Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# Vercel 배포
vercel --prod --yes
```

**또는 웹에서:**
1. https://vercel.com 접속
2. GitHub 저장소 연결
3. 자동 배포 설정

### 6단계: Render 배포

**Render 웹사이트에서:**
1. https://render.com 접속
2. "New Web Service" 생성
3. GitHub 저장소 연결: `Park1981/total-admin`
4. 환경변수 설정:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_DB_PW=your-db-password
   NODE_ENV=production
   PORT=10000
   ```

---

## 🔄 자동 배포 워크플로우

### Git Push → 자동 배포
```bash
# 코드 수정 후
git add .
git commit -m "✨ 새로운 기능 추가"
git push origin master

# 자동으로 실행됨:
# 1. GitHub → Vercel 빌드 트리거
# 2. GitHub → Render 빌드 트리거
# 3. 1-3분 후 배포 완료
```

### 파이프라인 스크립트 사용
```bash
# 전체 개발 워크플로우 실행
npm run pipeline

# 개별 명령어
npm run typegen    # 타입 생성
npm run seed       # 시드 데이터
npm run dbpush     # DB 마이그레이션
```

---

## 📊 API 엔드포인트 (2025-09-23 업데이트)

### 현재 구현된 API
#### 시스템 관리
- `GET /healthz` - 서버 상태 확인
- `GET /api` - API 정보

#### 인증 시스템
- `POST /api/employees/login` - 로그인 (username/password)
- `GET /api/employees` - 직원 목록
- `POST /api/employees` - 새 직원 추가

#### 제품관리 시스템 (NEW)
- `GET /api/products/templates` - 제품 템플릿 목록
- `GET /api/products/options/:templateId` - 템플릿별 옵션
- `GET /api/products/categories` - 제품 카테고리
- `POST /api/products/templates` - 새 템플릿 생성 (예정)

### 데이터베이스 스키마 (2025-09-23)
```sql
-- 제품 관리 시스템
product_templates (
  template_id UUID PRIMARY KEY,
  template_code VARCHAR(50) UNIQUE,
  template_name VARCHAR(200),
  category VARCHAR(100),
  base_specifications JSONB,
  is_consumable BOOLEAN
);

product_options (
  option_id UUID PRIMARY KEY,
  template_id UUID REFERENCES product_templates,
  option_type VARCHAR(50),        -- size, channel, temperature
  option_value VARCHAR(200),      -- 24m³, 9ch, 15~40°C
  option_label VARCHAR(200)       -- 사용자 표시용
);

product_categories (
  category_id UUID PRIMARY KEY,
  category_code VARCHAR(50),      -- CHAMBER, EQUIPMENT, PARTS
  category_name VARCHAR(100)      -- 챔버시스템, 측정장비, 소모품
);
```

### API 사용 예시
```javascript
// 로그인
fetch('https://total-admin.onrender.com/api/employees/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

// 제품 템플릿 조회
fetch('https://total-admin.onrender.com/api/products/templates')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 🛠️ 개발 환경 설정

### 로컬 개발 서버
```bash
# 개발 서버 실행
npm start
# → http://localhost:3001

# 또는 다른 포트
PORT=8787 npm start
```

### 환경변수 (.env)
```env
API_BASE_URL=http://localhost:3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_PW=your-db-password
```

### 테스트 환경
```bash
# 모든 테스트 실행
npm test
```
- `backend` 폴더 내의 `*.test.js` 파일을 찾아 자동으로 테스트를 실행합니다.
- `jest.unstable_mockModule`을 사용하여 DB나 외부 API를 모킹(mocking)할 수 있습니다.
- 테스트 실행 전, `.env` 파일에 `SUPABASE_URL`과 `SUPABASE_ANON_KEY`가 설정되어 있어야 합니다. (모킹되지 않은 테스트의 경우)

---

## 🔧 문제 해결 가이드

### Vercel 배포 실패
```bash
# 1. vercel.json 확인
# 2. Node.js 버전 문제면 프로젝트 설정에서 18.x로 변경
# 3. 빌드 로그 확인
vercel logs
```

### Render 배포 실패

#### 에러 1: `Cannot find module '/opt/render/project/src/index.js'`
**원인**: Render가 잘못된 진입점을 찾고 있음
**해결책**:
```bash
# 1. package.json 확인 - main: "server.js"여야 함
# 2. render.yaml 확인 - startCommand: "node backend/server.js"여야 함  
# 3. Render 대시보드에서 Start Command 직접 확인/수정
# 4. Manual Deploy 실행
```

#### 에러 2: `Cannot find package '@supabase/supabase-js'`
**원인**: Production에 필요한 패키지가 devDependencies에 있음
**해결책**:
```json
// package.json에서 dependencies로 이동
"dependencies": {
  "@supabase/supabase-js": "^2.57.4",
  "dotenv": "^17.2.2",
  "cors": "^2.8.5", 
  "express": "^5.1.0"
}
```

### Supabase 연결 실패
```bash
# 1. 프로젝트 연결 확인
npx supabase status

# 2. 환경변수 확인
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# 3. 권한 확인 (RLS 정책)
# 4. DB 연결 테스트
curl https://your-api/api/test-db
```

---

## 📈 개발 현황 및 계획 (2025-09-23 업데이트)

### ✅ 완료된 기능 (Phase 1)
- [x] **인증 시스템**: 로그인, 세션 관리, bcrypt 암호화
- [x] **글래스모피즘 UI**: 다크/라이트 테마, 반응형 디자인
- [x] **대시보드**: 통계 카드, 최근 활동, 토스트 알림
- [x] **제품관리 기반**: 템플릿+옵션 시스템, 카테고리 분류
- [x] **자동화**: GitHub Actions, DB 유지 스크립트

### 🔄 현재 작업 중 (Phase 2)
- [ ] **제품 추가 기능**: 새 템플릿 생성 폼
- [ ] **옵션 관리**: 동적 옵션 추가/수정
- [ ] **제품 수정/삭제**: CRUD 완성

### 📋 단기 계획 (1-2주)
- [ ] **거래처 관리**: 고객사/공급업체 등록
- [ ] **납품 관리**: 주문서/납품서 시스템
- [ ] **A/S 관리**: 일정 포함 서비스 관리

### 🚀 중장기 계획 (1-3개월)
- [ ] **파일 업로드**: 이미지, 카탈로그 관리
- [ ] **검색/필터**: 고급 검색 기능
- [ ] **대시보드 차트**: 실시간 통계 시각화
- [ ] **알림 시스템**: 웹푸시, 이메일 알림
- [ ] **모바일 앱**: PWA 또는 React Native

---

## ✅ 배포 성공 체크리스트

### 필수 파일 확인
- [ ] `package.json` - main: "server.js", type: "module"
- [ ] `package.json` - @supabase/supabase-js, dotenv가 dependencies에 있음
- [ ] `server.js` - Express 서버 파일 존재
- [ ] `vercel.json` - Vercel 라우팅 설정
- [ ] `render.yaml` - startCommand: "node backend/server.js"
- [ ] `public/index.html` - 프론트엔드 페이지

### Render 배포 확인
- [ ] https://total-admin.onrender.com/healthz 응답함
- [ ] Start Command가 "node server.js"로 설정됨
- [ ] 환경변수 모두 설정됨 (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] 빌드 로그에 에러 없음

### Vercel 배포 확인  
- [ ] https://total-admin-brown.vercel.app 로딩됨
- [ ] "API 연결 테스트" 버튼 작동함
- [ ] "직원 목록 불러오기" 버튼 작동함

### 전체 시스템 테스트
- [ ] Frontend → Backend API 연결됨
- [ ] Backend → Supabase 데이터베이스 연결됨
- [ ] 실제 데이터 조회/입력 가능함

---

## 🔐 보안 체크리스트

### 배포 전 확인사항
- [ ] .env 파일 .gitignore에 포함
- [ ] GitHub 저장소에 토큰 없음
- [ ] Supabase RLS 정책 설정
- [ ] API Rate Limiting 설정
- [ ] CORS 도메인 제한

### 정기 점검
- [ ] 의존성 업데이트 (월 1회)
- [ ] SSL 인증서 확인
- [ ] 로그 분석 및 정리
- [ ] 백업 데이터 확인

---

## 📞 지원 및 문의

### 공식 문서
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs  
- **Supabase**: https://supabase.com/docs

### 트러블슈팅
1. **GitHub Issues**: 프로젝트별 이슈 관리
2. **Discord/Slack**: 실시간 개발 지원
3. **문서 업데이트**: 새로운 문제 해결 시 메뉴얼 업데이트

---

**📝 작성일**: 2025년 9월 16일
**🔄 마지막 업데이트**: 2025년 9월 23일 (제품관리 시스템 추가)
**✅ 검증 완료**: 전체 배포 프로세스 및 제품관리 기능 테스트 완료