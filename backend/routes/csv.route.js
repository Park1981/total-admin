import express from 'express';
import * as csvController from '../controllers/csv.controller.js';
import { authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin 권한만 접근 가능
router.get('/list', authorizeRoles('admin', 'manager'), csvController.httpGetCsvList);
router.get('/data/:filename', authorizeRoles('admin', 'manager'), csvController.httpGetCsvData);

export default router;
