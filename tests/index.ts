import {  PrismaClient} from '@prisma/client'
import { execSync } from 'child_process'
import request, { Test } from 'supertest'
import TestAgent from 'supertest/lib/agent'
import app from '../src/app'
import { connectPrisma, prisma } from '../src/services/prisma.service'

//An integration test would check whether the API endpoints interact correctly with the database and return the expected results.
//Helper functions to prepare and clean up the test environment.

const setupTestModule = async (): Promise<{
    prisma: PrismaClient
    app: TestAgent<Test>
}> => {

    const newClient = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })

    execSync('yarn db:push')

    await connectPrisma()

    // Clean up
    await newClient.$transaction(async(prisma)=>{
        await prisma.transaction.deleteMany()
        await prisma.payout.deleteMany()
    })

    return {
        prisma,
        app: request(app),
    }
}

const teardownTestModule = async () => {
    if (prisma) {
        await prisma.$disconnect()
    }
}

export {
    setupTestModule,
    teardownTestModule,
}