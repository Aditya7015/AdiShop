import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./configs/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js'
import stripeRoutes from './routes/stripeRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import orderStatusRoutes from './routes/orderStatusRoutes.js';
import { searchProducts } from './controllers/searchController.js';





dotenv.config();
connectDB();



const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

// Enable CORS and parse JSON requests
// app.use(cors());
// app.use(cors({
//   origin: FRONTEND_URL,
//   credentials: true,
// }));

// app.use(cors({
//   origin: FRONTEND_URL || "*", // fallback for safety
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));

app.use(cors({
  origin: [ "http://localhost:5173", "https://adi-shop-nine.vercel.app" ],
  credentials: true,
}));



app.use('/api/webhook', webhookRoutes);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/stripe', stripeRoutes);

app.use("/api/orders", orderRoutes);
app.use('/api', chatRoutes);
app.use("/api/order-status", orderStatusRoutes);
app.get("/api/search", searchProducts);



// Global error handling middleware (optional, good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));