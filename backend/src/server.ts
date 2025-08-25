import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";

import { connectDB } from "./utils/database";
import { errorHandler } from "./middleware/errorHandler";

// Routes
import reportRoutes from "./routes/reportRoutes";
import matchingRoutes from "./routes/matchingRoutes";
import communityRoutes from "./routes/communityRoutes";
import alertRoutes from "./routes/alertRoutes";
import authRoutes from "./routes/authRoutes";
import policeRoutes from "./routes/policeRoutes";
import ngoRoutes from "./routes/ngoRoutes"; // ✅ include NGO routes

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Not loaded");

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const allowed = new Set([
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ]);
      if (allowed.has(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use((req, _res, next) => {
  (req as any).requestId = (req.headers["x-request-id"] as string) || uuidv4();
  next();
});

morgan.token("id", (req) => (req as any).requestId as string);
app.use(morgan(":id :method :url :status :response-time ms"));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(compression());

// static for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// DB
connectDB();

// Health
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
app.get("/live", (_req, res) => res.sendStatus(204));
app.get("/ready", (_req, res) => res.sendStatus(204));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/ngo", ngoRoutes); // ✅ mount NGO routes under /api/ngo

// 404
app.use("*", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend: ${FRONTEND_URL}`);
});

const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Closing server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

export default app;
