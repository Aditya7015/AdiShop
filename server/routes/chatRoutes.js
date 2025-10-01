// // backend/routes/chatRoutes.js
// import express from 'express';
// import { chatWithAI } from '../controllers/chatController.js';

// const router = express.Router();

// router.post('/chat', chatWithAI);

// export default router;

import express from 'express';
import { getAIResponse } from '../services/chatService.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    console.log('🟡 Received chat request:', message);
    
    const response = await getAIResponse(message.trim());
    
    console.log('🟢 Final response:', response);
    
    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('🔴 Chat route error:', error);
    
    // Even if there's an error, provide a fallback response
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      response: fallbackResponse
    });
  }
});

// Fallback function for route errors
function getFallbackResponse(message = '') {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! Welcome to AdiShop. How can I assist you today?";
  } else if (lowerMessage.includes('shipping')) {
    return "We offer free shipping on orders above ₹499. Delivery takes 3-7 business days.";
  } else if (lowerMessage.includes('return')) {
    return "We have a 30-day return policy. Items must be unused with original tags.";
  } else {
    return "I'm here to help with AdiShop! Ask me about shipping, returns, products, or payments.";
  }
}

export default router;