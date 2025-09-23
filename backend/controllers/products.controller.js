// 제품 관리 컨트롤러
import * as productsService from '../services/products.service.js';

// 제품 템플릿 목록 조회
export async function getTemplates(req, res) {
  try {
    const templates = await productsService.getAllTemplates();
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('제품 템플릿 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 템플릿 조회 중 오류가 발생했습니다.'
    });
  }
}

// 새 제품 템플릿 생성
export async function createTemplate(req, res) {
  try {
    const templateData = req.body;

    // 필수 필드 검증
    if (!templateData.template_code || !templateData.template_name || !templateData.category) {
      return res.status(400).json({
        success: false,
        message: '필수 필드가 누락되었습니다. (템플릿 코드, 이름, 카테고리)'
      });
    }

    const newTemplate = await productsService.createTemplate(templateData);
    res.status(201).json({
      success: true,
      data: newTemplate,
      message: '제품 템플릿이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('제품 템플릿 생성 오류:', error);

    // 중복 코드 에러 처리
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 템플릿 코드입니다.'
      });
    }

    res.status(500).json({
      success: false,
      message: '제품 템플릿 생성 중 오류가 발생했습니다.'
    });
  }
}

// 제품 템플릿 수정
export async function updateTemplate(req, res) {
  try {
    const { id } = req.params;
    const templateData = req.body;

    const updatedTemplate = await productsService.updateTemplate(id, templateData);

    if (!updatedTemplate) {
      return res.status(404).json({
        success: false,
        message: '해당 제품 템플릿을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: updatedTemplate,
      message: '제품 템플릿이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('제품 템플릿 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 템플릿 수정 중 오류가 발생했습니다.'
    });
  }
}

// 제품 템플릿 삭제
export async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;

    const deleted = await productsService.deleteTemplate(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: '해당 제품 템플릿을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '제품 템플릿이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('제품 템플릿 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 템플릿 삭제 중 오류가 발생했습니다.'
    });
  }
}

// 특정 템플릿의 옵션 조회
export async function getTemplateOptions(req, res) {
  try {
    const { templateId } = req.params;
    const options = await productsService.getTemplateOptions(templateId);

    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('제품 옵션 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 옵션 조회 중 오류가 발생했습니다.'
    });
  }
}

// 새 제품 옵션 생성
export async function createOption(req, res) {
  try {
    const { templateId } = req.params;
    const optionData = { ...req.body, template_id: templateId };

    // 필수 필드 검증
    if (!optionData.option_type || !optionData.option_value || !optionData.option_label) {
      return res.status(400).json({
        success: false,
        message: '필수 필드가 누락되었습니다. (옵션 타입, 값, 라벨)'
      });
    }

    const newOption = await productsService.createOption(optionData);
    res.status(201).json({
      success: true,
      data: newOption,
      message: '제품 옵션이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('제품 옵션 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 옵션 생성 중 오류가 발생했습니다.'
    });
  }
}

// 제품 옵션 삭제
export async function deleteOption(req, res) {
  try {
    const { optionId } = req.params;

    const deleted = await productsService.deleteOption(optionId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: '해당 제품 옵션을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '제품 옵션이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('제품 옵션 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 옵션 삭제 중 오류가 발생했습니다.'
    });
  }
}

// 제품 카테고리 목록 조회
export async function getCategories(req, res) {
  try {
    const categories = await productsService.getAllCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('제품 카테고리 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '제품 카테고리 조회 중 오류가 발생했습니다.'
    });
  }
}