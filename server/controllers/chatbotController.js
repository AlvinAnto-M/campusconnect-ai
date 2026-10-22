const chatbotService = require('../services/chatbotService');
const ChatHistory = require('../models/ChatHistory');

// @desc    Ask a question to CampusConnect AI
// @route   POST /api/chatbot/ask
// @access  Public (supports authenticated user or guest sessionId)
const askQuestion = async (req, res, next) => {
  try {
    const { question, sessionId = 'guest-session' } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question cannot be empty.' });
    }

    const userId = req.user ? req.user._id : null;

    // Process query using MongoDB-powered knowledge service
    const result = await chatbotService.processQuery(question, {
      userId,
      role: req.user ? req.user.role : 'Guest'
    });

    // Save conversation to ChatHistory collection
    const historyEntry = await ChatHistory.create({
      userId,
      sessionId,
      question,
      answer: result.answer,
      intent: result.intent,
      suggestedFollowUps: result.suggestedFollowUps
    });

    res.json({
      success: true,
      data: {
        id: historyEntry._id,
        question: historyEntry.question,
        answer: historyEntry.answer,
        intent: historyEntry.intent,
        suggestedFollowUps: historyEntry.suggestedFollowUps,
        metadata: result.metadata,
        timestamp: historyEntry.timestamp
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user or session chat history
// @route   GET /api/chatbot/history
// @access  Public / Optional Auth
const getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    let query = {};

    if (req.user) {
      query.$or = [{ userId: req.user._id }, { sessionId: sessionId || 'default' }];
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      query.sessionId = 'guest-session';
    }

    const history = await ChatHistory.find(query)
      .sort({ timestamp: 1 })
      .limit(50);

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chatbot/history
// @access  Public / Optional Auth
const clearChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    let query = {};

    if (req.user) {
      query.userId = req.user._id;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      query.sessionId = 'guest-session';
    }

    await ChatHistory.deleteMany(query);

    res.json({
      success: true,
      message: 'Chat history cleared successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getChatHistory,
  clearChatHistory
};
