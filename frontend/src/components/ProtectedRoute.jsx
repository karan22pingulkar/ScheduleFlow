import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken"); // ✅ Must match your login key
    if (!token) {
        return <Navigate to="/login" />; // redirect to login if not logged in
    }
    return children; // show children if logged in
}