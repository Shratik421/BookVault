import Book from "../models/Book.model.js";
import { genrateToken } from "../lib/generateToken.js";
import { uploadMedia, deleteMediaFromCloduinary } from "../lib/cloudinary.js";
// import { bufferToDataURI } from "../lib/datauri.js";

export const createBook = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("req.body in createBook:", req.body);
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // image = data:image/jpeg;base64,....
    const uploadResponse = await uploadMedia(image);

    const book = new Book({
      title,
      caption,
      rating,
      image: uploadResponse.secure_url,
      user: userId,
    });

    await book.save();

    return res.status(201).json({ book });
  } catch (error) {
    console.log("createBook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


//pagination infiinte loading
export const getBook = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "user", select: "username profileImage" });

    const totalBooks = await Book.countDocuments();

    return res.status(200).json({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get recommended books by the logged in user
export const getReommedBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const books = await Book.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ books });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export const deleteBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.id;
    if (!bookId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const bookexists = await Book.find({ bookId, user: userId });
    if (!bookexists) {
      return res.status(404).json({ error: "Book not found or not authorized" });
    }

    if (bookexists._id) {
      await deleteMediaFromCloduinary(bookexists.image);
    }

    const book = await Book.findByIdAndDelete();
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("error : ", error);
    return res.json({ error: "Internal server error" });
  }
};
