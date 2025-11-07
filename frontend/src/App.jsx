import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";   // ✅ Add this line
import Login from "./pages/Login";         // (If you have one)
import Dashboard from "./pages/Dashboard";
import SocialAccounts from "./pages/SocialAccounts";        // ✅ create this file
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import SchedulePost from "./pages/SchedulePost";



export default function App() {
  return (
    <Router>
      {/* Navbar will always be visible */}
      <Navbar />


      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<Register />} />   {/* ✅ Register route */}
        <Route path="/login" element={<Login />} />




        {/*  Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected Routes */}
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


