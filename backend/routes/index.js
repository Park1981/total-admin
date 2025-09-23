import express from 'express';
import employeesRouter from './employees.route.js';
import productsRouter from './products.route.js';

const apiRouter = express.Router();

apiRouter.use('/employees', employeesRouter);
apiRouter.use('/products', productsRouter);

export default apiRouter;
