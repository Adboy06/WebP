import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./Exam.css";

export default function Exam() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/exam/${id}`)
      .then((res) => {
        setExam(res.data);
        setAnswers(new Array(res.data.questions.length).fill(""));
      })
      .catch(() => setStatus({ type: "error", message: "Error loading exam" }));
  }, [id]);

  const selectAnswer = (index, option) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = option;
      return copy;
    });
    setStatus({ type: "", message: "" });
  };

  const submitExam = async () => {
    if (!exam) return;

    const unanswered = answers.reduce((acc, value, idx) => {
      if (!value) acc.push(idx + 1);
      return acc;
    }, []);

    if (unanswered.length > 0) {
      setStatus({
        type: "error",
        message: `Please answer all questions (unanswered: ${unanswered.join(", ")}).`
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await API.post(`/exam/submit/${id}`, { answers });
      navigate("/result", { state: { ...res.data, examId: id } });
    } catch (error) {
      setStatus({ type: "error", message: "Error submitting exam. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return <p className="exam-loading">Loading exam...</p>;

  return (
    <div className="exam-page-container">
      <h2 className="exam-title">{exam.title}</h2>

      {status.message && (
        <div className={`status-message ${status.type}`}>{status.message}</div>
      )}

      {exam.questions.map((q, i) => (
        <div key={`${i}-${q.question}`} className="exam-question-card">
          <div className="question-header">
            <strong>{i + 1}. {q.question}</strong>
          </div>

          <div className="question-options">
            {Object.entries(q.options).map(([key, value]) => (
              <label key={key} className="option-label">
                <input
                  type="radio"
                  name={`q${i}`}
                  value={key}
                  checked={answers[i] === key}
                  onChange={() => selectAnswer(i, key)}
                />
                <span className="option-letter">{key}</span>
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="button-row" style={{ marginTop: "16px" }}>
        <button
          className="btn-primary"
          onClick={submitExam}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Exam"}
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
