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

// CORS middleware: allow localhost, all Vercel frontends, and Postman
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman or server-to-server requests

    // Allow localhost
    if (origin === "http://localhost:3000") return callback(null, true);

    // Allow any frontend hosted on Vercel (including previews)
    if (origin.endsWith(".vercel.app")) return callback(null, true);

    // Block everything else
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
