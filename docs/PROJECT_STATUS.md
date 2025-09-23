# 📊 UNITECH PORTAL 프로젝트 현황

> **최종 업데이트**: 2025-09-23
> **프로젝트 상태**: 🟢 운영 중 (제품관리 시스템 1차 완료)
> **다음 단계**: 제품 추가 기능 구현

## 🎯 프로젝트 개요

**UNITECH PORTAL**은 유니태크(주)(UNITECH Co., Ltd.)의 맞춤형 제조업 관리 시스템입니다.

### 핵심 비즈니스
- **맞춤형 제조**: 챔버시스템, 측정장비 등 고객 요구사항에 따른 제작
- **소모품 관리**: 교체용 부품 및 소모성 자재
- **A/S 서비스**: 설치 후 유지보수 및 기술지원

## 🌐 배포 정보

| 구분 | URL | 플랫폼 | 상태 |
|-----|-----|--------|------|
| **프론트엔드** | https://total-admin-brown.vercel.app | Vercel | ✅ 운영중 |
| **백엔드 API** | https://total-admin.onrender.com | Render | ✅ 운영중 |
| **데이터베이스** | Supabase (tgxmccwadzxjnxxusupw) | Supabase | ✅ 운영중 |
| **소스코드** | https://github.com/Park1981/total-admin | GitHub | ✅ 활성 |

## 🏗️ 아키텍처

```
🌐 Frontend (Vercel)
├── index.html          # 로그인 페이지
├── dashboard.html      # 메인 대시보드
└── products.html       # 제품관리 페이지

⚙️ Backend (Render)
├── Express.js API 서버
├── MVC 패턴 구조
└── Supabase 연동

🗄️ Database (Supabase)
├── employees           # 사용자 관리
├── product_templates   # 제품 템플릿
├── product_options     # 제품 옵션
└── product_categories  # 제품 카테고리
```

## ✅ 완성된 기능

### 1. **인증 시스템** 🔐
- **로그인 페이지**: 글래스모피즘 디자인, bcrypt 암호화
- **세션 관리**: sessionStorage 기반
- **계정 관리**: admin, manager, staff 권한 구분

| 계정 | 패스워드 | 권한 | 용도 |
|------|----------|------|------|
| admin | admin123 | admin | 시스템 관리자 |
| manager1 | manager123 | manager | 매니저 |
| jpark | jpark123 | staff | 박정완 (개발자) |

### 2. **대시보드** 📊
- **글래스모피즘 UI**: 다크/라이트 테마 자동 감지
- **실시간 통계**: 제품, 납품, 거래처, A/S 현황
- **최근 활동**: 각 섹션별 최신 이력 표시
- **토스트 알림**: 기존 alert 대신 모던한 알림 시스템

### 3. **제품관리 시스템** 📦
- **제품 템플릿**: 기본 모델 관리 (대형챔버, 소형챔버 등)
- **옵션 시스템**: 크기, 채널수, 기능별 선택 옵션
- **카테고리 분류**: 챔버시스템, 측정장비, 소모품, 멸균기
- **유연한 구조**: 맞춤형 제작업에 최적화

#### 현재 등록된 제품
```
CH-LARGE     : 대형 챔버 시스템 (24m³, 26m³, 40m³)
CH-SMALL     : 소형 챔버 시스템 (9ch, 12ch, 18ch)
PUMP-SAMPLING: 샘플링펌프 (2ch, 4ch, 디지털유량계)
AUTO-CLAVE   : 멸균기 (40L, 60L, 100~137°C)
```

### 4. **자동화 시스템** 🤖
- **GitHub Actions**: 4일마다 DB 연결 유지 (Supabase 무료 플랜 대응)
- **자동 배포**: Git push → Vercel/Render 자동 빌드
- **헬스체크**: API 상태 모니터링

## 🗄️ 데이터베이스 스키마

### 핵심 테이블
```sql
-- 사용자 관리
employees (employee_id, username, password_hash, name, role, ...)

-- 제품 시스템
product_templates (template_id, template_code, template_name, category, ...)
product_options (option_id, template_id, option_type, option_value, ...)
product_categories (category_id, category_code, category_name, ...)
```

### 비즈니스 로직
- **템플릿 + 옵션**: 기본 제품에 맞춤 옵션 조합
- **혼합 방식**: 미리 정의된 옵션 + 자유 입력 필드
- **확장성**: 새로운 제품군 쉽게 추가 가능

## 🎨 디자인 시스템

### 테마
- **글래스모피즘**: `backdrop-filter: blur(20px)`, 투명도 기반
- **다크 모드**: 기본 (어두운 그라데이션)
- **라이트 모드**: `@media (prefers-color-scheme: light)` 자동 감지
- **반응형**: 모바일 우선 설계

