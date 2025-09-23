// 제품 관리 라우트
import express from 'express';
import * as productsController from '../controllers/products.controller.js';

const router = express.Router();

// 제품 템플릿 관련
router.get('/templates', productsController.getTemplates);
router.post('/templates', productsController.createTemplate);
router.put('/templates/:id', productsController.updateTemplate);
router.delete('/templates/:id', productsController.deleteTemplate);

// 제품 옵션 관련
router.get('/templates/:templateId/options', productsController.getTemplateOptions);
router.post('/templates/:templateId/options', productsController.createOption);
router.delete('/options/:optionId', productsController.deleteOption);

// 제품 카테고리 관련
router.get('/categories', productsController.getCategories);

export default router;