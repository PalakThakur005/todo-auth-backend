import User from "../models/user.js";
import { Book } from "../models/Books.js";
import { Department } from "../models/department.js";
import { Card } from "../models/card.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({role:{$ne:"admin"}});

    const totalDepartments = await Department.countDocuments();

    const totalBooks = await Book.countDocuments();

    const totalCards = await Card.countDocuments();

    res.json({
      users: totalUsers,
      departments: totalDepartments,
      books: totalBooks,
      cards: totalCards
        });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};