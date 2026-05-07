require("dotenv").config();
const express = require("express");
const cors = require("cors");
const reportsRouter = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", // Allow specific origin in production if needed
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working perfectly!" });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/reports", reportsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong on the server."
  });
});

// Start
app.listen(PORT, () => {
  console.log(`\n  🛡️  HireDSafe API running → http://localhost:${PORT}\n`);
});
