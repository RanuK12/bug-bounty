import request from 'supertest';
import express from 'express';
import { authRoutes } from '../routes/authRoutes.js';
import { authMiddleware } from '../middleware/auth.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/refresh', () => {
  it('rejects unauthenticated request', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });
});
