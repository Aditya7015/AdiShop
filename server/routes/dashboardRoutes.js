import express from "express";
import { getDashboardStats } from "../controllers/dashboardControllers.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET dashboard stats — only admin
router.get("/", protect, isAdmin, getDashboardStats);

export default router;
