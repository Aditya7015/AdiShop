// server/routes/orderRoutes.js
import express from "express";
import { getOrderBySessionId } from "../controllers/orderControllers.js";

const router = express.Router();

/**
 * Get order by Stripe sessionId
 * GET /api/orders/session/:sessionId
 */
router.get("/session/:sessionId", getOrderBySessionId);

export default router;
