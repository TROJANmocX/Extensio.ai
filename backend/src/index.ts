import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRouter from "./routes/generate";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: "*", // In production, we'd lock this down to our frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Setup JSON body parser with comfortable boundaries for custom files payloads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Standard health checking route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Mount modular AI router
app.use("/api", generateRouter);

// Global Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Global Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message
  });
});

// Initialize server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Extensio.ai Backend running on port ${PORT}`);
  console.log(`🏥 Health check active at http://localhost:${PORT}/health`);
  console.log(`=========================================`);
});
