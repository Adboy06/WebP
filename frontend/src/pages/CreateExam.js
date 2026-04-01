import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./CreateExam.css";

export default function CreateExam() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const resetQuestionFields = () => {
    setQuestion("");
    setOptions({ A: "", B: "", C: "", D: "" });
    setCorrectAnswer("A");
  };

  const addQuestion = () => {
    if (!question.trim()) {
      setStatus({ type: "error", message: "Please add a question text." });
      return;
    }

    const filledOptions = Object.values(options).filter((o) => o.trim());
    if (filledOptions.length < 4) {
      setStatus({ type: "error", message: "All four options are required." });
      return;
    }

    setQuestions((prev) => [
      ...prev,
      {
        question: question.trim(),
        options: {
          A: options.A.trim(),
          B: options.B.trim(),
          C: options.C.trim(),
          D: options.D.trim()
        },
        correctAnswer
      }
    ]);

    resetQuestionFields();
    setStatus({ type: "success", message: "Question added." });
  };

  const removeQuestion = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const generateExamAI = async () => {
    if (!aiTopic.trim()) {
      setStatus({ type: "error", message: "Please provide a topic for AI generation." });
      return;
    }
    if (aiCount < 1 || aiCount > 20) {
      setStatus({ type: "error", message: "Number of questions must be between 1 and 20." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await API.post("/exam/generate", {
        topic: aiTopic.trim(),
        numQuestions: aiCount
      });

      setTitle(res.data.title || `AI Generated: ${aiTopic}`);
      setQuestions(res.data.questions || []);
      setStatus({ type: "success", message: "AI exam generated. Review questions and save." });
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "AI generation failed" });
    } finally {
      setLoading(false);
    }
  };

  const createExam = async () => {
    if (!title.trim()) {
      setStatus({ type: "error", message: "Exam title is required." });
      return;
    }

    if (questions.length === 0) {
      setStatus({ type: "error", message: "Add at least one question before creating." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await API.post("/exam/create", {
        title: title.trim(),
        questions
      });

      setStatus({ type: "success", message: "Exam created successfully!" });
      setTitle("");
      setQuestions([]);
      resetQuestionFields();

      setTimeout(() => navigate("/dashboard"), 700);
    } catch (error) {
      setStatus({ type: "error", message: "Could not create exam. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-exam-container">
      <h2>Create New Exam</h2>

      {status.message && (
        <div className={`status-message ${status.type}`}>{status.message}</div>
      )}

      <div className="exam-form-row">
        <label htmlFor="exam-title">Exam Title</label>
        <input
          id="exam-title"
          className="create-exam-input"
          placeholder="e.g., JavaScript Basics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="exam-form-row" style={{ border: "1px solid #d3d9ef", padding: "12px", borderRadius: "8px", background: "#f9fbff" }}>
        <h3>Generate with AI</h3>
        <label htmlFor="ai-topic">Topic</label>
        <input
          id="ai-topic"
          className="create-exam-input"
          placeholder="e.g., Node.js arrays"
          value={aiTopic}
          onChange={(e) => setAiTopic(e.target.value)}
        />

        <label htmlFor="ai-count">Number of Questions</label>
        <input
          id="ai-count"
          className="create-exam-input"
          type="number"
          min={1}
          max={20}
          value={aiCount}
          onChange={(e) => setAiCount(Number(e.target.value))}
        />

        <button className="btn-secondary" onClick={generateExamAI} disabled={loading}>
          {loading ? "Generating..." : "Generate AI Exam"}
        </button>
      </div>

      <div className="exam-form-row">
        <h3>Question Builder</h3>
        <label htmlFor="question-text">Question</label>
        <textarea
          id="question-text"
          className="create-exam-textarea"
          rows={3}
          value={question}
          placeholder="Type the question here"
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="exam-form-row">
        <label>Answer Options</label>
        <input
          className="create-exam-input"
          placeholder="Option A"
          value={options.A}
          onChange={(e) => setOptions({ ...options, A: e.target.value })}
        />
        <input
          className="create-exam-input"
          placeholder="Option B"
          value={options.B}
          onChange={(e) => setOptions({ ...options, B: e.target.value })}
        />
        <input
          className="create-exam-input"
          placeholder="Option C"
          value={options.C}
          onChange={(e) => setOptions({ ...options, C: e.target.value })}
        />
        <input
          className="create-exam-input"
          placeholder="Option D"
          value={options.D}
          onChange={(e) => setOptions({ ...options, D: e.target.value })}
        />
      </div>

      <div className="exam-form-row">
        <label htmlFor="correct-answer">Correct Answer</label>
        <select
          id="correct-answer"
          className="create-exam-select"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div className="button-row">
        <button
          className="btn-primary"
          disabled={loading}
          onClick={addQuestion}
        >
          Add Question
        </button>
        <span>{questions.length} question(s) added</span>
      </div>

      {questions.length > 0 && (
        <div>
          <h3>Review Questions</h3>
          {questions.map((q, idx) => (
            <div className="question-card" key={`${q.question}-${idx}`}>
              <p>
                <strong>{idx + 1}. </strong>
                {q.question}
              </p>
              <p>• A: {q.options.A}</p>
              <p>• B: {q.options.B}</p>
              <p>• C: {q.options.C}</p>
              <p>• D: {q.options.D}</p>
              <p>
                <strong>Correct:</strong> {q.correctAnswer}
              </p>
              <button
                className="btn-danger"
                onClick={() => removeQuestion(idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="button-row" style={{ marginTop: 16 }}>
        <button
          className="btn-primary"
          disabled={loading || !title.trim() || questions.length === 0}
          onClick={createExam}
        >
          {loading ? "Creating exam..." : "Create Exam"}
        </button>
        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
