import express from 'express';
import { httpGetAll, httpCreate } from '../controllers/employees.controller.js';

const employeesRouter = express.Router();

employeesRouter.get('/', httpGetAll);
employeesRouter.post('/', httpCreate);

export default employeesRouter;
