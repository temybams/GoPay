import httpStatus from 'http-status'
import { TransactionType, TransactionStatus, Prisma } from '@prisma/client'
import { prisma } from '../../services/prisma.service'
import { throwError } from '../../utils'
import { generateTransactionReference, maskCardNumber } from '../../services/generate'
import { CardTransactionDto, ProcessSettlementDto, VirtualTransactionDto } from '../../dto/transaction.dto';



const transactionService = {

    createTransaction: async (
        dto: CardTransactionDto | VirtualTransactionDto
    ) => {

        const isCardTransaction = (dto: any): dto is CardTransactionDto =>
            dto.type === TransactionType.CARD;

        const transactionReference = generateTransactionReference();

        const status =
            dto.type === TransactionType.CARD
                ? TransactionStatus.PENDING
                : TransactionStatus.SUCCESS;

        const transactionData = isCardTransaction(dto)
            ? {
                amount: dto.amount,
                description: dto.description,
                cardNumber: dto.cardNumber,
                cardholderName: dto.cardholderName,
                expirationDate: dto.expirationDate,
                cvv: dto.cvv,
                currency: dto.currency,
                fee: dto.amount * 0.03,
                type: TransactionType.CARD,
                status,
                reference: transactionReference,
            }
            : {
                amount: dto.amount,
                description: dto.description,
                accountName: dto.accountName,
                accontNumber: dto.accontNumber,
                bankCode: dto.bankCode,
                currency: dto.currency,
                fee: dto.amount * 0.05,
                type: TransactionType.VIRTUAL,
                status,
                reference: transactionReference,
            };


        const transaction = await prisma.transaction.create({ data: transactionData });


        return {
            ...transaction,
            cardNumber: isCardTransaction(dto)
            ? maskCardNumber(transaction.cardNumber) 
            : null,

        };
    },

    listAllTransactions: async () => {
        const transactions = await prisma.transaction.findMany();


        return transactions.map((transaction) => ({
            ...transaction,
            cardNumber: transaction.cardNumber ? maskCardNumber(transaction.cardNumber) : null,
        }));
    },

    processSettlement: async (dto: ProcessSettlementDto) => {
       
        const { reference } = dto;
        
        const transaction = await prisma.transaction.findUnique({
            where: { reference },
        });

        
        if (!transaction) {
            throw throwError('Transaction not found for the given reference.', httpStatus.NOT_FOUND);
        }

        
        if (transaction.type !== TransactionType.CARD) {
            throw throwError('Settlement requests are only valid for CARD transactions.', httpStatus.BAD_REQUEST);
        }

        
        if (transaction.status === TransactionStatus.SUCCESS) {
            throw throwError('Transaction is already settled.', httpStatus.CONFLICT);
        }

        
        const updatedTransaction = await prisma.transaction.update({
            where: { reference },
            data: {
                status: TransactionStatus.SUCCESS,
            },
        });

        if (updatedTransaction.cardNumber) {
            updatedTransaction.cardNumber = maskCardNumber(updatedTransaction.cardNumber);
        }

        return updatedTransaction;

    },

};



export default transactionService;