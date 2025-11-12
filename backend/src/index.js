import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import { dbConnect } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
console.log(PORT);

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/books",bookRoutes)
dbConnect();

// ✅ Root route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
