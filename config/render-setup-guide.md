# 🚀 Render 배포 가이드

## 1단계: Render 웹서비스 생성

1. **Render.com 접속** → https://render.com
2. **로그인** (GitHub 계정 사용)
3. **"New +" → "Web Service"** 클릭
4. **GitHub 저장소 연결**: `Park1981/total-admin` 선택
5. **서비스 설정**:
   - **Name**: `total-admin-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## 2단계: 환경변수 설정

**Environment Variables** 섹션에서 아래 변수들을 하나씩 추가:

### 복사해서 붙여넣기 👇

```
Key: SUPABASE_URL
Value: https://tgxmccwadzxjnxxusupw.supabase.co
```

```
Key: SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG1jY3dhZHp4am54eHVzdXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTc4NjgsImV4cCI6MjA3MzU3Mzg2OH0.7gqCsCt3ztzF3dsCRVd7c5sp-XGAcT68xeJJ1o49iw0
```

```
Key: SUPABASE_DB_PW
Value: xqaArtC4WZXNCNWw
```

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 10000
```

```
Key: JWT_SECRET
Value: (32자 이상 무작위 문자열, 예: openssl rand -base64 48)
```

## 3단계: 배포 실행

1. **"Create Web Service"** 클릭
2. **배포 로그 확인** (약 2-3분 소요)
3. **배포 완료 시 URL 확인**: `https://total-admin-api.onrender.com`

## 4단계: 헬스체크 확인

배포 완료 후 아래 URL들 테스트:

- ✅ **헬스체크**: https://your-app.onrender.com/healthz
- ✅ **API 목록**: https://your-app.onrender.com/api
- ✅ **직원 데이터**: https://your-app.onrender.com/api/employees

---

## ⚡ 빠른 설정 팁

1. **환경변수는 하나씩 추가** (한번에 붙여넣기 안됨)
2. **배포 완료까지 기다리기** (처음엔 시간 걸림)
3. **로그에서 오류 확인** (Environmental Variables 탭)
4. **JWT 시크릿 회전**: Render 환경변수에서 새 값 저장 후 배포 재시작, 기존 토큰 만료 안내

배포 URL 나오면 알려줘! 🎯
