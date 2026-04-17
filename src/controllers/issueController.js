import { Issue } from "../models/issue.js";
import User from "../models/user.js";
import { Book } from "../models/Books.js";
import { sendEmail } from "../utils/sendEmail.js";
import { issuedBookEmail  , bookReturnedEmail , issueUpdatedEmail} from "../services/mail.js";


// ================= ISSUE BOOK =================
export const issueBook = async (req, res) => {
  try {
    const { userId, bookId, returnDate } = req.body;

    // ✅ Check user
    const user = await User.findById(userId).populate("department");
    if (!user || user.status !== "active") {
      return res.status(400).json({ message: "User not active" });
    }

    // ✅ Check book
    const book = await Book.findById(bookId);
    if (!book || book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }



    // ✅ Prevent duplicate issue
    const alreadyIssued = await Issue.findOne({
      user: userId,
      book: bookId,
      status: "issued",
    });

    if (alreadyIssued) {
      return res.status(400).json({
        message: "Book already issued to this user",
      });
    }

    // ✅ Limit (max 3 books)
    const count = await Issue.countDocuments({
      user: userId,
      status: "issued",
    });

    if (count >= 3) {
      return res.status(400).json({
        message: "User reached max limit (3 books)",
      });
    }

    // ✅ Create issue
    const issue = await Issue.create({
  user: user._id,
  book: bookId,
  returnDate,
  department: user.department._id   
});

    //  Reduce book quantity
    book.quantity -= 1;
    await book.save();



    //  Send Email


    const issuedBookHtml = issuedBookEmail(user, book, issue);

await sendEmail({
  to: user.email,
  subject: "📚 Book Issued Successfully",
  html: issuedBookHtml,
});
    await sendEmail({
      to: user.email,
      subject: "📚 Book Issued Successfully",
      html: issuedBookHtml,
    });

    res.status(201).json({
      message: "Book issued successfully",
      issue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get 

export const getIssue = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate({
        path: "user",
        select: "name email role department",
        populate: {
          path: "department",
          select: "name"
        }
      })
      .populate("book", "title isbn")
      .sort({ createdAt: -1 });
    return res.status(200).json(issues)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}


// ================= RETURN BOOK =================
export const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("book")
      .populate("user")

    if (!issue) {
      return res.status(404).json({ message: "Record not found" });
    }

    //  Prevent double return
    if (issue.status === "returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    const today = new Date();
    let fine = 0;

    //  Fine calculation (₹10/day)
    if (today > issue.returnDate) {
      const lateDays = Math.ceil(
        (today - issue.returnDate) / (1000 * 60 * 60 * 24)
      );
      fine = lateDays * 10;
    }

    issue.status = "returned";
    issue.returnDate = today;
    issue.fine = fine;

    await issue.save();

    //  Increase book quantity
    const book = await Book.findById(issue.book._id);

if (book) {
  book.quantity += 1;
  await book.save();
}

    //  Send Email
   await sendEmail({
  to: issue.user.email,
  subject: "📘 Book Returned Successfully",
  html: bookReturnedEmail(
    issue.user.name,
    issue.book.title,
    new Date().toLocaleDateString("en-IN"),
    fine
  ),
});
    res.json({
      message: "Book returned successfully",
      fine,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= GET ISSUED BOOKS =================
export const getIssuedBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const role = req.query.role || "all";
    const status = req.query.status || "";

    // 🔍 Search filter (name + email + book)
    let matchStage = {
      $or: [
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } },
        { "book.title": { $regex: search, $options: "i" } },
      ],
    };

    if (role !== "all") {
      matchStage["user.role"] = role;
    }

    if (status) {
      matchStage["status"] = status;
    }

    const data = await Issue.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
  $lookup: {
    from: "departments",
    localField: "user.department",
    foreignField: "_id",
    as: "user.department",
  },
},
{
  $unwind: {
    path: "$user.department",
    preserveNullAndEmptyArrays: true,
  },
},

      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },

      { $match: matchStage },

      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Issue.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
  $lookup: {
    from: "departments",
    localField: "user.department",
    foreignField: "_id",
    as: "user.department",
  },
},
{
  $unwind: {
    path: "$user.department",
    preserveNullAndEmptyArrays: true,
  },
},


      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },

      { $match: matchStage },
      
      {
  $addFields: {
    isOverdue: {
      $cond: [
        {
          $and: [
            { $eq: ["$status", "issued"] },
            { $lt: ["$returnDate", new Date()] }
          ]
        },
        true,
        false
      ]
    }
  }
},

      { $count: "total" },
    ]);

    res.json({
      data,
      page,
      totalPages: Math.ceil((total[0]?.total || 0) / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE ISSUE =================
export const updateIssue = async (req, res) => {
  try {
    const { returnDate } = req.body || {};

    if (!returnDate) {
      return res.status(400).json({
        message: "Return date is required",
      });
    }

    const issue = await Issue.findById(req.params.id)
      .populate("user")
      .populate("book");

    if (!issue) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (issue.status === "returned") {
      return res.status(400).json({
        message: "Cannot update returned book",
      });
    }

    if (issue.user.status === "inactive") {
      return res.status(400).json({
        message: "User is inactive",
      });
    }

    const oldReturnDate = issue.returnDate;

    issue.returnDate = new Date(returnDate);
    await issue.save();

    // 📩 EMAIL
    try {
      await sendEmail({
        to: issue.user.email,
        subject: "📅 Return Date Updated",
        html: issueUpdatedEmail(
          issue.user?.name,
          issue.book?.title,
          new Date(oldReturnDate).toLocaleDateString("en-IN"),
          new Date(returnDate).toLocaleDateString("en-IN")
        ),
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    return res.json({
      message: "Updated successfully",
      issue,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



//card



export const getIssueStats = async (req, res) => {
  try {
    const today = new Date();

    const totalIssued = await Issue.countDocuments();
    const returned = await Issue.countDocuments({
      status: "returned",
    });

    const issued = await Issue.countDocuments({
      status: "issued",
    });
    const activeIssues = await Issue.find({
      status: "issued",
    });

    const overdue = activeIssues.filter((item) => {
      return item.returnDate && new Date(item.returnDate) < today;
    }).length;




    return res.status(200).json({
      totalIssued,
      issued,
      returned,
      overdue
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};





//   particular user see only book that issue

export const getMyIssuedBooks = async (req, res) => {
  try {
    const userId = req.user.id; //  from token (auth middleware)

    const issuedBooks = await Issue.find({ user: userId })
      .populate("book", "title author isbn")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

      const today = new Date();

    // ✅ ADD DYNAMIC OVERDUE LOGIC
    const updatedBooks = issuedBooks.map((item) => {
      const isOverdue =
        item.status === "issued" &&
        item.returnDate &&
        new Date(item.returnDate) < today;

      return {
        ...item._doc,
        status: isOverdue ? "overdue" : item.status,
      };
    });
    res.status(200).json(updatedBooks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};