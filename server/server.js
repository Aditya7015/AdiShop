import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./configs/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js'


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

app.use(cors({
  origin: FRONTEND_URL || "*", // fallback for safety
  methods: ["GET", "POST", "PUT", "DELETE"],
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



// Global error handling middleware (optional, good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
