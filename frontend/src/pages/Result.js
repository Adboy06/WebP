import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p className="result-error">No result data available.</p>;
  }

  const { score, total, examId } = state;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 50;

  return (
    <div className="result-container">
      <h2 className="result-title">Exam Results</h2>

      <div className="result-metrics">
        <p>
          <strong>Score:</strong> {score}/{total}
        </p>
        <p className="result-score">{percentage}%</p>
        <div className={`result-badge ${passed ? "pass" : "fail"}`}>
          {passed ? "Passed" : "Needs Improvement"}
        </div>
      </div>

      <div className="button-row">
        {examId && (
          <button
            className="btn-primary"
            onClick={() => navigate(`/exam/${examId}`)}
          >
            Retake Test
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
