import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./configs/db.js";

import userRoutes from "./routes/UserRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';
import stripeRoutes from "./routes/stripeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";




dotenv.config();
connectDB();

const app = express();

// Enable CORS and parse JSON requests
app.use(cors());
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
app.use("/api/stripe", stripeRoutes);
app.use("/api/orders", orderRoutes);




// Global error handling middleware (optional, good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
