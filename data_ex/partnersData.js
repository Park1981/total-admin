const partnersData = [
    {
        id: 'nier',
        name: '국립환경과학원',
        logo: 'https://nier.go.kr/NIER/assets/kor/images/common/logo.png',
        url: 'https://nier.go.kr'
    },
    {
        id: 'kofpi',
        name: '한국임업진흥원',
        logo: 'https://www.kofpi.or.kr/resources/img/common/new_logo_on.png',
        url: 'https://www.kofpi.or.kr'
    },
    {
        id: 'samsung',
        name: '삼성',
        logo: 'https://www.samsung.com/etc.clientlibs/samsung/clientlibs/consumer/global/clientlib-common/resources/images/gnb-desktop-120x32.png',
        url: 'https://www.samsung.com'
    },
    {
        id: 'lg',
        name: 'LG',
        logo: 'https://www.lge.co.kr/lg5-common/images/header/lg_logo_new.svg',
        url: 'https://www.lge.co.kr'
    },
    {
        id: 'kcl',
        name: '한국건설생활환경시험연구원',
        logo: 'https://www.kcl.re.kr/files/web1/images/common/logo.png',
        url: 'https://www.kcl.re.kr'
    },
    {
        id: 'ktr',
        name: '한국화학융합시험연구원',
        logo: 'https://www.ktr.or.kr/common/images/logo.png',
        url: 'https://www.ktr.or.kr'
    },
    {
        id: 'ktc',
        name: '한국기계전기전자시험연구원',
        logo: 'brand_img/ktc.jpg',
        url: 'https://www.ktc.re.kr'
    },
    {
        id: 'sgs',
        name: '한국에스지에스',
        logo: 'https://pds.saramin.co.kr/company/logo/201902/26/pnhqu4_qxsk-0_logo.JPG',
        url: 'https://www.sgs.com'
    },
    {
        id: 'fiti',
        name: 'FITI시험연구원',
        logo: 'https://fiti.re.kr/data/img/common/tlogo.gif',
        url: 'https://fiti.re.kr'
    },
    {
        id: 'keiti',
        name: '한국환경산업기술원',
        logo: 'brand_img/keiti.png',
        url: 'https://www.keiti.re.kr/'
    }
];

// 파트너 슬라이더 초기화 함수
function initializePartnerSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    if (!sliderTrack) return;
    
    // 데이터 두 번 반복하여 무한 슬라이드 효과 생성
    const duplicatedPartners = [...partnersData, ...partnersData, ...partnersData];
    
    // 슬라이더 내용 생성
    sliderTrack.innerHTML = duplicatedPartners.map(partner => `
        <div class="partner-slide-card">
            <img src="${partner.logo}" 
                 alt="${partner.name}" 
                 loading="lazy" 
                 onclick="window.open('${partner.url}', '_blank')">
        </div>
    `).join('');

    // 호버 시 일시정지 기능 추가
    const slider = document.querySelector('.partners-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            sliderTrack.style.animationPlayState = 'paused';
        });
        
        slider.addEventListener('mouseleave', () => {
            sliderTrack.style.animationPlayState = 'running';
        });
    }
}

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePartnerSlider);

export { partnersData, initializePartnerSlider };