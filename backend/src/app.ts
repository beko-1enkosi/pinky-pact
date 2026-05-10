import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from './api/routes/ai';
import pactRoutes from './api/routes/pacts';
import userRoutes from './api/routes/users';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/pacts', pactRoutes);
app.use('/api/users', userRoutes);

export default app;