import express from "express";
import {
  createExam,
  getExam,
  submitExam,
  getAllExams,
  generateExamAI
} from "../controllers/examController.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createExam);
router.post("/generate", authMiddleware, generateExamAI);
router.get("/:id", optionalAuthMiddleware, getExam);
router.post("/submit/:id", authMiddleware, submitExam);
router.get("/", optionalAuthMiddleware, getAllExams);

export default router;
