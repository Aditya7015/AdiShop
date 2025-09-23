import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000", // local dev
  process.env.FRONTEND_URL, // main production frontend URL
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (Postman)
    if (!origin) return callback(null, true);

    // allow localhost, main frontend, and any Vercel frontend deployments
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // reject other origins
    return callback(new Error(`CORS policy does not allow access from ${origin}`), false);
  },
  credentials: true,
}));

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

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
