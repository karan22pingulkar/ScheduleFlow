import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, LayoutDashboard, CalendarClock, Share2, Home, LogOut, Menu, X, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setOpen(false);
        navigate("/login");
    };

    const links = token
        ? [
            { to: "/", label: "Home", icon: Home },
            { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { to: "/schedule-post", label: "Schedule", icon: CalendarClock },
            { to: "/social-accounts", label: "Accounts", icon: Share2 },
        ]
        : [
            { to: "/login", label: "Login", icon: LogIn },
            { to: "/register", label: "Register", icon: UserPlus },
        ];

    return (
        <motion.header
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 inset-x-0 z-40"
        >
            <nav className="mx-4 mt-4 flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#0b0c1d]/70 px-4 py-3 backdrop-blur-xl sm:mx-auto sm:px-6">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-glow-sm">
                        <Zap size={18} className="text-white" fill="currentColor" />
                    </span>
                    <span className="font-display text-lg font-bold tracking-tight text-white">
                        Schedule<span className="text-gradient">Flow</span>
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-1 md:flex">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                                }`
                            }
                        >
                            <Icon size={15} />
                            {label}
                        </NavLink>
                    ))}
                    {token && (
                        <button
                            onClick={handleLogout}
                            className="ml-2 flex items-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-300 transition-all hover:bg-red-500/20"
                        >
                            <LogOut size={15} />
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-gray-200 md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mx-4 mt-2 rounded-2xl border border-white/10 bg-[#0b0c1d]/95 p-3 backdrop-blur-xl md:hidden"
                    >
                        {links.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${isActive
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={16} />
                                {label}
                            </NavLink>
                        ))}
                        {token && (
                            <button
                                onClick={handleLogout}
                                className="mt-1 flex w-full items-center gap-2.5 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