### 컬러 팔레트
```css
/* 다크 테마 */
--dashboard-bg-gradient: linear-gradient(135deg, #2c1810 0%, #8b4513 25%, #4a0e4e 75%, #1a1a2e 100%);
--accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* 라이트 테마 */
--dashboard-bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 75%, #94a3b8 100%);
--accent-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
```

## 🚀 기술 스택

| 분야 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Frontend** | HTML/CSS/JS | ES6+ | 정적 페이지, 글래스모피즘 |
| **Backend** | Node.js + Express | 5.1.0 | REST API, MVC 패턴 |
| **Database** | PostgreSQL (Supabase) | 15+ | 클라우드 DB |
| **Authentication** | bcrypt | 6.0.0 | 비밀번호 암호화 |
| **Deployment** | Vercel + Render | - | 자동 배포 |
| **CI/CD** | GitHub Actions | - | DB 유지, 자동화 |

## 📁 프로젝트 구조

```
total-admin/
├── 🌐 public/                  # 프론트엔드
│   ├── index.html              # 로그인 페이지
│   ├── dashboard.html          # 메인 대시보드
│   └── products.html           # 제품관리
│
├── ⚙️ backend/                 # 백엔드 (MVC)
│   ├── app.js                  # Express 앱 설정
│   ├── server.js               # 서버 실행
│   ├── lib/supabaseClient.js   # DB 연결
│   ├── routes/                 # 라우팅
│   ├── controllers/            # 비즈니스 로직
│   └── services/               # 데이터 액세스
│
├── 🗄️ supabase/               # DB 마이그레이션
│   └── migrations/             # 스키마 버전 관리
│
├── 📜 docs/                    # 프로젝트 문서
│   ├── PROJECT_STATUS.md       # 현재 문서
│   ├── DEPLOYMENT_MANUAL.md    # 배포 가이드
│   └── 2025-09-18.md          # 작업 일지
│
├── 🤖 .github/workflows/       # 자동화
│   └── keep-supabase-alive.yml # DB 유지 스크립트
│
└── 📄 설정 파일들
    ├── package.json            # 의존성 관리
    ├── vercel.json            # Vercel 설정
    └── render.yaml            # Render 설정
```

## 🎯 다음 개발 계획

### 🔴 즉시 (이번 세션)
- [ ] **제품 추가 기능**: 새 템플릿 생성 폼
- [ ] **옵션 관리**: 동적 옵션 추가/수정

### 🟡 단기 (1-2주)
- [ ] **제품 수정/삭제**: CRUD 완성
- [ ] **거래처 관리**: 고객사/공급업체 등록
- [ ] **납품 관리**: 주문서/납품서 시스템

### 🟢 중기 (1달)
- [ ] **A/S 관리**: 일정 포함 서비스 관리
- [ ] **파일 업로드**: 이미지, 카탈로그 관리
- [ ] **검색/필터**: 고급 검색 기능

### 🔵 장기 (3달)
- [ ] **대시보드 차트**: 실시간 통계 시각화
- [ ] **알림 시스템**: 웹푸시, 이메일 알림
- [ ] **모바일 앱**: PWA 또는 React Native

## 🔧 개발 환경

### 로컬 개발
```bash
# 프로젝트 클론
git clone https://github.com/Park1981/total-admin.git
cd total-admin

# 의존성 설치
npm install

# 환경변수 설정 (.env)
SUPABASE_URL=https://tgxmccwadzxjnxxusupw.supabase.co
SUPABASE_ANON_KEY=your-anon-key
API_BASE_URL=http://localhost:3001

# 로컬 서버 실행
npm start  # http://localhost:3001
```

### 배포
```bash
# 변경사항 배포
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin master

# 자동으로 배포됨:
# - Vercel (프론트엔드)
# - Render (백엔드)
```

## 📞 문의 및 지원

### 회사 정보
- **회사명**: 유니태크(주) (UNITECH Co., Ltd.)
- **웹사이트**: unitechco.co.kr
- **이메일**: unitech@unitechco.co.kr
- **전화**: 02-534-1430
- **팩스**: 02-534-1432
- **주소**: 서울특별시 금천구 디지털로 121, 에이스가산타워 1505호 (08505)
- **영문주소**: 1505, Ace Gasan Tower, 121, Digital-ro, Geumcheon-gu, Seoul, 08505, Rep. of Korea

### 기술 지원

| 구분 | 연락처 | 담당 |
|------|--------|------|
| **기술 지원** | unitech@unitechco.co.kr | 개발팀 |
| **프로젝트 관리** | 박정완 | 프로젝트 매니저 |
| **GitHub Issues** | https://github.com/Park1981/total-admin/issues | 버그 리포팅 |

---

**📝 작성**: Claude + 박정완
**🔄 마지막 업데이트**: 2025-09-23
**📋 상태**: 제품관리 시스템 1차 완료, 추가 기능 개발 중