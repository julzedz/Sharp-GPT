const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Replaces body-parser 

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

  const chatRoute = require("./routes/chat");
app.use("/api", chatRoute);

// Route Handling
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "🚀 Express Server Running!",
    timestamp: new Date(),
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Server Startup
const PORT = process.env.PORT || 4000; 
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🔥 Server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Try this URL: http://localhost:${PORT}`);
});