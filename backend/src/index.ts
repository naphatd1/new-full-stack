import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { setupSwagger } from "./config/swagger-setup";
import { getThaiTimestamp } from "./middleware/timestamp";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";
import {
  activityTracker,
  cleanupExpiredSessions,
} from "./middleware/activityTracker.middleware";
import apiRoutes from "./routes";
import { connectDatabase, setupGracefulShutdown } from "./config/database";

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(helmet()); // Security headers

// Enable CORS with specific configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://192.168.1.36:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Session-Token", "Range"],
    exposedHeaders: ["Accept-Ranges", "Content-Range", "Content-Length"],
  })
);
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "100mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Trust proxy for rate limiting
app.set("trust proxy", 1);

// Video streaming middleware (must be before static files)
import { videoStreamMiddleware } from "./middleware/video-stream.middleware";
app.use(videoStreamMiddleware);

// Serve static files (uploaded images and videos)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Serve documentation files
app.use("/docs", express.static(path.join(process.cwd(), "docs")));

// Activity tracker middleware (ต้องอยู่ก่อน API routes)
app.use("/v1/api", activityTracker);

// Setup Swagger Documentation
setupSwagger(app);

// API Routes
app.use("/v1/api", apiRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "สวัสดี! User Management API กำลังทำงาน!",
    timestamp: getThaiTimestamp(),
    timezone: "Asia/Bangkok",
    version: "2.0.0",
    documentation: "/v1/api",
    swagger: "/v1/api-docs",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    uptime: `${Math.floor(process.uptime())} วินาที`,
    timestamp: getThaiTimestamp(),
    timezone: "Asia/Bangkok",
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Setup graceful shutdown handlers
setupGracefulShutdown();

// Start server
async function startServer() {
  await connectDatabase();

  // ตั้ง interval สำหรับ cleanup expired sessions ทุก 5 นาที
  setInterval(cleanupExpiredSessions, 5 * 60 * 1000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://192.168.1.36:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/v1/api`);
    console.log(
      `📖 Swagger Documentation: http://localhost:${PORT}/v1/api-docs`
    );
    console.log(`🔄 Session cleanup running every 5 minutes`);
    // console.log(`🔐 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

export default app;
