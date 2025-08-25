import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentIsland from "./pages/StudentIsland";
import CoursePage from "./pages/CoursePage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import TutorLogin from "./pages/TutorLogin";
import TutorPage from "./pages/TutorPage";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/island" element={<StudentIsland />} />
        <Route path="/course/:courseName" element={<CoursePage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute loginPath={'/admin/login'}><AdminPage /></ProtectedRoute>} />

        <Route path="/tropitutor/login" element={<TutorLogin />} />
        <Route path="/tropitutor" element={<ProtectedRoute loginPath={'/tropitutor/login'}><TutorPage /></ProtectedRoute>} />
      </Routes>
    </Router>
    
  )
}