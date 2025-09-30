import fetch from 'node-fetch';

const ECOMMERCE_CONTEXT = `
You are a helpful shopping assistant for StyleHub ecommerce store. 

STORE INFORMATION:
- Name: StyleHub
- Products: Clothing, Fashion accessories, Beauty products
- Shipping: Free shipping on orders above ₹499, Delivery in 3-7 business days
- Returns: 30-day return policy, items must be unused with tags
- Payment: Credit/Debit cards, UPI, Net Banking, Wallet, COD under ₹2000
- Contact: support@stylehub.com, +91-9876543210 (9 AM - 9 PM)
- Order Tracking: Available in account dashboard after 24 hours

Always be friendly, helpful, and provide accurate information. If unsure, suggest contacting support.
Keep responses concise and under 100 words.
`;

// Enhanced smart mock responses
function getSmartResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  
  const responses = {
    greeting: [
      "Hello! 👋 I'm your StyleHub shopping assistant. I can help with returns, shipping, payments, order tracking, and more. How can I assist you today?",
      "Hi there! Welcome to StyleHub. I'm here to help with any questions about our products, policies, or services. What would you like to know?",
      "Hey! I'm your StyleHub shopping helper. I can provide information about shipping, returns, payments, sizes, or contact details. How can I help?"
    ],
    
    returns: [
      "We offer a 30-day return policy! Items must be unused with original tags. Free returns across India. Start returns from your account dashboard.",
      "You can return most items within 30 days of delivery. Just ensure they're unused with tags attached. We provide free return shipping!",
      "Return policy: 30 days for unworn items with tags. Free returns. Process returns easily through your StyleHub account."
    ],
    
    shipping: [
      "🚚 Free shipping on orders above ₹499! Delivery takes 3-7 business days across India. Express delivery options available.",
      "We offer free shipping for orders over ₹499. Standard delivery: 3-7 business days. Track your order in real-time from your account!",
      "Shipping: Free delivery on ₹499+ orders. Usually 3-7 days. Order tracking available within 24 hours of shipment."
    ],
    
    payment: [
      "We accept: Credit/Debit cards, UPI, Net Banking, Wallet payments, and Cash on Delivery (for orders under ₹2000). All payments are secure!",
      "Payment options: Cards, UPI, Internet Banking, Mobile Wallets, and COD (under ₹2000). 100% secure payment processing.",
      "You can pay via: Cards, UPI, Net Banking, Wallets, or Cash on Delivery for orders below ₹2000. All methods are safe and encrypted."
    ],
    
    contact: [
      "📞 Contact us: support@stylehub.com or +91-9876543210 (9 AM - 9 PM, 7 days a week). We're here to help!",
      "Reach our support team: Email support@stylehub.com or call +91-9876543210. Available daily from 9 AM to 9 PM.",
      "Need help? Contact: support@stylehub.com or +91-9876543210. Customer service hours: 9 AM - 9 PM, all days."
    ],
    
    tracking: [
      "Track your order from 'My Orders' in your account! Tracking information updates within 24 hours of shipping.",
      "You can track your order in the 'My Orders' section. We'll email you the tracking number once your order ships!",
      "Order tracking available in your account dashboard. Get real-time updates on your delivery status after shipment."
    ],
    
    sizes: [
      "Size guides are available on each product page! Check the 'Size Guide' tab for detailed measurements and fit advice.",
      "We provide detailed size charts for all products. Look for the 'How to Measure' guide on product pages for perfect fit.",
      "Find your perfect size using our detailed guides on each product page. Still unsure? Contact us for personalized sizing help!"
    ],
    
    products: [
      "We offer clothing, fashion accessories, and beauty products across Men's, Women's, and Kids categories. Check our latest collections!",
      "StyleHub features Men's Wear, Women's Wear, Kids Wear, and Beauty Products. New arrivals added regularly!",
      "Our collections include: Men's fashion, Women's apparel, Kids clothing, and Beauty products. Something for everyone!"
    ],
    
    hours: [
      "Our customer support is available 9 AM - 9 PM, 7 days a week! We're here whenever you need help.",
      "Support hours: 9 AM to 9 PM daily, including weekends! Reach out anytime within these hours.",
      "We're available to help from 9 AM - 9 PM every day. Don't hesitate to contact us with any questions!"
    ],
    
    default: [
      "I can help with returns, shipping, payments, order tracking, sizes, products, or contact info. What would you like to know about StyleHub?",
      "I'm here to assist with StyleHub policies and services. Feel free to ask about shipping, returns, payments, or anything else!",
      "How can I help? I can provide information about our store policies, products, shipping, returns, payments, and more!"
    ]
  };

  // Smart keyword matching
  if (message.match(/\b(hi|hello|hey|good morning|good afternoon|hola|namaste)\b/i)) {
    return randomChoice(responses.greeting);
  }
  if (message.match(/\b(return|refund|exchange|send back)\b/i)) {
    return randomChoice(responses.returns);
  }
  if (message.match(/\b(ship|deliver|delivery|shipping|when will i get|dispatch|arrive)\b/i)) {
    return randomChoice(responses.shipping);
  }
  if (message.match(/\b(pay|payment|card|upi|cod|cash|wallet|debit|credit)\b/i)) {
    return randomChoice(responses.payment);
  }
  if (message.match(/\b(contact|support|help|customer service|email|phone|call|number)\b/i)) {
    return randomChoice(responses.contact);
  }
  if (message.match(/\b(track|tracking|order status|where is my order|package)\b/i)) {
    return randomChoice(responses.tracking);
  }
  if (message.match(/\b(size|fit|measure|measurement|small|medium|large|xlarge|xl)\b/i)) {
    return randomChoice(responses.sizes);
  }
  if (message.match(/\b(product|item|clothing|dress|shirt|beauty|collection)\b/i)) {
    return randomChoice(responses.products);
  }
  if (message.match(/\b(time|hour|when|available|open|close)\b/i)) {
    return randomChoice(responses.hours);
  }
  if (message.match(/\b(about you|who are you|what are you|your purpose)\b/i)) {
    return "I'm StyleHub's AI shopping assistant! I help customers with product info, shipping, returns, payments, and any questions about our store. How can I assist you today?";
  }

  return randomChoice(responses.default);
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('🟡 Received chat request:', message);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🟡 Using smart response system...');

    // Get intelligent response based on user message
    const botResponse = getSmartResponse(message);
    
    console.log('🟢 Generated response:', botResponse);
    
    res.json({ response: botResponse });

  } catch (error) {
    console.error('🔴 Chat error:', error);
    
    // Final fallback
    const fallbackResponse = "Hello! I'm your StyleHub assistant. I can help with returns (30-day policy), shipping (free above ₹499), payments, and more. What would you like to know?";
    res.json({ response: fallbackResponse });
  }
};