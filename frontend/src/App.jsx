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
import TutorOnboarding from "./pages/TutorOnboarding";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course/:courseName" element={<CoursePage />} />

        <Route path="/island" element={<ProtectedRoute loginPath={'/login'} type={'student'}><StudentIsland /></ProtectedRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute loginPath={'/admin/login'} type={'admin'}><AdminPage /></ProtectedRoute>} />

        <Route path="/tropitutor/login" element={<TutorLogin />} />
        <Route path="/tropitutor" element={<ProtectedRoute loginPath={'/tropitutor/login'} type={'tutor'}><TutorPage /></ProtectedRoute>} /> 
        <Route path="/onboard" element={<TutorOnboarding />} />
      </Routes>
    </Router>
    
  )
}