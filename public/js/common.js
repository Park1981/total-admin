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

  window.showToast = showToast;
  window.closeToast = closeToast;
  window.notifyPending = notifyPending;
  window.goBack = goBack;
  window.openSettings = openSettings;
  window.closeSettingsMenu = closeSettingsMenu;
  window.logout = logout;
})();
