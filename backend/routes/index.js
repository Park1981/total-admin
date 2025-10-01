import express from 'express';
import employeesRouter from './employees.route.js';
import productsRouter from './products.route.js';
import csvRouter from './csv.route.js';

const apiRouter = express.Router();

apiRouter.use('/employees', employeesRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/csv', csvRouter);

export default apiRouter;
