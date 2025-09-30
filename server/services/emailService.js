import nodemailer from 'nodemailer';

// Create transporter with Brevo configuration
const createTransporter = () => {
  // Use Brevo specific configuration
  if (process.env.EMAIL_SERVICE === 'brevo') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // Fallback to regular service configuration
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email templates for AdiShow
const emailTemplates = {
  orderConfirmation: (order, user, products = []) => {
    const itemsHTML = order.products.map((item, index) => {
      const product = products[index] || { 
        name: 'Product', 
        images: [], 
        offerPrice: 0, 
        price: 0 
      };
      const price = product.offerPrice || product.price;
      return `
      <div class="product-item">
        <div style="display: flex; align-items: center; gap: 15px;">
          ${product.images && product.images[0] ? 
            `<img src="${product.images[0]}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : 
            '<div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📦</div>'
          }
          <div>
            <strong>${product.name}</strong><br>
            <small>Quantity: ${item.quantity} × ₹${price}</small>
          </div>
        </div>
        <div style="font-weight: bold;">₹${price * item.quantity}</div>
      </div>
    `}).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .order-details { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .product-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
    .total { font-weight: bold; font-size: 1.2em; color: #667eea; background: #f8f9ff; padding: 15px; border-radius: 8px; margin-top: 15px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; padding: 20px; }
    .status-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; }
    .creator-info { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
      <p>Thank you for shopping with AdiShow</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your order has been confirmed and is being processed. Here are your order details:</p>
      
      <div class="order-details">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">Order #${order.orderId}</h3>
          <span class="status-badge">Confirmed</span>
        </div>
        
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        
        <h4 style="margin-bottom: 15px;">Items Ordered:</h4>
        ${itemsHTML}
        
        <div class="total">
          <div style="display: flex; justify-content: space-between;">
            <div>Total Amount:</div>
            <div>₹${order.amount}</div>
          </div>
        </div>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h4 style="margin-bottom: 15px;">Order Status</h4>
        <p>✅ Payment Received<br>📦 Preparing Your Order<br>🚚 Shipping Soon</p>
        <p><strong>Estimated Delivery:</strong> 3-7 business days</p>
      </div>

      <div class="creator-info">
        <p style="margin: 0; font-style: italic;">
          <strong>Built with ❤️ by Aditya Tiwari</strong><br>
          B.Tech CSE, Galgotias College of Engineering and Technology, Greater Noida
        </p>
      </div>
      
      <div class="footer">
        <p>Need help? Contact us at <a href="mailto:adityatiwari7553@gmail.com" style="color: #667eea;">adityatiwari7553@gmail.com</a></p>
        <p>© 2024 AdiShow. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  },

  orderShipped: (order, user, trackingNumber = null) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .tracking-info { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; border: 2px dashed #10b981; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; padding: 20px; }
    .creator-info { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚚 Your Order is Shipped!</h1>
      <p>Good news! Your AdiShow order is on the way</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Great news! Your order <strong>#${order.orderId}</strong> has been shipped and is on its way to you.</p>
      
      <div class="tracking-info">
        <h3 style="color: #059669; margin-bottom: 15px;">📦 Package Shipped</h3>
        ${trackingNumber ? `
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <a href="https://www.ship24.com/" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; font-weight: bold;">
            Track Your Package
          </a>
        ` : `
          <p>Tracking information will be available soon in your account.</p>
        `}
      </div>
      
      <p><strong>Estimated Delivery:</strong> ${new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      
      <p>You can check your order status anytime from your <a href="${process.env.FRONTEND_URL}/orders" style="color: #667eea;">order history</a>.</p>

      <div class="creator-info">
        <p style="margin: 0; font-style: italic;">
          <strong>Built with passion by Aditya Tiwari</strong><br>
          Computer Science Engineering Student at GCET, Greater Noida
        </p>
      </div>
      
      <div class="footer">
        <p>Questions? Contact us at <a href="mailto:adityatiwari7553@gmail.com" style="color: #667eea;">adityatiwari7553@gmail.com</a></p>
        <p>© 2024 AdiShow. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `,

  welcome: (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .benefits { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; padding: 20px; }
    .creator-section { background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 2px solid #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to AdiShow! 🛍️</h1>
      <p>Your Premier E-commerce Destination</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Welcome to AdiShow! We're thrilled to have you join our growing community of fashion enthusiasts and smart shoppers.</p>
      
      <div class="benefits">
        <p style="font-weight: bold; margin-bottom: 15px; color: #667eea;">As a valued AdiShow member, you get:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">🎁 <strong>Exclusive member discounts</strong> on your first order</li>
          <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">🚚 <strong>Free shipping</strong> on orders above ₹499</li>
          <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">↩️ <strong>Hassle-free 30-day returns</strong></li>
          <li style="padding: 10px 0;">⭐ <strong>Early access</strong> to new collections and flash sales</li>
        </ul>
      </div>
      
      <div class="creator-section">
        <h3 style="color: #667eea; margin-bottom: 10px;">👨‍💻 Meet Your Developer</h3>
        <p style="margin: 5px 0;"><strong>Aditya Tiwari</strong></p>
        <p style="margin: 5px 0; font-size: 0.9em;">B.Tech Computer Science Engineering</p>
        <p style="margin: 5px 0; font-size: 0.9em;">Galgotias College of Engineering and Technology</p>
        <p style="margin: 5px 0; font-size: 0.9em;">Greater Noida, Uttar Pradesh</p>
        <p style="margin: 10px 0 0 0; font-style: italic;">"Building innovative solutions for modern e-commerce"</p>
      </div>
      
      <p>Discover our carefully curated collections and find your perfect style statement!</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${process.env.FRONTEND_URL}/products" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 1.1em; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          Explore AdiShow Collections
        </a>
      </div>
      
      <div class="footer">
        <p>Happy Shopping!<br>The AdiShow Team</p>
        <p style="margin-top: 10px; font-size: 0.8em;">
          Developed with ❤️ by Aditya Tiwari | GCET Greater Noida
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `
};

// Email service functions
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    // Check if email configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('🟡 Email configuration missing, skipping email send');
      return { success: true, skipped: true, message: 'Email configuration not set' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `AdiShow - ${subject}`,
      text: text || subject,
      html,
    };

    console.log('🟡 Attempting to send email via Brevo...');
    const result = await transporter.sendMail(mailOptions);
    console.log('🟢 Email sent successfully to:', to);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('🔴 Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
export const sendOrderConfirmation = async (order, user, products = []) => {
  try {
    const html = emailTemplates.orderConfirmation(order, user, products);
    const subject = `Order Confirmed - #${order.orderId}`;
    
    return await sendEmail(user.email, subject, html);
  } catch (error) {
    console.error('🔴 Order confirmation email failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderShipped = async (order, user, trackingNumber = null) => {
  const html = emailTemplates.orderShipped(order, user, trackingNumber);
  const subject = `Your Order is Shipped! - #${order.orderId}`;
  
  return await sendEmail(user.email, subject, html);
};

export const sendWelcomeEmail = async (user) => {
  const html = emailTemplates.welcome(user);
  const subject = 'Welcome to AdiShow! Start Your Shopping Journey';
  
  return await sendEmail(user.email, subject, html);
};

export default {
  sendEmail,
  sendOrderConfirmation,
  sendOrderShipped,
  sendWelcomeEmail,
};