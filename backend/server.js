const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedOpportunityRoutes = require("./routes/savedOpportunityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved", savedOpportunityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CampusLaunch API is running 🚀",
  });
});

// Environment variables
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env");
  process.exit(1);
}

// MongoDB connection
mongoose
  .connect(MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`CampusLaunch server running on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error);
    process.exit(1);
  });