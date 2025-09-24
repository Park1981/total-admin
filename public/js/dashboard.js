(function () {
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

  window.logout = logout;
  window.openProductManagement = openProductManagement;
  window.openSection = openSection;
  window.showInfo = showInfo;
  window.showSupport = showSupport;

  window.addEventListener('load', () => {
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
