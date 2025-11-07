import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <div className="flex space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                {!token && <Link to="/login" className="hover:underline">Login</Link>}
                {!token && <Link to="/register" className="hover:underline">Register</Link>}
                {token && <Link to="/welcome" className="hover:underline">Welcome</Link>}
                {token && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
                {token && <Link to="/schedule-post" className="hover:underline">Schedule Post</Link>}
                {token && <Link to="/social-accounts" className="hover:underline">Social Accounts</Link>}
            </div>
            {token && (
                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                    Logout
                </button>
            )}
        </nav>
    );
}
