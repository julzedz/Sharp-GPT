const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // 'user' or 'bot'
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set creation time
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
