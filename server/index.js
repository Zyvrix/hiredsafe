require("dotenv").config();
const express = require("express");
const cors = require("cors");
const reportsRouter = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", reportsRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start
app.listen(PORT, () => {
  console.log(`\n  🛡️  HireDSafe API running → http://localhost:${PORT}\n`);
});
