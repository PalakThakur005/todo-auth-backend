import {Book} from "../models/Books.js";

// ADD BOOK

 export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;


    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: "ISBN already exists" });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity,
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// getbooks api

export const getBooks = async(req , res) => {
  try{
const books = await Book.find().sort({ createdAt: -1 });

return res.status(200).json(books)
  }catch(error){
    return res.status(500).json({message:error.message})
  }
}

//delete book

export const deleteBook = async (req, res) => {
  try {
    const removeUser = await Book.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: "Book Deleted Successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}



//update book

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, author, isbn, category, quantity } = req.body;

    //  check book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    //  update fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    book.quantity = quantity || book.quantity;

    await book.save();

    res.status(200).json({message: "Book updated successfully", book});

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


// Pagination
export const pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = (req.query.search || "")
  .toLowerCase()
  .replace(/[-_\s]+/g, "")
  .trim();

   const filter = {
  $or: [
    {
      title: {
        $regex: search.split("").join(".*"),
        $options: "i",
      },
    },
    {
      author: {
        $regex: search.split("").join(".*"),
        $options: "i",
      },
    },
    {
      isbn: {
        $regex: search,
        $options: "i",
      },
    },
  ],
};

    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      page,
      limit,
      total,
      totalPages,
      data: books
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};





//card

export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();

    const totalCopiesData = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: { $sum: "$quantity" }
        }
      }
    ]);

    const totalCopies = totalCopiesData[0]?.totalCopies || 0;

    const availableBooks = await Book.countDocuments({
      quantity: { $gt: 0 }
    });

    const outOfStock = await Book.countDocuments({
      quantity: 0
    });

    return res.status(200).json({
      totalBooks,
      totalCopies,
      availableBooks,
      outOfStock
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};