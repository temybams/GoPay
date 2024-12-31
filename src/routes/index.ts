import express from 'express';
import TransactionRouter from '../module/transactions/transaction.route';
import PayoutRouter from '../module/payments/payment.route';
const router = express.Router();

router.use('/transaction', TransactionRouter);
router.use('/payouts', PayoutRouter);

export default router;
