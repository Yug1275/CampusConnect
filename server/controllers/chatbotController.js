const ChatbotFAQ = require("../models/ChatbotFAQ");

const FALLBACK_ANSWER =
  "I'm not sure how to help with that yet. Try asking about the library, clubs, events, campus map, or contacting admin - or reach out to your faculty/admin directly.";

// @desc    Ask the chatbot a question - matches input against FAQ keywords
// @route   POST /api/chatbot/ask
// @access  Private (any authenticated user)
const askQuestion = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("A message is required");
    }

    const input = message.toLowerCase();
    const faqs = await ChatbotFAQ.find();

    // Score each FAQ entry by how many of its keywords appear in the user's input
    let bestMatch = null;
    let bestScore = 0;

    faqs.forEach((faq) => {
      const score = faq.keywords.reduce((count, keyword) => {
        return input.includes(keyword.toLowerCase()) ? count + 1 : count;
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    });

    const answer = bestMatch && bestScore > 0 ? bestMatch.answer : FALLBACK_ANSWER;

    res.status(200).json({
      success: true,
      answer,
      matched: !!(bestMatch && bestScore > 0),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new FAQ entry
// @route   POST /api/chatbot/faqs
// @access  Private/Admin
const createFAQ = async (req, res, next) => {
  try {
    const { question, keywords, answer } = req.body;

    if (!question || !keywords || !answer) {
      res.status(400);
      throw new Error("Question, keywords, and answer are all required");
    }

    const keywordArray = Array.isArray(keywords)
      ? keywords
      : keywords.split(",").map((k) => k.trim()).filter(Boolean);

    const faq = await ChatbotFAQ.create({ question, keywords: keywordArray, answer });

    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all FAQ entries
// @route   GET /api/chatbot/faqs
// @access  Private/Admin
const getFAQs = async (req, res, next) => {
  try {
    const faqs = await ChatbotFAQ.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an FAQ entry
// @route   PUT /api/chatbot/faqs/:id
// @access  Private/Admin
const updateFAQ = async (req, res, next) => {
  try {
    const faq = await ChatbotFAQ.findById(req.params.id);

    if (!faq) {
      res.status(404);
      throw new Error("FAQ entry not found");
    }

    const { question, keywords, answer } = req.body;

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (keywords !== undefined) {
      faq.keywords = Array.isArray(keywords)
        ? keywords
        : keywords.split(",").map((k) => k.trim()).filter(Boolean);
    }

    const updated = await faq.save();

    res.status(200).json({ success: true, message: "FAQ updated successfully", faq: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an FAQ entry
// @route   DELETE /api/chatbot/faqs/:id
// @access  Private/Admin
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await ChatbotFAQ.findById(req.params.id);

    if (!faq) {
      res.status(404);
      throw new Error("FAQ entry not found");
    }

    await faq.deleteOne();

    res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { askQuestion, createFAQ, getFAQs, updateFAQ, deleteFAQ };