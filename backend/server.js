const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini SDK
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Enable CORS
app.use(express.json()); //  Parse JSON request bodies

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
        // Send message to Gemini
        const result = await model.generateContent(userMessage);
        const botResponse = result.response.text(); // Get bot response

        // Send response to frontend
        res.json({ response: botResponse });
    
      } catch (error) {
        console.error("Error during chat interaction:", error);
        res
          .status(500)
          .json({ error: "Something went wrong with the Sharp GPT" });
      }
    });

    // Server Startup
    app.listen(PORT, () => {
      console.log(`🔥🔗 Server running on http://localhost:${PORT}`);
    });
