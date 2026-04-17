import express from "express";
import {
  addDepartment,
  getDepartment,
  toggleStatus,
  updateDepartment,
  pagination,
  getDashboardStats,
} from "../controllers/departmentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/add-dep", 
    protect,
     authorizeRoles("admin"), 
     addDepartment);

router.put(
  "/toggle-status/:id",
  protect,
  authorizeRoles("admin"),
  toggleStatus
);

router.put(
  "/update-dep/:id",
  protect,
  authorizeRoles("admin"),
  updateDepartment
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

router.get("/get-dep", protect, getDepartment);

export default router;