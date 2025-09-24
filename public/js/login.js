(function () {
  const API_BASE = window.location.hostname.includes('vercel.app')
    ? 'https://total-admin.onrender.com'
    : '';

  function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle');
    if (!passwordInput || !toggleIcon) return;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

  function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    if (!errorDiv || !errorText) return;
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
  }

  function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      if (input.parentElement) {
        input.parentElement.style.transform = 'translateY(-2px)';
      }
      hideError();
    });
    input.addEventListener('blur', () => {
      if (input.parentElement) {
        input.parentElement.style.transform = 'translateY(0)';
      }
    });
  });

  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const username = document.getElementById('username')?.value?.trim() || '';
      const password = document.getElementById('password')?.value || '';
      const loginBtn = document.getElementById('loginBtn');

      if (loginBtn) {
        loginBtn.textContent = '로그인 중...';
        loginBtn.classList.add('loading');
      }

      try {
        const res = await fetch(`${API_BASE}/api/employees/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data && (data.success || data.user)) {
          sessionStorage.setItem('isLoggedIn', 'true');
          window.location.replace('dashboard.html');
          return;
        }

        const message = data?.error || '로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.';
        showError(message);
      } catch (error) {
        showError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        if (loginBtn) {
          loginBtn.textContent = '로그인';
          loginBtn.classList.remove('loading');
        }
      }
    });
  }

  window.togglePassword = togglePassword;
})();
