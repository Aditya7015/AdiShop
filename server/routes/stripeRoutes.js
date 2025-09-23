// routes/stripeRoutes.js
import express from "express";
import { createCheckoutSession, stripeWebhookHandler } from "../controllers/stripeController.js";
import bodyParser from "body-parser";

const router = express.Router();

// JSON endpoint for creating the session
router.post("/create-session", bodyParser.json(), createCheckoutSession);

// Webhook — raw body required
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // must be raw
  (req, res, next) => {
    req.rawBody = req.body; // stripeWebhookHandler expects req.rawBody
    next();
  },
  stripeWebhookHandler
);

export default router;
