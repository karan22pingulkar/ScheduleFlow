import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarClock,
    RefreshCw,
    ScrollText,
    X,
    CheckCircle2,
    Clock3,
    AlertCircle,
    Send,
    Pencil,
    Trash2,
    FileText,
    Link2,
} from "lucide-react";

const STATUS_STYLE = {
    completed: { icon: CheckCircle2, cls: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20" },
    success: { icon: CheckCircle2, cls: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20" },
    pending: { icon: Clock3, cls: "text-amber-300 bg-amber-500/10 border-amber-400/20" },
    failed: { icon: AlertCircle, cls: "text-red-300 bg-red-500/10 border-red-400/20" },
};

export default function SchedulePost() {
    const [posts, setPosts] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const [logs, setLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);

    const [selectedPost, setSelectedPost] = useState("");
    const [selectedAccount, setSelectedAccount] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");

    const [editId, setEditId] = useState(null);
    const [editTime, setEditTime] = useState("");

    const accessToken = localStorage.getItem("accessToken");
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchData();
        fetchScheduled();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const postRes = await fetch(`${BASE_URL}/posts/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const accRes = await fetch(`${BASE_URL}/accounts/social-accounts/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setPosts(await postRes.json());
            setAccounts(await accRes.json());
        } catch {
            toast.error("Failed to load posts or accounts.");
        }
    };

    const fetchScheduled = async () => {
        try {
            const res = await fetch(`${BASE_URL}/posts/schedule/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setScheduled(await res.json());
        } catch {
            toast.error("Failed to load scheduled posts.");
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${BASE_URL}/posts/logs/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setLogs(await res.json());
            setShowLogs(true);
        } catch {
            toast.error("Failed to fetch logs.");
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (!selectedPost || !selectedAccount || !scheduleTime) {
            toast.error("All fields are required.");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/posts/schedule/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    post: selectedPost,
                    account: selectedAccount,
                    scheduled_time: scheduleTime,
                }),
            });

            if (!res.ok) throw new Error();

            toast.success("Post scheduled!");
            setSelectedPost("");
            setSelectedAccount("");
            setScheduleTime("");
            fetchScheduled();
        } catch {
            toast.error("Something went wrong.");
        }
    };

    const openEdit = (item) => {
        setEditId(item.id);
        setEditTime(item.scheduled_time.slice(0, 16));
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditTime("");
    };

    const saveEdit = async () => {
        if (!editTime) return toast.error("Select a valid time");

        try {
            const item = scheduled.find((s) => s.id === editId);

            await fetch(`${BASE_URL}/posts/schedule/${editId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    post: item.post,
                    account: item.account,
                    scheduled_time: editTime,
                }),
            });

            toast.success("Rescheduled!");
            cancelEdit();
            fetchScheduled();
        } catch {
            toast.error("Update failed.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}/posts/schedule/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Deleted!");
            fetchScheduled();
        } catch {
            toast.error("Delete failed.");
        }
    };

    return (
        <div className="min-h-screen px-6 pt-28 pb-20">
            <div className="mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-glow-sm">
                        <CalendarClock size={26} className="text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-white">Schedule a Post</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Pick a post, choose an account, set the time — we handle the rest.
                    </p>
                </motion.div>

                {/* ---------- FORM ---------- */}
                <motion.form
                    onSubmit={handleSchedule}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass mt-8 space-y-4 rounded-3xl p-6"
                >
                    <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                            <FileText size={13} /> Post
                        </span>
                        <select
                            value={selectedPost}
                            onChange={(e) => setSelectedPost(e.target.value)}
                            className="input-dark"
                        >
                            <option value="">Select a post</option>
                            {posts.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.caption?.slice(0, 50) || `Post #${p.id}`}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                            <Link2 size={13} /> Social account
                        </span>
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="input-dark"
                        >
                            <option value="">Select a social account</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.username} — {acc.platform}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                            <Clock3 size={13} /> Publish time
                        </span>
                        <input
                            type="datetime-local"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="input-dark [color-scheme:dark]"
                        />
                    </label>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-gradient w-full"
                    >
                        <Send size={16} /> Schedule
                    </motion.button>
                </motion.form>

                {/* ---------- LIST ---------- */}
                <div className="mt-10 flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-white">Scheduled Posts</h2>
                    <div className="flex gap-2">
                        <button onClick={fetchScheduled} className="btn-ghost !px-3 !py-1.5 text-xs">
                            <RefreshCw size={13} /> Refresh
                        </button>
                        <button onClick={fetchLogs} className="btn-ghost !px-3 !py-1.5 text-xs">
                            <ScrollText size={13} /> Logs
                        </button>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {scheduled.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass rounded-3xl py-12 text-center text-gray-400"
                        >
                            <CalendarClock size={32} className="mx-auto mb-3 text-gray-600" />
                            No scheduled posts yet.
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {scheduled.map((item, i) => {
                            const st = STATUS_STYLE[item.status] || STATUS_STYLE.pending;
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                                    className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-100">
                                            {item.post_caption}
                                        </p>
                                        <span
                                            className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${st.cls}`}
                                        >
                                            <st.icon size={11} />
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-xs text-gray-400">
                                            {new Date(item.scheduled_time).toLocaleString()}
                                        </p>
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-indigo-300 transition-colors hover:bg-indigo-500/15"
                                                title="Edit"
                                            >
                                                <Pencil size={13} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-red-300 transition-colors hover:bg-red-500/15"
                                                title="Delete"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* ---------- EDIT MODAL ---------- */}
            <AnimatePresence>
                {editId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
                        onClick={cancelEdit}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-strong w-full max-w-sm space-y-4 rounded-3xl p-7"
                        >
                            <h3 className="font-display text-lg font-bold text-white">Reschedule post</h3>
                            <input
                                type="datetime-local"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                className="input-dark [color-scheme:dark]"
                            />
                            <div className="flex justify-end gap-3">
                                <button onClick={cancelEdit} className="btn-ghost">Cancel</button>
                                <button onClick={saveEdit} className="btn-gradient">Save</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---------- LOGS DRAWER ---------- */}
            <AnimatePresence>
                {showLogs && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowLogs(false)}
                        />
                        <motion.aside
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto border-l border-white/10 bg-[#0b0c1d]/95 p-6 backdrop-blur-xl"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                                    <ScrollText size={18} className="text-violet-300" /> Post Logs
                                </h2>
                                <button
                                    onClick={() => setShowLogs(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {logs.length === 0 && (
                                <p className="text-sm text-gray-500">No logs available.</p>
                            )}

                            {logs.map((log, i) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="border-b border-white/[0.07] py-3"
                                >
                                    <p className="text-sm text-gray-200">{log.message}</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {new Date(log.log_time).toLocaleString()}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
