const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini SDK
const Message = require("./models/Message"); // Import Message model

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Enable CORS
app.use(express.json()); //  Parse JSON request bodies

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Gemini Setup
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Route Handling
    app.get("/", (req, res) => {
      res.send("🚀 Chatbot Server Running!");
    });
    
    app.post("/api/chat", async (req, res) => {
      const userMessage = req.body.message; // Message from frontend
    
      if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
      }
      try {
        // Save user message to database
        const newUserMessage = new Message({
          sender: "user",
          text: userMessage,
        });
        await newUserMessage.save();
    
        // Send message to Gemini
        const result = await model.generateContent(userMessage);
        const botResponse = result.response.text(); // Get bot response
    
        // Save bot message to database
        const newBotMessage = new Message({
          sender: "bot",
          text: botResponse,
        });
        await newBotMessage.save();
    
        // Send response back to frontend
        res.json({ response: botResponse });
    
      } catch (error) {
        console.error("Error during chat interaction:", error);
        res
          .status(500)
          .json({ error: "Something went wrong with the AI or Database" });
      }
    });

    // Optional: Route to fetch chat history
    app.get('/api/history', async (req, res) => {
      try {
        const history = await Message.find().sort({ timestamp: 1 }); // Get all messages, sorted by time
        res.json(history);
      } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Error fetching chat history' });
      }
    });
    
    // Server Startup
    app.listen(PORT, () => {
      console.log(`🔥🔗 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
