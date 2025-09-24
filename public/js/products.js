(function () {
    // 페이지 로드 시 로그인 상태 확인
    (function() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            showToast('error', '로그인이 필요합니다.');
            setTimeout(() => {
                window.location.replace('index.html');
            }, 1500);
            return;
        }
    })();
  
    // 탭 전환
  function switchTab(tabName, evt) {
      const trigger = evt?.currentTarget || evt?.target || null;
  
      document.querySelectorAll('.tab-btn').forEach(btn => {
          const isActive = btn.dataset.tab === tabName;
          btn.classList.toggle('active', isActive);
      });
  
      document.querySelectorAll('.tab-content').forEach(content => {
          const isActive = content.id === `${tabName}-tab`;
          content.classList.toggle('active', isActive);
      });
  
      if (!trigger) {
          const fallback = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
          if (fallback) {
              fallback.classList.add('active');
          }
      }
  
      const tabLabel = tabName === 'templates' ? '제품 템플릿 목록' : '제품 추가 폼';
      showToast('info', `${tabLabel}으로 이동했습니다.`);
  }
  
    // 제품 새로고침
    function refreshProducts() {
        showToast('info', '제품 목록을 새로고침합니다...');
        loadProducts();
    }
  
    // 제품 추가 폼 표시
  function showAddProductForm() {
      switchTab('add');
      showToast('success', '제품 추가 폼으로 이동합니다.');
  }
  
    // 제품 목록 로드 (실제 API 데이터)
    const API_BASE = window.location.hostname.includes('vercel.app')
        ? 'https://total-admin.onrender.com'
        : '';
  
    async function loadProducts() {
        const grid = document.getElementById('products-grid');
        const productCount = document.getElementById('product-count');
  
        // 로딩 표시
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);"><i class="fas fa-spinner fa-spin"></i> 제품 목록을 불러오는 중...</div>';
  
        try {
            // API에서 제품 템플릿 데이터 가져오기
            const response = await fetch(`${API_BASE}/api/products/templates`);
            const result = await response.json();
  
            if (!result.success) {
                throw new Error(result.message || '제품 목록을 불러올 수 없습니다.');
            }
  
            const products = result.data;
            grid.innerHTML = '';
  
            if (products.length === 0) {
                grid.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px;">
                        <i class="fas fa-cube" style="font-size: 3rem; color: var(--text-accent); margin-bottom: 20px;"></i>
                        <h4 style="color: var(--text-primary); margin-bottom: 10px;">등록된 제품이 없습니다</h4>
                        <p style="color: var(--text-secondary);">새 제품 추가 버튼을 눌러 제품을 등록해보세요.</p>
                    </div>
                `;
                productCount.textContent = '총 0개';
                return;
            }
  
            // 각 제품에 대해 카드 생성
            products.forEach(product => {
                // 옵션들을 사용자 친화적으로 변환
                const optionLabels = [];
                if (product.product_options && product.product_options.length > 0) {
                    product.product_options.forEach(option => {
                        optionLabels.push(option.option_label);
                    });
                }
  
                // 기본 사양도 옵션으로 표시
                if (product.base_specifications) {
                    Object.entries(product.base_specifications).forEach(([key, value]) => {
                        optionLabels.push(`${key}: ${value}`);
                    });
                }
  
                // 카테고리 한글명 변환
                const categoryNames = {
                    'CHAMBER': '챔버시스템',
                    'EQUIPMENT': '측정장비',
                    'PARTS': '소모품',
                    'AUTOCLAVE': '멸균기'
                };
  
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-header">
                        <div>
                            <div class="product-title">${product.template_name}</div>
                            <div class="product-code">${product.template_code}</div>
                        </div>
                        <div class="product-category">${categoryNames[product.category] || product.category}</div>
                    </div>
                    <div class="product-description">${product.description || '설명이 없습니다.'}</div>
                    <div class="product-options">
                        <div class="options-title">사용 가능한 옵션:</div>
                        ${optionLabels.length > 0
                            ? optionLabels.map(option => `<span class="option-tag">${option}</span>`).join('')
                            : '<span style="color: var(--text-accent); font-style: italic;">옵션 없음</span>'
                        }
                    </div>
                    <div class="product-actions">
                        <button class="btn-edit-product" onclick="editProduct('${product.template_id}')">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                        <button class="btn-delete-product" onclick="deleteProduct('${product.template_id}', '${product.template_name}')">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                    </div>
                `;
                grid.appendChild(productCard);
            });
  
            productCount.textContent = `총 ${products.length}개`;
  
        } catch (error) {
            console.error('제품 목록 로드 오류:', error);
            grid.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
                    <h4 style="color: var(--text-primary); margin-bottom: 10px;">제품 목록을 불러올 수 없습니다</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">${error.message}</p>
                    <button class="retry-button" onclick="loadProducts()">
                        <i class="fas fa-repeat"></i> 다시 시도
                    </button>
                </div>
            `;
            productCount.textContent = '로드 실패';
            showToast('error', '제품 목록 로드 실패: ' + error.message);
        }
    }
  
    // 제품 수정 (임시 구현)
    function editProduct(templateId) {
        showToast('info', '제품 수정 기능은 곧 구현될 예정입니다.');
    }
  
    // 제품 삭제
    async function deleteProduct(templateId, templateName) {
        if (!confirm(`"${templateName}" 제품을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }
  
        try {
            const response = await fetch(`${API_BASE}/api/products/templates/${templateId}`, {
                method: 'DELETE'
            });
  
            const result = await response.json();
  
            if (!result.success) {
                throw new Error(result.message || '제품 삭제에 실패했습니다.');
            }
  
            showToast('success', `"${templateName}" 제품이 삭제되었습니다.`);
            loadProducts(); // 목록 새로고침
  
        } catch (error) {
            console.error('제품 삭제 오류:', error);
            showToast('error', '제품 삭제 실패: ' + error.message);
        }
    }
  
    // 페이지 로드 시 초기화
    window.addEventListener('load', function() {
        showToast('success', '🎯 제품관리 시스템에 오신 것을 환영합니다!');
        setTimeout(() => {
            loadProducts();
        }, 1000);
    });
  
    // === 제품 추가 폼 관련 기능들 ===
  
    // 사양 추가
    function addSpecification() {
        const container = document.getElementById('specifications-container');
        const newSpec = document.createElement('div');
        newSpec.className = 'spec-item';
        newSpec.innerHTML = `
            <div class="spec-inputs">
                <input type="text" placeholder="사양명 (예: 온도범위)" class="spec-key">
                <input type="text" placeholder="값 (예: 15~30°C)" class="spec-value">
                <button type="button" class="btn-remove-spec" onclick="removeSpecification(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.appendChild(newSpec);
    }
  
    // 사양 제거
    function removeSpecification(button) {
        const specItem = button.closest('.spec-item');
        const container = document.getElementById('specifications-container');
  
        // 최소 1개는 유지
        if (container.children.length > 1) {
            specItem.remove();
        } else {
            showToast('warning', '최소 1개의 사양은 유지되어야 합니다.');
        }
    }
  
    // 옵션 그룹 추가
    function addOptionGroup() {
        const container = document.getElementById('options-container');
        const newGroup = document.createElement('div');
        newGroup.className = 'option-group';
        newGroup.innerHTML = `
            <div class="option-header">
                <input type="text" placeholder="옵션 타입 (예: size)" class="option-type">
                <input type="text" placeholder="옵션 라벨 (예: 크기)" class="option-type-label">
                <button type="button" class="btn-remove-option-group" onclick="removeOptionGroup(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
  
            <div class="option-values">
                <div class="option-value-item">
                    <input type="text" placeholder="옵션 값 (예: 24m³)" class="option-value">
                    <input type="text" placeholder="표시 라벨 (예: 24m³ (4.0×3.0×2.0m))" class="option-label">
                    <input type="checkbox" class="option-default" title="기본 선택">
                    <button type="button" class="btn-remove-option-value" onclick="removeOptionValue(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
  
            <button type="button" class="btn-add-option-value" onclick="addOptionValue(this)">
                <i class="fas fa-plus"></i>
                옵션 값 추가
            </button>
        `;
        container.appendChild(newGroup);
    }
  
    // 옵션 그룹 제거
    function removeOptionGroup(button) {
        const optionGroup = button.closest('.option-group');
        const container = document.getElementById('options-container');
  
        // 최소 1개는 유지
        if (container.children.length > 1) {
            optionGroup.remove();
        } else {
            showToast('warning', '최소 1개의 옵션 그룹은 유지되어야 합니다.');
        }
    }
  
    // 옵션 값 추가
    function addOptionValue(button) {
        const optionGroup = button.closest('.option-group');
        const valuesContainer = optionGroup.querySelector('.option-values');
        const newValue = document.createElement('div');
        newValue.className = 'option-value-item';
        newValue.innerHTML = `
            <input type="text" placeholder="옵션 값 (예: 26m³)" class="option-value">
            <input type="text" placeholder="표시 라벨 (예: 26m³ (4.0×3.5×2.8m))" class="option-label">
            <input type="checkbox" class="option-default" title="기본 선택">
            <button type="button" class="btn-remove-option-value" onclick="removeOptionValue(this)">
                <i class="fas fa-minus"></i>
            </button>
        `;
        valuesContainer.appendChild(newValue);
    }
  
    // 옵션 값 제거
    function removeOptionValue(button) {
        const valueItem = button.closest('.option-value-item');
        const valuesContainer = button.closest('.option-values');
  
        // 최소 1개는 유지
        if (valuesContainer.children.length > 1) {
            valueItem.remove();
        } else {
            showToast('warning', '최소 1개의 옵션 값은 유지되어야 합니다.');
        }
    }
  
    // 폼 초기화
    function resetForm() {
        if (confirm('입력한 모든 내용이 삭제됩니다. 계속하시겠습니까?')) {
            document.getElementById('addProductForm').reset();
  
            // 사양을 초기 상태로 리셋
            const specsContainer = document.getElementById('specifications-container');
            specsContainer.innerHTML = `
                <div class="spec-item">
                    <div class="spec-inputs">
                        <input type="text" placeholder="사양명 (예: 온도범위)" class="spec-key">
                        <input type="text" placeholder="값 (예: 15~30°C)" class="spec-value">
                        <button type="button" class="btn-remove-spec" onclick="removeSpecification(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
  
            // 옵션을 초기 상태로 리셋
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = `
                <div class="option-group">
                    <div class="option-header">
                        <input type="text" placeholder="옵션 타입 (예: size)" class="option-type">
                        <input type="text" placeholder="옵션 라벨 (예: 크기)" class="option-type-label">
                        <button type="button" class="btn-remove-option-group" onclick="removeOptionGroup(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
  
                    <div class="option-values">
                        <div class="option-value-item">
                            <input type="text" placeholder="옵션 값 (예: 24m³)" class="option-value">
                            <input type="text" placeholder="표시 라벨 (예: 24m³ (4.0×3.0×2.0m))" class="option-label">
                            <input type="checkbox" class="option-default" title="기본 선택">
                            <button type="button" class="btn-remove-option-value" onclick="removeOptionValue(this)">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
  
                    <button type="button" class="btn-add-option-value" onclick="addOptionValue(this)">
                        <i class="fas fa-plus"></i>
                        옵션 값 추가
                    </button>
                </div>
            `;
  
            showToast('info', '폼이 초기화되었습니다.');
        }
    }
  
    // 제품 추가 폼 제출 처리
    document.getElementById('addProductForm').addEventListener('submit', async function(e) {
        e.preventDefault();
  
        try {
            // 로딩 상태 표시
            const submitBtn = document.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 저장 중...';
            submitBtn.disabled = true;
  
            // 폼 데이터 수집
            const formData = new FormData(e.target);
            const productData = {
                template_code: formData.get('template_code'),
                template_name: formData.get('template_name'),
                category: formData.get('category'),
                description: formData.get('description'),
                is_consumable: formData.get('is_consumable') === 'true',
                base_specifications: collectSpecifications(),
            };
  
            // 기본 정보 유효성 검증
            if (!productData.template_code || !productData.template_name || !productData.category) {
                throw new Error('필수 필드를 모두 입력해주세요.');
            }
  
            // 템플릿 생성 API 호출
            const response = await fetch(`${API_BASE}/api/products/templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
  
            const result = await response.json();
  
            if (!result.success) {
                throw new Error(result.message || '제품 템플릿 생성에 실패했습니다.');
            }
  
            const templateId = result.data.template_id;
  
            // 옵션들 저장
            const options = collectOptions();
            if (options.length > 0) {
                await saveProductOptions(templateId, options);
            }
  
            // 성공 처리
            showToast('success', '✅ 제품 템플릿이 성공적으로 생성되었습니다!');
  
            // 폼 초기화 및 템플릿 탭으로 이동
            setTimeout(() => {
                resetForm();
                switchTab('templates');
                loadProducts(); // 제품 목록 새로고침
            }, 1500);
  
        } catch (error) {
            console.error('제품 생성 오류:', error);
            showToast('error', '❌ ' + error.message);
        } finally {
            // 로딩 상태 해제
            const submitBtn = document.querySelector('button[type="submit"]');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
  
    // 사양 데이터 수집
    function collectSpecifications() {
        const specs = {};
        const specItems = document.querySelectorAll('.spec-item');
  
        specItems.forEach(item => {
            const key = item.querySelector('.spec-key').value.trim();
            const value = item.querySelector('.spec-value').value.trim();
  
            if (key && value) {
                specs[key] = value;
            }
        });
  
        return specs;
    }
  
    // 옵션 데이터 수집
    function collectOptions() {
        const options = [];
        const optionGroups = document.querySelectorAll('.option-group');
  
        optionGroups.forEach(group => {
            const optionType = group.querySelector('.option-type').value.trim();
            const optionTypeLabel = group.querySelector('.option-type-label').value.trim();
  
            if (!optionType || !optionTypeLabel) return;
  
            const valueItems = group.querySelectorAll('.option-value-item');
            let sortOrder = 1;
  
            valueItems.forEach(item => {
                const optionValue = item.querySelector('.option-value').value.trim();
                const optionLabel = item.querySelector('.option-label').value.trim();
                const isDefault = item.querySelector('.option-default').checked;
  
                if (optionValue && optionLabel) {
                    options.push({
                        option_type: optionType,
                        option_type_label: optionTypeLabel,
                        option_value: optionValue,
                        option_label: optionLabel,
                        is_default: isDefault,
                        sort_order: sortOrder++
                    });
                }
            });
        });
  
        return options;
    }
  
    // 제품 옵션들 저장
    async function saveProductOptions(templateId, options) {
        for (const option of options) {
            const response = await fetch(`${API_BASE}/api/products/templates/${templateId}/options`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(option)
            });
  
            const result = await response.json();
            if (!result.success) {
                throw new Error(`옵션 저장 실패: ${result.message}`);
            }
        }
    }
  
    Object.assign(window, {
      switchTab,
      refreshProducts,
      showAddProductForm,
      loadProducts,
      editProduct,
      deleteProduct,
      addSpecification,
      removeSpecification,
      addOptionGroup,
      removeOptionGroup,
      addOptionValue,
      removeOptionValue,
      resetForm
    });
})();
