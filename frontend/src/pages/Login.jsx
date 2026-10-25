import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Zap, User, Lock, LogIn } from "lucide-react";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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

            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 pt-24 pb-10">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-glow"
            >
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ rotate: -12, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-glow-sm"
                    >
                        <Zap size={24} className="text-white" fill="currentColor" />
                    </motion.div>
                    <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
                    <p className="mt-1.5 text-sm text-gray-400">
                        Log in to keep your posts flowing
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className="input-dark pl-11"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="input-dark pl-11"
                            required
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="btn-gradient w-full"
                    >
                        <LogIn size={17} />
                        {loading ? "Logging in..." : "Login"}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-medium text-violet-300 transition-colors hover:text-violet-200">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
