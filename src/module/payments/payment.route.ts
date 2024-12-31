import express from 'express';
import PayoutController from './payment.controller';

const PayoutRouter = express.Router();


PayoutRouter.post('/create', PayoutController.createPayout);


PayoutRouter.get('/balance', PayoutController.getMerchantBalance);

export default PayoutRouter;
