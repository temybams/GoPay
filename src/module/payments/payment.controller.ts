import { Request, Response } from 'express';
import catchAsync from '../../middleware/catchasync.middleware';
import PayoutService from './payment.service';

const PayoutController = {
    
    createPayout: catchAsync(async (_req: Request, res: Response) => {
        const payout = await PayoutService.createPayout();
        res.status(201).json({
            success: true,
            message: 'Payout created successfully',
            data: payout,
        });
    }),

    
    getMerchantBalance: catchAsync(async (_req: Request, res: Response) => {
        const balance = await PayoutService.getMerchantBalance();
        res.status(200).json({
            success: true,
            message: 'Merchant balance fetched successfully',
            data: balance,
        });
    }),
};

export default PayoutController;
