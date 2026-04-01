import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "";
    setUserName(storedName);

    API.get("/exam")
      .then((res) => setExams(res.data))
      .catch(() => alert("Error loading exams"));
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p>Welcome, <strong>{userName || "Student"}</strong></p>
          <p className="subtext">Take exams, track results, and practice.</p>
        </div>
        <button className="signout-btn" onClick={signOut}>
          Sign Out
        </button>
      </div>

      <h1 className="dashboard-title">Dashboard</h1>

      <button
        className="create-btn"
        onClick={() => navigate("/create-exam")}
      >
        + Create Exam
      </button>

      <h2>Available Exams</h2>

      <table className="exam-table">
        <thead>
          <tr>
            <th>number</th>
            <th>Exam Title</th>
            <th>Best Score</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {exams.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No exams available
              </td>
            </tr>
          ) : (
            exams.map((exam, index) => {
              const best = exam.bestScore;
              const bestDisplay = best
                ? `${best.score}/${best.total} (${best.percentage}%)`
                : "-";

              return (
                <tr key={exam._id}>
                  <td>{index + 1}</td>
                  <td>{exam.title}</td>
                  <td>{bestDisplay}</td>
                  <td>
                    <button
                      className="give-btn"
                      onClick={() => navigate(`/exam/${exam._id}`)}
                    >
                      Give Exam
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
