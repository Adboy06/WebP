import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: {
        A: String,
        B: String,
        C: String,
        D: String
      },
      correctAnswer: {
        type: String,
        enum: ["A", "B", "C", "D"]
      }
    }
  ]
});

export default mongoose.model("Exam", examSchema);
