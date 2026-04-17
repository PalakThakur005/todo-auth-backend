import express from "express";
import {
  getCards,
  issueCard,
  updateCardExpiry,
  pagination,
  getDashboardStats
} from "../controllers/cardController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ✅ ADMIN ONLY ROUTES

router.post(
  "/issuecard",
  protect,
  authorizeRoles("admin"),
  issueCard
);

router.get(
  "/cards",
  protect,
  authorizeRoles("admin"),
  getCards
);

router.put(
  "/update-card/:id",
  protect,
  authorizeRoles("admin"),
  updateCardExpiry
);

router.get(
  "/pagination",
  protect,
  authorizeRoles("admin"),
  pagination
);

router.get(
  "/statscard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

export default router;