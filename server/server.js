// Load environment variables first, before anything else
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to MongoDB Atlas
connectDB();

// Initialize Express app
const app = express();

// Core Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusConnect API is running",
    timestamp: new Date().toISOString(),
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});