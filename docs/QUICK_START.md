# ⚡ 빠른 시작 가이드

## 🔗 배포된 시스템 접속

### 즉시 사용 가능한 URL들
- **📱 관리 페이지**: https://total-admin-brown.vercel.app
- **🔧 API 서버**: https://total-admin.onrender.com
- **📊 GitHub**: https://github.com/Park1981/total-admin

### 기능 테스트
1. **관리 페이지 접속** → 유니태크(주) 관리시스템 화면 확인
2. **API 연결 테스트** 버튼 클릭 → 서버 응답 확인  
3. **직원 목록 불러오기** 버튼 클릭 → Alice, Bob 데이터 확인

## 🚀 새 프로젝트 생성 (5분)

```bash
# 1. setup.ps1 실행
.\setup.ps1 -ProjectName new-admin -UseVercel $true -UseRender $true

# 2. Supabase 연결
npx supabase link --project-ref your-project-ref

# 3. 배포
git add . && git commit -m "init" && git push origin master
```

## 🛠️ 로컬 개발

```bash
git clone https://github.com/Park1981/total-admin.git
cd total-admin
npm install
npm test   # → 모든 자동화 테스트 실행
npm start  # → http://localhost:3001 (backend/server.js 실행)
```

## 📋 체크리스트

### 배포 성공 확인
- [ ] Vercel 페이지 로딩됨
- [ ] Render API 응답함  
- [ ] Supabase 데이터 읽힘
- [ ] GitHub 자동배포 작동함

### 다음 개발
- [ ] 제조장비 테이블 추가
- [ ] A/S 관리 기능
- [ ] 사용자 권한 시스템

**🎯 완성도**: 기본 인프라 100% / 비즈니스 로직 20%