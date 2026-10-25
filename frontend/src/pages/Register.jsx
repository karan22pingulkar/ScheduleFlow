import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Share2, User, Mail, Lock, UserPlus } from "lucide-react";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
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
                `${import.meta.env.VITE_API_BASE_URL}/accounts/register/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) throw new Error("Registration failed");

            toast.success("Account created! Please log in.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error("Registration failed. Try a different username.");
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
                        initial={{ rotate: 12, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-glow-sm"
                    >
                        <Share2 size={24} className="text-white" />
                    </motion.div>
                    <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
                    <p className="mt-1.5 text-sm text-gray-400">
                        Start cross-posting in under a minute
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
                        <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
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
                        <UserPlus size={17} />
                        {loading ? "Creating account..." : "Register"}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-violet-300 transition-colors hover:text-violet-200">
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
