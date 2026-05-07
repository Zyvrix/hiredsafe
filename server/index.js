require("dotenv").config();

const express = require("express");
const cors = require("cors");

const reportsRouter = require("./routes/reports");

const app = express();

const PORT = process.env.PORT || 5000;

/* ========================================
   MIDDLEWARE
======================================== */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

/* ========================================
   ROOT ROUTE
======================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HireDSafe API running successfully",
  });
});

/* ========================================
   TEST ROUTE
======================================== */

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend test successful",
  });
});

/* ========================================
   HEALTH CHECK
======================================== */

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* ========================================
   REPORT ROUTES
======================================== */

app.use("/api/reports", reportsRouter);

/* ========================================
   404 HANDLER
======================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`,
  });
});

/* ========================================
   GLOBAL ERROR HANDLER
======================================== */

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);

  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong on the server.",
  });
});

/* ========================================
   START SERVER
======================================== */

app.listen(PORT, () => {
  console.log(
    `🛡️ HireDSafe API running → http://localhost:${PORT}`
  );
});