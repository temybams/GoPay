import TestAgent from 'supertest/lib/agent'
import { Test } from 'supertest'
import { setupTestModule, teardownTestModule } from './index'

import { Prisma, PrismaClient } from '@prisma/client'

let app: TestAgent<Test>
let prisma: PrismaClient


beforeAll(async () => {
    ; ({ app, prisma } = await setupTestModule())
})

afterAll(async () => {
    await teardownTestModule()
})



describe('Transactions API', () => {
    it('should create a card transaction', async () => {
        const response = await app
            .post('/api/transaction/card')
            .send({
                type: 'CARD',
                amount: 1000,
                description: 'Test transaction',
                cardNumber: '1234567812345678',
                cardholderName: 'John Doe',
                expirationDate: '12/25',
                cvv: '123',
                currency: 'USD',
            });
        

        expect(response.status).toBe(201);
        expect(response.body.cardNumber).toBe('**** **** **** 5678');

    });

    it('should create a virtual account transaction', async () => {
        const response = await app
            .post('/api/transaction/virtual')
            .send({
                type: 'VIRTUAL',
                amount: 2000,
                description: 'Virtual transaction',
                accountName: 'Jane Doe',
                accontNumber: '1234567890',
                bankCode: '123',
                currency: 'USD',
            });
     
            
        expect(response.status).toBe(201);
        expect(response.body.cardNumber).toBeNull();
    });

    it('should fetch all transactions', async () => {
        const response = await app.get('/api/transaction');

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should settle a card transaction', async () => {

        const transaction = await prisma.transaction.create({
            data: {
                type: 'CARD',
                amount: 1000,
                description: 'Pending transaction',
                cardNumber: '1234567812345678',
                cardholderName: 'John Doe',
                expirationDate: '12/25',
                cvv: '123',
                currency: 'USD',
                status: 'PENDING',
                reference: 'TEST-REF-SETTLE',
            },
        });

        const response = await app
            .patch('/api/transaction/settle')
            .send({
                reference: transaction.reference,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('SUCCESS');
    });
});
