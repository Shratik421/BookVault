import express from "express";
import {
  createBook,
  deleteBook,
  getBook,
  getReommedBook,
} from "../controller/book.controller.js";
import { isAuth } from "../middleware/isAuth.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/get", isAuth, getBook);
router.get("/getReommedBook", isAuth, getReommedBook);
router.post("/create", isAuth, upload.single("image"), createBook);
router.delete("/delete/:id", isAuth, deleteBook);

export default router;
