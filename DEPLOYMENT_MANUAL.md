# 🚀 유니텍 관리시스템 배포 메뉴얼

## 📋 프로젝트 개요

**Node.js + Supabase + Vercel + Render** 기반의 완전 자동화 배포 시스템

### 🔗 배포된 URL
- **프론트엔드**: https://total-admin-brown.vercel.app
- **백엔드 API**: https://admin-system-i2qw.onrender.com
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

# 기본 폴더 구조
mkdir -p public scripts src/types supabase/migrations .github/workflows
```

### 2단계: 핵심 파일들 생성

#### `server.js` (Express 서버)
```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

// Supabase 클라이언트
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API 엔드포인트
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'total-admin',
    version: '1.0.0'
  });
});

app.get('/api/employees', async (req, res) => {
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email')
    .order('id');
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.listen(port, () => {
  console.log(`✅ 서버 실행: http://localhost:${port}`);
});
```

#### `vercel.json` (Vercel 설정)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./server.js",
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
      "dest": "./server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"
    }
  ]
}
```

#### `render.yaml` (Render 설정)
```yaml
services:
  - type: web
    name: total-admin-api
    env: node
    plan: free
    buildCommand: "npm install"
    startCommand: "node server.js"
    autoDeploy: true
    healthCheckPath: /healthz
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### `package.json` 스크립트 추가
```json
{
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "pipeline": "powershell -ExecutionPolicy Bypass -File ./scripts/pipeline.ps1",
    "typegen": "npx supabase gen types typescript --linked > src/types/db.ts",
    "seed": "node ./scripts/seed.js",
    "dbpush": "npx supabase db push --linked"
  }
}
```

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

## 📊 API 엔드포인트

### 현재 구현된 API
- `GET /healthz` - 서버 상태 확인
- `GET /api` - API 정보
- `GET /api/employees` - 직원 목록
- `POST /api/employees` - 새 직원 추가
- `GET /api/test-db` - DB 연결 테스트

### API 사용 예시
```javascript
// 직원 목록 조회
fetch('https://admin-system-i2qw.onrender.com/api/employees')
  .then(response => response.json())
  .then(data => console.log(data));

// 새 직원 추가
fetch('https://admin-system-i2qw.onrender.com/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});
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
```bash
# 1. 환경변수 모두 설정했는지 확인
# 2. package.json main: "server.js" 확인
# 3. render.yaml 설정 확인
# 4. 빌드 로그 확인
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

## 📈 향후 개발 계획

### Phase 1: 기본 CRUD
- [ ] 제조장비 관리 모듈
- [ ] A/S 요청 관리 시스템  
- [ ] 부서별 권한 관리

### Phase 2: 고급 기능
- [ ] 실시간 알림 (WebSocket)
- [ ] 데이터 내보내기 (Excel/CSV)
- [ ] 대시보드 통계 차트

### Phase 3: 운영 개선
- [ ] 로그 모니터링
- [ ] 성능 최적화
- [ ] 보안 강화 (JWT)

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
**🔄 업데이트**: 실제 사용 중 발견된 이슈 반영  
**✅ 검증 완료**: 전체 배포 프로세스 테스트 완료