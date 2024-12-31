import { TransactionType } from '@prisma/client';
import { z } from 'zod';


const CardTransactionSchema = z.object({
    amount: z
        .number({ required_error: 'Amount is required.' })
        .positive({ message: 'Amount must be greater than zero.' }),
    description: z
        .string({ required_error: 'Description is required.' })
        .min(1, { message: 'Description must not be empty.' }),
    cardNumber: z
        .string({ required_error: 'Card number is required.' })
        .regex(/^\d{16}$/, { message: 'Card number must be exactly 16 digits.' }),
    cardholderName: z
        .string({ required_error: 'Cardholder name is required.' })
        .min(1, { message: 'Cardholder name must not be empty.' }),
    expirationDate: z
        .string({ required_error: 'Expiration date is required.' })
        .regex(/^\d{2}\/\d{2}$/, { message: 'Expiration date must be in MM/YY format.' }),
    cvv: z
        .string({ required_error: 'CVV is required.' })
        .regex(/^\d{3}$/, { message: 'CVV must be exactly 3 digits.' }),
    currency: z
        .string({ required_error: 'Currency is required.' })
        .length(3, { message: 'Currency must be a 3-letter code.' }),
    type: z
        .literal('CARD', { invalid_type_error: 'Transaction type must be CARD.' })
        .or(z.literal('VIRTUAL', { invalid_type_error: 'Transaction type must be VIRTUAL.' })),
});

const VirtualTransactionSchema = z.object({
    amount: z
        .number({ required_error: 'Amount is required.' })
        .positive({ message: 'Amount must be greater than zero.' }),
    description: z
        .string({ required_error: 'Description is required.' })
        .min(1, { message: 'Description must not be empty.' }),
    accountName: z
        .string({ required_error: 'Account name is required.' })
        .min(1, { message: 'Account name must not be empty.' }),
    accontNumber: z
        .string({ required_error: 'Account number is required.' })
        .regex(/^\d{10}$/, { message: 'Account number must be exactly 10 digits.' }),
    bankCode: z
        .string({ required_error: 'Bank code is required.' })
        .min(1, { message: 'Bank code must not be empty.' }),
    currency: z
        .string({ required_error: 'Currency is required.' })
        .length(3, { message: 'Currency must be a 3-letter code.' }),
    type: z
        .literal('VIRTUAL', { invalid_type_error: 'Transaction type must be VIRTUAL.' }),
});

const ProcessSettlementSchema = z.object({
    reference: z
        .string()
        .min(1, { message: 'Transaction reference is required.' })
        .max(255, { message: 'Transaction reference is too long.' }),
    
});



export { CardTransactionSchema, VirtualTransactionSchema, ProcessSettlementSchema };
