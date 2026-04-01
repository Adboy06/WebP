import express from "express";
import dotenv from "dotenv";
import cors from "cors";   


import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import examRoutes from "./routes/examRoutes.js";


import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());



app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exam", examRoutes);

app.listen(process.env.PORT || 5001, () => {
  console.log(`PORT:${process.env.PORT || 5001}`);
});
