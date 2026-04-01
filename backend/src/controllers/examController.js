import Exam from "../models/Exam.js";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error creating exam" });
  }
};

export const generateExamAI = async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate ${numQuestions} multiple-choice questions about ${topic}.
Return only valid JSON with this exact structure: { "title": "string", "questions": [{ "question": "string", "options": { "A": "string", "B": "string", "C": "string", "D": "string" }, "correctAnswer": "A|B|C|D" }] }. Do not include any additional text, code blocks, or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textOutput = response.text().trim();

    // Clean the response: remove code block markers if present
    if (textOutput.startsWith('```json')) {
      textOutput = textOutput.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (textOutput.startsWith('```')) {
      textOutput = textOutput.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let data;
    try {
      data = JSON.parse(textOutput);
    } catch (err) {
      return res.status(500).json({ message: "Gemini returned invalid JSON", output: textOutput });
    }

    // Validate the structure
    if (!data.title || typeof data.title !== 'string' || !Array.isArray(data.questions)) {
      return res.status(500).json({ message: "AI response is malformed: missing or invalid title/questions", output: data });
    }

    // Validate each question
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      if (!q.question || typeof q.question !== 'string' ||
          !q.options || typeof q.options !== 'object' ||
          !q.options.A || !q.options.B || !q.options.C || !q.options.D ||
          !q.correctAnswer || !['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
        return res.status(500).json({ message: `Question ${i + 1} is malformed`, output: data });
      }
    }

    res.json(data);
  } catch (error) {
    console.error("AI generate error", error);
    res.status(500).json({ message: "Error generating exam AI" });
  }
};


export const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    res.json(exam);
  } catch (error) {
    res.status(404).json({ message: "Exam not found" });
  }
};


export const submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;
    exam.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score++;
      }
    });

    res.json({ score, total: exam.questions.length });

    // Save/update per-user best score
    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        const current = user.bestScores.find((el) =>
          el.examId.equals(exam._id)
        );

        if (!current || score > current.score) {
          if (current) {
            current.score = score;
            current.total = exam.questions.length;
            current.updatedAt = new Date();
          } else {
            user.bestScores.push({
              examId: exam._id,
              score,
              total: exam.questions.length
            });
          }
          await user.save();
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error submitting exam" });
  }
};

// for dashboard
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().select("title").lean();

    let userScores = {};
    if (req.user?.id) {
      const user = await User.findById(req.user.id).select("bestScores").lean();
      if (user?.bestScores) {
        user.bestScores.forEach((item) => {
          userScores[item.examId.toString()] = {
            score: item.score,
            total: item.total,
            percentage: item.total > 0 ? Math.round((item.score / item.total) * 100) : 0
          };
        });
      }
    }

    const mapped = exams.map((exam) => {
      const score = userScores[exam._id.toString()] ?? null;
      return {
        ...exam,
        bestScore: score
      };
    });

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams" });
  }
};
