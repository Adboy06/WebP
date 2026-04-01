import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exam from "./pages/Exam";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import CreateExam from "./pages/CreateExam";
function App() {
  return (
    <BrowserRouter>
      
<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/exam/:id" element={<Exam />} />
  <Route path="/result" element={<Result />} />
   <Route path="/create-exam" element={<CreateExam />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
