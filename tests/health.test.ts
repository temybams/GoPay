import request from 'supertest';
import app from '../src/app';

describe('Health Check', () => {
  it('should return 200 on root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Hello, TypeScript with Express!',
    });
  });
});
