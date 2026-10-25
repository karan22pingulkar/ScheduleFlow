import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Zap,
    CalendarClock,
    Share2,
    FileText,
    ArrowRight,
    Sparkles,
    LayoutDashboard,
    Clock,
    Send,
    BarChart3,
} from "lucide-react";
import { PLATFORM_META } from "../utils/platforms";

const PLATFORMS = Object.values(PLATFORM_META);

const FEATURES = [
    {
        icon: Share2,
        title: "Cross-post everywhere",
        desc: "Write once and fan out to Instagram, LinkedIn, Twitter, Facebook and more from a single dashboard.",
    },
    {
        icon: CalendarClock,
        title: "Smart scheduling",
        desc: "Queue posts for the perfect moment. Celery-powered workers publish right on time.",
    },
    {
        icon: BarChart3,
        title: "Publish logs",
        desc: "Every scheduled run is tracked. See exactly what went out, when, and where.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
    }),
};

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    return (
        <div className="relative min-h-screen pt-28 pb-16 px-6">
            <div className="mx-auto max-w-6xl">
                {/* ---------- HERO ---------- */}
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            custom={0}
                            className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300"
                        >
                            <Sparkles size={13} />
                            Social cross-posting, simplified
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            custom={1}
                            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
                        >
                            Post once.
                            <br />
                            <span className="text-gradient animate-gradient bg-[length:200%_200%]">
                                Publish everywhere.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            custom={2}
                            className="mt-6 max-w-md text-lg leading-relaxed text-gray-400"
                        >
                            ScheduleFlow lets you compose a single post and broadcast it
                            across every connected social account — scheduled, logged, and
                            handled by background workers while you sleep.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            custom={3}
                            className="mt-8 flex flex-wrap items-center gap-4"
                        >
                            {token ? (
                                <button onClick={() => navigate("/dashboard")} className="btn-gradient">
                                    <LayoutDashboard size={18} />
                                    Open Dashboard
                                    <ArrowRight size={16} />
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => navigate("/register")} className="btn-gradient">
                                        Get started free
                                        <ArrowRight size={16} />
                                    </button>
                                    <button onClick={() => navigate("/login")} className="btn-ghost">
                                        Login
                                    </button>
                                </>
                            )}
                        </motion.div>

                        {/* platform pills */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            custom={4}
                            className="mt-10 flex flex-wrap items-center gap-3"
                        >
                            {PLATFORMS.slice(0, 6).map((p) => (
                                <div
                                    key={p.label}
                                    className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-gray-300"
                                >
                                    <p.icon size={13} className={p.text} />
                                    {p.label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ---------- HERO VISUAL ---------- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="relative mx-auto hidden w-full max-w-md sm:block"
                    >
                        {/* compose card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="glass-strong relative z-10 rounded-3xl p-6 shadow-glow"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
                                <div>
                                    <p className="text-sm font-semibold text-white">@you</p>
                                    <p className="text-xs text-gray-400">Draft • all platforms</p>
                                </div>
                                <Send size={16} className="ml-auto text-violet-300" />
                            </div>
                            <p className="mt-4 rounded-2xl bg-white/[0.05] p-4 text-sm text-gray-200">
                                Launching something new today — stay tuned ✨
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {PLATFORMS.slice(0, 4).map((p) => (
                                        <span
                                            key={p.label}
                                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#12121f] bg-gradient-to-br ${p.gradient}`}
                                        >
                                            <p.icon size={12} className="text-white" />
                                        </span>
                                    ))}
                                </div>
                                <span className="flex items-center gap-1.5 text-xs text-violet-300">
                                    <Clock size={13} /> Scheduled 9:30 AM
                                </span>
                            </div>
                        </motion.div>

                        {/* orbiting platform chips */}
                        {PLATFORMS.slice(0, 4).map((p, i) => (
                            <motion.div
                                key={p.label}
                                className={`absolute z-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} shadow-lg`}
                                style={{
                                    top: ["-12%", "78%", "-8%", "70%"][i],
                                    left: ["-8%", "-12%", "88%", "92%"][i],
                                }}
                                animate={{ y: [0, -16, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
                                transition={{
                                    duration: 5 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.5,
                                }}
                            >
                                <p.icon size={20} className="text-white" />
                            </motion.div>
                        ))}

                        {/* glow behind card */}
                        <div className="absolute inset-8 -z-0 rounded-full bg-violet-600/30 blur-[80px]" />
                    </motion.div>
                </div>

                {/* ---------- HOW IT WORKS ---------- */}
                <div className="mt-28 grid gap-4 sm:grid-cols-3">
                    {[
                        { icon: FileText, step: "01", title: "Compose", desc: "Write your post once, attach an image." },
                        { icon: CalendarClock, step: "02", title: "Schedule", desc: "Pick platforms and a publish time." },
                        { icon: Zap, step: "03", title: "Auto-publish", desc: "Workers fire on schedule and log results." },
                    ].map((s, i) => (
                        <motion.div
                            key={s.step}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                            custom={i}
                            className="glass relative overflow-hidden rounded-3xl p-6"
                        >
                            <span className="absolute -top-3 right-4 font-display text-6xl font-bold text-white/[0.05]">
                                {s.step}
                            </span>
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 text-violet-300">
                                <s.icon size={20} />
                            </div>
                            <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ---------- FEATURES ---------- */}
                <div className="mt-20 grid gap-4 md:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                            custom={i}
                            whileHover={{ y: -6 }}
                            className="glass group rounded-3xl p-6 transition-colors hover:border-violet-400/30"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-110">
                                <f.icon size={20} />
                            </div>
                            <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ---------- CTA ---------- */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="glass-strong relative mt-24 overflow-hidden rounded-3xl p-10 text-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-fuchsia-600/10 to-cyan-500/10" />
                    <div className="relative">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                            Ready to flow <span className="text-gradient">everywhere</span>?
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-gray-400">
                            Connect your accounts and let the scheduler handle the rest.
                        </p>
                        <button
                            onClick={() => navigate(token ? "/dashboard" : "/register")}
                            className="btn-gradient mt-7"
                        >
                            {token ? "Go to Dashboard" : "Create your account"}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>

                <p className="mt-14 text-center text-xs text-gray-600">
                    ScheduleFlow — a social cross-posting proof of concept • Django REST + Celery + React
                </p>
            </div>
        </div>
    );
}
