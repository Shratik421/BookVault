import Book from "../models/Book.model.js";
import { genrateToken } from "../lib/generateToken.js";
import { uploadMedia, deleteMediaFromCloduinary } from "../lib/cloudinary.js";
import { bufferToDataURI } from "../lib/datauri.js";

export const createBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, caption, rating } = req.body;
    const file = req.file;
    console.log("file", file);
    if (!title || !caption || !rating)
      return res.status(400).json({ error: "Missing required fields" });

    const fileDataURI = bufferToDataURI(file);
    console.log("fileDataURI", fileDataURI);
    let uploadResponse = await uploadMedia(fileDataURI);
    console.log("uploadResponse", uploadResponse);

    const book = new Book({
      title,
      caption,
      rating,
      image: uploadResponse?.secure_url,
      user: userId,
    });
    await book.save();
    return res.status(201).json({ book });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//pagination infiinte loading
export const getBook = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const skip = 5;
    const limit = req.query.limit || 10;
    const totalBooks = await Book.countDocuments();
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(5)
      .limit(parseInt(limit))
      .populate({ path: "user", select: "username" });
    return res.status(200).json({
      books,
      pagination: {
        skip,
        limit,
        totalBooks,
        totalPage: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getReommedBook = async (req, res) => {
    try {
        const userId = req.user._id;
        const books = await Book.find({ user: userId });
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
