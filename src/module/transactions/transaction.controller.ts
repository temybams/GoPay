import { Request, Response } from 'express';
import { CardTransactionDto, ProcessSettlementDto, VirtualTransactionDto } from '../../dto/transaction.dto';
import transactionService from './transaction.service';
import catchAsync from '../../middleware/catchasync.middleware';

// Transaction controller

const TransactionController = {

    createTransaction: catchAsync(async (req: Request, res: Response) => {
        const dto: CardTransactionDto = req.body;
        const transaction = await transactionService.createTransaction(dto);
        res.status(201).json(
            transaction
        );
    }),

    listAllTransactions: catchAsync(async (req: Request, res: Response) => {
        const transactions = await transactionService.listAllTransactions();
        res.status(200).json(transactions);
    }),

    processSettlement: catchAsync(async (req: Request, res: Response) => {

        const dto: ProcessSettlementDto = req.body;

        const updatedTransaction = await transactionService.processSettlement(dto);

        res.status(200).json({
            message: 'Transaction successfully settled',
            data: updatedTransaction,
        });
    }),

}

export default TransactionController;