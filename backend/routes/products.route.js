// 제품 관리 라우트
import express from 'express';
import * as productsController from '../controllers/products.controller.js';
import { authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// 제품 템플릿 관련
router.get('/templates', authorizeRoles('admin', 'manager', 'staff'), productsController.getTemplates);
router.post('/templates', authorizeRoles('admin'), productsController.createTemplate);
router.put('/templates/:id', authorizeRoles('admin'), productsController.updateTemplate);
router.delete('/templates/:id', authorizeRoles('admin'), productsController.deleteTemplate);

// 제품 옵션 관련
router.get('/templates/:templateId/options', authorizeRoles('admin', 'manager', 'staff'), productsController.getTemplateOptions);
router.post('/templates/:templateId/options', authorizeRoles('admin', 'manager'), productsController.createOption);
router.delete('/options/:optionId', authorizeRoles('admin'), productsController.deleteOption);

// 제품 카테고리 관련
router.get('/categories', authorizeRoles('admin', 'manager', 'staff'), productsController.getCategories);

export default router;
