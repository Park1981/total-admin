# 🚀 Git 연결 및 배포 완전 가이드

> **혹시 까먹을 수도 있으니까 정리해둔 Git 연결부터 배포까지 완전 가이드** 😊

## 📋 목차
1. [로컬 개발 환경 설정](#1-로컬-개발-환경-설정)
2. [GitHub 저장소 연결](#2-github-저장소-연결)
3. [Vercel 배포 설정](#3-vercel-배포-설정)
4. [Render 배포 설정](#4-render-배포-설정)
5. [Supabase 연결](#5-supabase-연결)
6. [자동 배포 워크플로우](#6-자동-배포-워크플로우)
7. [문제 해결 가이드](#7-문제-해결-가이드)

---

## 1. 로컬 개발 환경 설정

### 📁 프로젝트 클론 (새 환경에서)
```bash
# GitHub에서 프로젝트 클론
git clone https://github.com/Park1981/total-admin.git
cd total-admin

# 의존성 설치
npm install

# 환경변수 파일 생성
cp .env.example .env
# .env 파일 편집 (SUPABASE_URL, SUPABASE_ANON_KEY 등)
```

### 🔧 필수 환경변수 (.env)
```env
# Supabase 연결 정보
SUPABASE_URL=https://tgxmccwadzxjnxxusupw.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_DB_PW=your-database-password

# 로컬 개발용
API_BASE_URL=http://localhost:3001
NODE_ENV=development
PORT=3001
```

### 🚀 로컬 서버 실행
```bash
# 개발 서버 시작
npm start
# → http://localhost:3001 접속

# 또는 다른 포트로 실행
PORT=8787 npm start
```

---

## 2. GitHub 저장소 연결

### 🔄 기존 프로젝트에 Git 초기화
```bash
# Git 초기화 (아직 안했다면)
git init

# 원격 저장소 연결
git remote add origin https://github.com/Park1981/total-admin.git

# 현재 브랜치를 master로 설정
git branch -M master

# 첫 번째 커밋
git add .
git commit -m "🎉 초기 프로젝트 설정 및 제품관리 시스템 구현"
git push -u origin master
```

### 📝 일반적인 Git 워크플로우
```bash
# 변경사항 확인
git status
git diff

# 변경사항 스테이징
git add .
# 또는 특정 파일만
git add public/products.html backend/routes/products.js

# 커밋 (의미있는 메시지로)
git commit -m "feat: 제품 추가 기능 구현"

# 원격 저장소에 푸시
git push origin master
```

### 🔍 유용한 Git 명령어
```bash
# 커밋 히스토리 확인
git log --oneline

# 브랜치 확인
git branch -a

# 원격 저장소 상태 확인
git remote -v

# 변경사항 되돌리기 (조심!)
git reset --hard HEAD~1

# 특정 파일 변경사항 되돌리기
git checkout -- filename.js
```

---

## 3. Vercel 배포 설정

### 🌐 Vercel CLI로 배포
```bash
# Vercel CLI 전역 설치
npm install -g vercel

# Vercel 로그인
vercel login

# 프로젝트 배포
vercel --prod

# 배포 상태 확인
vercel ls
```

### 🔧 Vercel 웹 대시보드 설정
1. **https://vercel.com** 접속
2. **"New Project"** 클릭
3. **GitHub 연결** → `Park1981/total-admin` 선택
4. **Framework Preset**: Other
5. **Root Directory**: `./` (기본값)
6. **Build Command**: 비워둠 (정적 파일)
7. **Output Directory**: `public`
8. **Install Command**: `npm install`

### 📋 환경변수 설정 (Vercel)
Vercel 대시보드 → Project Settings → Environment Variables에서 설정:

```env
SUPABASE_URL=https://tgxmccwadzxjnxxusupw.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

### ✅ Vercel 배포 확인
- **URL**: https://total-admin-brown.vercel.app
- **테스트**: 로그인 페이지가 정상적으로 로드되는지 확인
- **API 연결**: 대시보드에서 API 테스트 버튼이 작동하는지 확인

---

## 4. Render 배포 설정

### 🔧 Render 웹 대시보드 설정
1. **https://render.com** 접속
2. **"New Web Service"** 클릭
3. **Connect Repository** → `Park1981/total-admin` 선택

### ⚙️ Render 서비스 설정
```yaml
# 기본 설정
Name: total-admin-api
Environment: Node
Region: Oregon (US West)
Branch: master

# 빌드 설정
Build Command: npm install
Start Command: node backend/server.js

# 고급 설정
Auto-Deploy: Yes
```

### 📋 환경변수 설정 (Render)
Render 대시보드 → Environment에서 설정:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://tgxmccwadzxjnxxusupw.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_PW=your-database-password
```

### ✅ Render 배포 확인
- **URL**: https://total-admin.onrender.com
- **헬스체크**: https://total-admin.onrender.com/healthz
- **API 테스트**: https://total-admin.onrender.com/api

---

## 5. Supabase 연결

### 🔧 Supabase CLI 설정
```bash
# Supabase CLI 설치 (프로젝트 로컬)
npm install supabase --save-dev

# Supabase 로그인
npx supabase login

# 기존 프로젝트 연결
npx supabase link --project-ref tgxmccwadzxjnxxusupw

# 연결 상태 확인
npx supabase status
```

### 📊 데이터베이스 마이그레이션
```bash
# 새 마이그레이션 파일 생성
npx supabase migration new "feature_name"

# 마이그레이션 적용
npx supabase db push

# 스키마에서 타입 생성
npx supabase gen types typescript --linked > src/types/db.ts

# 시드 데이터 실행 (있다면)
npm run seed
```

### 🔄 전체 개발 파이프라인
```bash
# 한 번에 모든 DB 작업 실행
npm run pipeline

# 개별 명령어들
npm run typegen    # 타입 생성
npm run dbpush     # 마이그레이션 적용
npm run seed       # 시드 데이터
```

---

## 6. 자동 배포 워크플로우

### 🔄 완전 자동화된 배포 프로세스

```bash
# 1. 로컬에서 작업
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin master

# 2. 자동으로 실행됨:
# - GitHub → Vercel 자동 빌드 (프론트엔드)
# - GitHub → Render 자동 빌드 (백엔드)
# - 약 1-3분 후 배포 완료

# 3. 배포 확인
curl https://total-admin.onrender.com/healthz
curl https://total-admin-brown.vercel.app
```

### 📊 배포 상태 모니터링
```bash
# Vercel 배포 로그 확인
vercel logs

# Render 로그는 웹 대시보드에서 확인
# https://dashboard.render.com
```

### 🤖 GitHub Actions (DB 유지)
현재 설정된 자동화:
- **주기**: 4일마다 실행
- **목적**: Supabase 무료 플랜 비활성화 방지
- **동작**: 간단한 DB 쿼리로 연결 유지

---

## 7. 문제 해결 가이드

### 🚨 Vercel 배포 실패

#### 문제: "Build failed"
```bash
# 해결 방법
1. vercel.json 파일 확인
2. Node.js 버전 설정 (18.x 권장)
3. 빌드 로그 확인: vercel logs
4. 로컬에서 테스트: npm start
```

#### 문제: "Static files not found"
```bash
# vercel.json 라우팅 확인
{
  "routes": [
    { "src": "/", "dest": "/public/index.html" },
    { "src": "/(.*)", "dest": "/public/index.html" }
  ]
}
```

### 🚨 Render 배포 실패

#### 문제: "Cannot find module"
```bash
# package.json dependencies 확인
"dependencies": {
  "@supabase/supabase-js": "^2.57.4",
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2"
}
```

#### 문제: "Start command failed"
```bash
# Render 설정 확인
Start Command: node backend/server.js
Build Command: npm install
```

### 🚨 Supabase 연결 실패

#### 문제: "Invalid API key"
```bash
# 환경변수 확인
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# .env 파일 확인
cat .env
```

#### 문제: "RLS policy"
```sql
-- Supabase 대시보드에서 RLS 정책 확인
-- Table Editor → 테이블 선택 → RLS 탭
```

### 🚨 Git 관련 문제

#### 문제: "Permission denied"
```bash
# SSH 키 설정 또는 Personal Access Token 사용
git remote set-url origin https://[username]:[token]@github.com/Park1981/total-admin.git
```

#### 문제: "Merge conflict"
```bash
# 충돌 해결
git status
# 충돌 파일 수정 후
git add .
git commit -m "resolve merge conflict"
```

---

## 🎯 빠른 체크리스트

### ✅ 새 환경에서 시작할 때
- [ ] Git 클론 → 의존성 설치 → .env 설정
- [ ] npm start로 로컬 서버 확인
- [ ] Supabase 연결 테스트

### ✅ 기능 추가 후 배포할 때
- [ ] 로컬에서 테스트 완료
- [ ] git add → commit → push
- [ ] Vercel/Render 자동 배포 확인
- [ ] 실제 서비스에서 동작 테스트

### ✅ 문제 발생 시
- [ ] 로컬에서 재현 가능한지 확인
- [ ] 배포 로그 확인 (Vercel/Render)
- [ ] 환경변수 설정 확인
- [ ] 이 가이드 문제해결 섹션 참조

---

## 📞 유용한 링크들

### 🔗 배포된 서비스
- **프론트엔드**: https://total-admin-brown.vercel.app
- **백엔드 API**: https://total-admin.onrender.com
- **헬스체크**: https://total-admin.onrender.com/healthz

### 🔗 관리 대시보드
- **GitHub**: https://github.com/Park1981/total-admin
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **Supabase**: https://supabase.com/dashboard

### 🔗 공식 문서
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**📝 작성일**: 2025년 9월 23일
**👤 작성자**: Claude & 박정완
**🎯 목적**: 혹시 까먹을 수도 있으니까 Git부터 배포까지 완전 정리
**✅ 테스트**: 실제 배포 환경에서 검증 완료