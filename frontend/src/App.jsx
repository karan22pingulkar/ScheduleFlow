import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SocialAccounts from "./pages/SocialAccounts";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import SchedulePost from "./pages/SchedulePost";
import Home from "./pages/Home";
import Background from "./components/Background";

export default function App() {
  return (
    <Router>
      <Background />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(18, 18, 31, 0.92)",
            color: "#e5e7eb",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            fontSize: "14px",
          },
        }}
      />

      {/* Navbar will always be visible */}
      <Navbar />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-accounts"
          element={
            <ProtectedRoute>
              <SocialAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-post"
          element={
            <ProtectedRoute>
              <SchedulePost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
