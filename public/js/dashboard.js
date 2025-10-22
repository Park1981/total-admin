(function () {
  if (typeof renderAppHeader === 'function') {
    renderAppHeader({ active: 'dashboard' });
  }

  const API_BASE = window.location.hostname.includes('vercel.app')
    ? 'https://total-admin.onrender.com'
    : '';

  function openProductManagement() {
    showToast('success', '📦 제품관리 시스템에 접속합니다...');
    setTimeout(() => {
      window.location.href = 'products.html';
    }, 800);
  }


  function openSection(section) {
    switch (section) {
      case 'delivery-management':
        showToast('info', '🚚 납품 관리 페이지 - 주문서 및 납품서 관리 (추후 개발 예정)');
        break;
      case 'partner-management':
        showToast('info', '🏢 거래처 관리 페이지 - 고객사 및 공급업체 관리 (추후 개발 예정)');
        break;
      case 'service':
        showToast('info', '🛠️ A/S 관리 페이지 - 고객 A/S 요청 및 처리 (추후 개발 예정)');
        break;
      case 'test':
        showToast('success', '시스템 테스트 페이지를 새 창에서 엽니다.');
        setTimeout(() => window.open('test.html', '_blank'), 500);
        break;
      default:
        showToast('info', '해당 기능은 준비 중입니다.');
    }
  }

  function showInfo() {
    showToast('info', '🏢 유니태크(주) - 스마트 제조 관리 시스템 | 서울시 금천구 디지털로 121, 1505 에이스가산타워');
  }

  function showSupport() {
    showToast('info', '🛠️ 기술 지원 - 시스템 문의사항이나 기술 지원이 필요하시면 관리자에게 문의해주세요. | 📧 support@unitech.co.kr');
  }

  function getCategoryLabel(category) {
    const map = {
      CHAMBER: '챔버 시스템',
      EQUIPMENT: '측정 장비',
      PARTS: '소모품',
      AUTOCLAVE: '멸균기'
    };
    return map[category] || '제품 템플릿';
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '-';

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR');
  }

  function renderProducts(listEl, products) {
    listEl.innerHTML = '';

    products.forEach(product => {
      const item = document.createElement('li');
      item.className = 'panel-item';

      const templateCode = product.template_code || '-';
      const category = getCategoryLabel(product.category);
      const statusLabel = product.status === 'inactive' ? '비활성' : '사용 중';

      item.innerHTML = `
        <div class="panel-item-main">
          <span class="panel-item-title">${product.template_name}</span>
          <div class="panel-meta">
            <span class="panel-badge">${category}</span>
            <span>${templateCode}</span>
            <span>${statusLabel}</span>
          </div>
        </div>
        <span class="panel-item-time">${formatTimeAgo(product.created_at)}</span>
      `;

      listEl.appendChild(item);
    });
  }

  async function loadDashboardProducts() {
    const listEl = document.getElementById('dashboard-products-list');
    if (!listEl) return;

    listEl.innerHTML = `
      <li class="panel-item" data-state="loading">
        <div class="panel-item-main">
          <span class="panel-item-title">제품 정보를 불러오는 중입니다...</span>
          <div class="panel-meta">
            <span class="panel-badge">Loading</span>
            <span>잠시만 기다려 주세요</span>
          </div>
        </div>
        <span class="panel-item-time">
          <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
        </span>
      </li>
    `;

    try {
      const token = sessionStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}/api/products/templates`, { headers });
      if (!response.ok) {
        throw new Error('제품 정보를 불러오는 데 실패했습니다.');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || '제품 목록을 가져오지 못했습니다.');
      }

      const products = (result.data || []).filter(item => item.status !== 'inactive');
      if (products.length === 0) {
        listEl.innerHTML = `
          <li class="panel-item" data-state="empty">
            <div class="panel-item-main">
              <span class="panel-item-title">등록된 제품 템플릿이 없습니다.</span>
              <div class="panel-meta">
                <span class="panel-badge">Empty</span>
                <span>새 템플릿을 추가해 주세요.</span>
              </div>
            </div>
          </li>
        `;
        return;
      }

      renderProducts(listEl, products.slice(0, 5));
    } catch (error) {
      console.error('제품 현황 로드 오류:', error);
      listEl.innerHTML = `
        <li class="panel-item" data-state="error">
          <div class="panel-item-main">
            <span class="panel-item-title">제품 정보를 불러오지 못했습니다.</span>
            <div class="panel-meta">
              <span class="panel-badge">Error</span>
              <span>${error.message}</span>
            </div>
          </div>
          <span class="panel-item-time">
            <button type="button" class="panel-retry" aria-label="다시 시도" onclick="window.loadDashboardProducts && window.loadDashboardProducts()">
              다시 시도
            </button>
          </span>
        </li>
      `;
      showToast('error', `제품 현황 로드 실패: ${error.message}`);
    }
  }

  window.openProductManagement = openProductManagement;
  window.openSection = openSection;
  window.showInfo = showInfo;
  window.showSupport = showSupport;
  window.loadDashboardProducts = loadDashboardProducts;

  window.addEventListener('load', () => {
    loadDashboardProducts();
    setTimeout(() => {
      showToast('success', '🎉 UNITECH PORTAL에 오신 것을 환영합니다! 실시간 대시보드가 준비되었습니다.');
      console.log('🎉 유니태크(주) 관리시스템에 오신 것을 환영합니다!');
      console.log('📅 Dashboard updated: 2025-09-23 14:30 KST');
    }, 1500);
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item a').forEach(link => {
      link.addEventListener('click', function (event) {
        if (this.matches('[onclick]')) {
          return;
        }

        const href = (this.getAttribute('href') || '').trim();
        if (href && href !== '#') {
          return;
        }

        event.preventDefault();

        document.querySelectorAll('.nav-item a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const menuName = this.textContent.trim();
        if (menuName && menuName !== '대시보드') {
          showToast('info', `📋 ${menuName} 메뉴 - 해당 기능은 추후 개발 예정입니다.`);
        }
      });
    });
  });
})();
