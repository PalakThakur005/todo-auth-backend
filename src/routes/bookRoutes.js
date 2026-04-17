import express from "express";
import {
  addBook,
  deleteBook,
  getBooks,
  updateBook,
  pagination,
  getBookStats
} from "../controllers/booksController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ✅ ADMIN ONLY

router.post(
  "/books",
  protect,
  authorizeRoles("admin"),
  addBook
);

router.delete(
  "/delete-book/:id",
  protect,
  authorizeRoles("admin"),
  deleteBook
);

router.put(
  "/update-book/:id",
  protect,
  authorizeRoles("admin"),
  updateBook
);

router.get(
  "/pagination",
  protect,
  authorizeRoles("admin"),
  pagination
);

router.get(
  "/getstats",
  protect,
  authorizeRoles("admin"),
  getBookStats
);


router.get(
  "/books",
  protect,
  getBooks
);

export default router;