// routes/stripeRoutes.js
import express from "express";
import {
  createCheckoutSession,
  stripeWebhookHandler,
} from "../controllers/stripeController.js";
import bodyParser from "body-parser";

const router = express.Router();

// Normal JSON route
router.post("/create-session", createCheckoutSession);

// Webhook needs raw body parser
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body;
    next();
  },
  stripeWebhookHandler
);

export default router;
