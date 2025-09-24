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
    showToast('info', '⚙️ 설정 패널은 준비 중입니다.');
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
  window.logout = logout;
})();
