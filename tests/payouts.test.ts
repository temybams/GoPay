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


describe('Payouts API', () => {
    it('should create a payout', async () => {

        const response = await app.post('/api/payouts/create');
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('SUCCESS');

    });

    it('should fetch merchant balance', async () => {
        const response = await app.get('/api/payouts/balance');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.availableBalance).toBeGreaterThan(0);
    });
});
