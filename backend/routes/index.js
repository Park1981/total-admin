import express from 'express';
import employeesRouter from './employees.route.js';
// import productsRouter from './products.route.js'; // Example for later

const apiRouter = express.Router();

apiRouter.use('/employees', employeesRouter);
// apiRouter.use('/products', productsRouter); // Example for later

export default apiRouter;
