const mongoose = require("mongoose");

const chatbotFAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question label is required"],
      trim: true,
    },
    keywords: {
      type: [String],
      required: [true, "At least one keyword is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one keyword is required",
      },
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatbotFAQ = mongoose.model("ChatbotFAQ", chatbotFAQSchema);

module.exports = ChatbotFAQ;