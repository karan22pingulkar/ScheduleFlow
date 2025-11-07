import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/accounts/login/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) throw new Error("Invalid credentials");

            const data = await response.json();
            console.log("Login success:", data);

            // ✅ Store JWT tokens
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            alert("Login successful!");
            navigate("/dashboard"); // redirect to dashboard
        } catch (err) {
            console.error(err);
            setError("Invalid username or password");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded p-2 text-black"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded p-2 text-black"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

                <p className="text-center text-sm">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}
