// server/routes/orderRoutes.js
// import express from "express";
// import { getOrderBySessionId } from "../controllers/orderControllers.js";

// const router = express.Router();

// /**
//  * Get order by Stripe sessionId
//  * GET /api/orders/session/:sessionId
//  */
// router.get("/session/:sessionId", getOrderBySessionId);

// export default router;


// server/routes/orderRoutes.js
import express from "express";
import { getOrderBySessionId, getOrdersByUserId } from "../controllers/orderControllers.js";

const router = express.Router();

router.get("/session/:sessionId", getOrderBySessionId);
router.get("/user/:userId", getOrdersByUserId); // NEW

export default router;
