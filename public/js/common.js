(function () {
  const ICONS = {
    success: '✓',
    error: '✗',
    info: 'i',
    warning: '!'
  };

  function getToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(type, message) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = ICONS[type] || ICONS.info;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="닫기">×</button>
    `;

    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => closeToast(closeButton));

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      if (toast.parentNode) {
        closeToast(closeButton);
      }
    }, 5000);
  }

  function closeToast(buttonOrElement) {
    const toast = buttonOrElement.closest('.toast');
    if (!toast) return;
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }

  function notifyPending(section) {
    showToast('info', `${section} 기능은 준비 중입니다.`);
    return false;
  }

  function goBack() {
    showToast('info', '대시보드로 이동합니다...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  }

  function openSettings() {
    // 설정 메뉴 표시
    const menu = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 10000; min-width: 300px;">
        <h3 style="margin: 0 0 20px; color: #333; font-size: 20px;">⚙️ 설정 메뉴</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button onclick="window.location.href='csv-viewer.html'" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500; text-align: left;">
            📊 CSV 데이터 뷰어
          </button>
          <button onclick="closeSettingsMenu()" style="background: #e2e8f0; color: #333; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500;">
            닫기
          </button>
        </div>
      </div>
      <div id="settingsOverlay" onclick="closeSettingsMenu()" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;"></div>
    `;

    const menuContainer = document.createElement('div');
    menuContainer.id = 'settingsMenu';
    menuContainer.innerHTML = menu;
    document.body.appendChild(menuContainer);
  }

  function closeSettingsMenu() {
    const menu = document.getElementById('settingsMenu');
    if (menu) {
      menu.remove();
    }
  }

  function logout() {
    showToast('info', '로그아웃을 진행합니다...');
    setTimeout(() => {
      sessionStorage.removeItem('isLoggedIn');
      showToast('success', '로그아웃이 완료되었습니다.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }, 1000);
  }

  function renderAppHeader(options = {}) {
    const mount = document.getElementById('app-header');
    if (!mount) {
      return;
    }

    const {
      active = '',
      showBackButton = false
    } = options;

    const navItems = [
      { id: 'dashboard', label: '대시보드', href: 'dashboard.html', icon: 'fas fa-chart-line' },
      { id: 'products', label: '제품관리', href: 'products.html', icon: 'fas fa-cube' },
      { id: 'deliveries', label: '납품관리', href: 'delivery.html', icon: 'fas fa-truck' },
      { id: 'contacts', label: '거래처관리', href: 'partners.html', icon: 'fas fa-handshake' },
      { id: 'service', label: 'A/S관리', href: 'service.html', icon: 'fas fa-tools' }
    ];

    const navMarkup = navItems.map(item => {
      if (item.pendingLabel) {
        return `
          <li class="nav-item">
            <a href="#" onclick="return notifyPending('${item.pendingLabel}');">
              <i class="${item.icon}" aria-hidden="true"></i>
              <span>${item.label}</span>
            </a>
          </li>
        `;
      }

      const isActive = item.id === active;
      const activeAttrs = isActive ? ' class="active" aria-current="page"' : '';

      return `
        <li class="nav-item">
          <a href="${item.href}"${activeAttrs}>
            <i class="${item.icon}" aria-hidden="true"></i>
            <span>${item.label}</span>
          </a>
        </li>
      `;
    }).join('');

    const backButton = showBackButton
      ? `<button class="ghost-btn" type="button" onclick="goBack()"><i class="fas fa-arrow-left" aria-hidden="true"></i>대시보드로</button>`
      : '';

    mount.innerHTML = `
      <header class="header">
        <div class="header-container">
          <div class="header-top">
            <div class="header-top-left">
              <div class="company-brand">
                <i class="fas fa-industry" aria-hidden="true"></i>
                UNITECH PORTAL
              </div>
            </div>
            <div class="header-top-right">
              <nav class="main-nav" aria-label="주요 메뉴">
                <ul class="nav-menu">
                  ${navMarkup}
                </ul>
              </nav>
              <button class="settings-btn" type="button" onclick="openSettings()" aria-label="설정">
                <i class="fas fa-gear" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="header-bottom">
            <div class="header-actions">
              ${backButton}
              <div class="user-profile">
                <div class="user-avatar">
                  <i class="fas fa-user" aria-hidden="true"></i>
                </div>
                <span>시스템 관리자</span>
              </div>
              <button class="logout-btn" type="button" onclick="logout()">
                <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function renderAppFooter() {
    const mount = document.getElementById('app-footer');
    if (!mount) return;

    mount.innerHTML = `
      <footer class="footer">
        <div class="footer-content">
          <div class="company-info">
            <strong>유니태크(주)</strong>
            <span>서울시 금천구 디지털로 121, 1505 에이스가산타워</span>
          </div>
          <div class="footer-links">
            <a href="dashboard.html">대시보드</a>
            <a href="#" onclick="showToast('info', '회사 정보 페이지 준비 중입니다.')">회사 정보</a>
            <a href="#" onclick="showToast('info', '기술 지원 페이지 준비 중입니다.')">기술 지원</a>
          </div>
        </div>
      </footer>
    `;
  }

  window.showToast = showToast;
  window.closeToast = closeToast;
  window.notifyPending = notifyPending;
  window.goBack = goBack;
  window.openSettings = openSettings;
  window.closeSettingsMenu = closeSettingsMenu;
  window.logout = logout;
  window.renderAppHeader = renderAppHeader;
  window.renderAppFooter = renderAppFooter;
})();
