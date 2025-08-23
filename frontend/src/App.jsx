import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentIsland from "./pages/StudentIsland";
import CoursePage from "./pages/CoursePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/island" element={<StudentIsland />} />
        <Route path="/course/:courseName" element={<CoursePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
    
  )
}