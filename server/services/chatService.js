import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Now using environment variable
});

export const getAIResponse = async (message) => {
  try {
    console.log('🟡 Using Groq model: llama-3.1-8b-instant');
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are AdiShop customer support assistant. 
          RULES:
          - Answer questions directly about: products, shipping, returns, payments, orders
          - Keep responses SHORT (1-2 sentences max)
          - Don't ask follow-up questions unless needed
          - Be professional but friendly
          - Focus on e-commerce topics only
          
          SHIPPING: Free above ₹499, 3-7 days delivery
          RETURNS: 30-day return policy
          PAYMENTS: UPI, cards, net banking
          CONTACT: adityatiwari7553@gmail.com`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 80,
    });

    const response = completion.choices[0]?.message?.content;
    console.log('🟢 Groq response successful');
    return response || getFallbackResponse(message);
    
  } catch (error) {
    console.error('🔴 Groq API error:', error.message);
    return getFallbackResponse(message);
  }
};

// Smart fallback responses
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! Welcome to AdiShop. How can I help you today?";
  } else if (lowerMessage.includes('how are you')) {
    return "I'm doing well, thank you! How can I assist you with AdiShop today?";
  } else if (lowerMessage.includes('shipping')) {
    return "Free shipping on orders above ₹499. Delivery takes 3-7 business days.";
  } else if (lowerMessage.includes('return')) {
    return "30-day return policy. Items must be unused with original tags.";
  } else if (lowerMessage.includes('payment')) {
    return "We accept UPI, cards, net banking. All payments are secure.";
  } else {
    return "I'm here to help with AdiShop! Ask me about products, shipping, or returns.";
  }
};