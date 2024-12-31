import crypto from 'crypto';

export const generateTransactionReference = (): string => {
    const timestamp = Date.now().toString();
    const randomHex = crypto.randomBytes(3).toString('hex');
    return `TXN-${timestamp}-${randomHex}`.toUpperCase();
};

export const maskCardNumber = (cardNumber: string | null): string | null => {
    if (!cardNumber || cardNumber.length < 4) return null;
    return `**** **** **** ${cardNumber.slice(-4)}`;
};
