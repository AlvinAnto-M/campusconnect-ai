const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getChatHistory,
  clearChatHistory
} = require('../controllers/chatbotController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/ask', optionalAuth, askQuestion);
router.get('/history', optionalAuth, getChatHistory);
router.delete('/history', optionalAuth, clearChatHistory);

module.exports = router;
