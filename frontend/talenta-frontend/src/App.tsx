import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/mahasiswa/Dashboard";
import Profile from "./pages/mahasiswa/Profile";
import Skill from "./pages/mahasiswa/Skill";
import Experience from "./pages/mahasiswa/Experience";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPengunjung from "./pages/pengunjung/DashboardPengunjung";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard"; // pastikan file ini ada

const App = () => {
  // Ambil token dari localStorage
  const adminToken = localStorage.getItem("admin_access");
  const studentToken = localStorage.getItem("student_access");

  return (
    <BrowserRouter>
      <Routes>
        {/* Mahasiswa login */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            studentToken ? (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/mahasiswa/profile"
          element={
            studentToken ? (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/mahasiswa/skill"
          element={
            studentToken ? (
              <ProtectedRoute>
                <Skill />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/mahasiswa/experience"
          element={
            studentToken ? (
              <ProtectedRoute>
                <Experience />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={adminToken ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />

        {/* Public pengunjung */}
        <Route path="/pengunjung" element={<DashboardPengunjung />} />
        <Route path="/" element={<Navigate to="/pengunjung" replace />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
