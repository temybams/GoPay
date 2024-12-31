import express from 'express';
import TransactionController from './transaction.controller';
import  validationMiddleware  from '../../middleware/validation.middleware';
import {
    CardTransactionSchema,
    ProcessSettlementSchema,
    VirtualTransactionSchema,
} from '../../validation/transaction.validation';


const TransactionRouter = express.Router();


TransactionRouter.post(
    '/card',
    validationMiddleware(CardTransactionSchema),
    TransactionController.createTransaction
);

TransactionRouter.post(
    '/virtual',
    validationMiddleware(VirtualTransactionSchema),
    TransactionController.createTransaction
);

TransactionRouter.get('/', TransactionController.listAllTransactions);

TransactionRouter.patch(
    '/settle',
    validationMiddleware(ProcessSettlementSchema), 
    TransactionController.processSettlement
);

export default TransactionRouter;
