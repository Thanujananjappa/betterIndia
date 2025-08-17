// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

import { connectDB } from './utils/database';
import { errorHandler } from './middleware/errorHandler';

// Routes
import reportRoutes from './routes/reportRoutes';
import matchingRoutes from './routes/matchingRoutes';
import communityRoutes from './routes/communityRoutes';
import alertRoutes from './routes/alertRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Trust proxy (needed if behind nginx/Render/Heroku) ---
app.set('trust proxy', 1);

// --- Basic security headers ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images/fonts if needed
  })
);

// --- CORS ---
app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin / server-to-server / local tools
      if (!origin) return cb(null, true);

      const allowed = new Set([
        FRONTEND_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ]);
      if (allowed.has(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// --- Request ID for tracing ---
app.use((req, _res, next) => {
  (req as any).requestId = req.headers['x-request-id'] || uuidv4();
  next();
});

// --- Logging ---
morgan.token('id', (req) => (req as any).requestId as string);
app.use(morgan(':id :method :url :status :response-time ms'));

// --- Parsers & compression ---
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());

// --- Rate limiting (tune to your needs) ---
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120,            // 120 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// --- DB connection ---
connectDB();

// --- Health, liveness, readiness ---
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Missing Person AI System Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});
app.get('/live', (_req, res) => res.sendStatus(204)); // container liveness
app.get('/ready', (_req, res) => {
  // optionally check DB connection state here
  res.sendStatus(204);
});

// --- API routes (non-versioned, keep existing) ---
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/alerts', alertRoutes);

// --- Versioned mount (future proofing) ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/alerts', alertRoutes);

// --- 404 handler (after routes) ---
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Centralized error handler ---
app.use(errorHandler);

// --- Start server ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health:     http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend:   ${FRONTEND_URL}`);
});

// --- Graceful shutdown ---
const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Closing server...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // If you hold DB connections, close them here.
    process.exit(0);
  });
  // Force exit after 10s
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// --- Unhandled errors ---
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

export default app;
