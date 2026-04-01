import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  bestScores: [
    {
      examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
      },
      score: Number,
      total: Number,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

export default mongoose.model("User", userSchema);
