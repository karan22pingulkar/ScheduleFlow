import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, CalendarClock, Share2, ArrowRight, Sparkles } from "lucide-react";

const ACTIONS = [
    {
        icon: LayoutDashboard,
        title: "Dashboard",
        desc: "Create, edit and manage all your posts.",
        to: "/dashboard",
    },
    {
        icon: CalendarClock,
        title: "Schedule a Post",
        desc: "Pick a time and let the worker publish it.",
        to: "/schedule-post",
    },
    {
        icon: Share2,
        title: "Social Accounts",
        desc: "Connect the platforms you post to.",
        to: "/social-accounts",
    },
];

export default function Welcome() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center px-6 pt-24 pb-10">
            <div className="w-full max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
                        <Sparkles size={13} /> You&apos;re in
                    </span>
                    <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
                        Where do you want to <span className="text-gradient">flow</span>?
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-gray-400">
                        Everything for your cross-posting workflow, one click away.
                    </p>
                </motion.div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {ACTIONS.map((a, i) => (
                        <motion.button
                            key={a.to}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                            whileHover={{ y: -6 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(a.to)}
                            className="glass group rounded-3xl p-6 text-left transition-colors hover:border-violet-400/30"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-110">
                                <a.icon size={20} />
                            </div>
                            <h3 className="mt-4 font-display text-lg font-semibold text-white">
                                {a.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{a.desc}</p>
                            <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-violet-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                Open <ArrowRight size={13} />
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
