import { generateTransactionReference } from '../../services/generate';
import httpStatus from 'http-status';
import { throwError } from '../../utils'
import { prisma } from '../../services/prisma.service';
import { PayoutStatus, TransactionStatus, TransactionType } from '@prisma/client';

const PayoutService = {
    createPayout: async () => {

        const settledTransactions = await prisma.transaction.findMany({
            where: { status: 'SUCCESS' },
        });

        if (!settledTransactions.length) {
            throw throwError('No settled transactions available for payout.', httpStatus.NOT_FOUND);
        }


        let totalAmount = 0;
        let totalFee = 0;

        settledTransactions.forEach((transaction) => {
            totalAmount += transaction.amount;
            totalFee +=
                transaction.type === 'CARD'
                    ? transaction.amount * 0.03
                    : transaction.amount * 0.05;
        });


        const payoutAmount = totalAmount - totalFee;

        if (payoutAmount <= 0) {
            throw throwError('Payout amount is insufficient after fees.', httpStatus.BAD_REQUEST);
        }


        const payoutReference = generateTransactionReference();


        const payout = await prisma.payout.create({
            data: {
                amount: payoutAmount,
                fee: totalFee,
                reference: payoutReference,
                status: 'PENDING',
            },
        });

        const updatedPayout = await prisma.payout.update({
            where: { id: payout.id },
            data: { status: PayoutStatus.SUCCESS},
        });

        return updatedPayout;
    },


    getMerchantBalance: async () => {

        const settledTransactions = await prisma.transaction.findMany({
            where: { status: TransactionStatus.SUCCESS },
        });

        const availableBalance = settledTransactions.reduce((sum, txn) => {
            const fee =
                txn.type === TransactionType.CARD
                    ? txn.amount * 0.03
                    : txn.amount * 0.05;
            return sum + txn.amount - fee;
        }, 0);


        const pendingTransactions = await prisma.transaction.findMany({
            where: { status: TransactionStatus.PENDING },
        });

        const pendingSettlement = pendingTransactions.reduce((sum, txn) => sum + txn.amount, 0);

        return { availableBalance, pendingSettlement };
    },
}






export default PayoutService;