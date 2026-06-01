const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
connectDB();
// Ping NLP service every 10 minutes to prevent sleep
setInterval(async () => {
  try {
    const axios = require("axios");
    await axios.get(process.env.AI_SERVICE_URL);
    console.log("NLP service pinged ✅");
  } catch (e) {
    console.log("NLP ping failed:", e.message);
  }
}, 10 * 60 * 1000);
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically


// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/income", require("./routes/incomeRoutes"));
app.use("/api/v1/expense", require("./routes/expenseRoutes"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/v1/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running! 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
