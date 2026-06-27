// Load environment variables first, before anything else
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB Atlas
connectDB();

// Initialize Express app
const app = express();

// Core Middleware
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusConnect API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - must come after all defined routes
app.use(notFound);

// Centralized error handler - must be the last middleware
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});