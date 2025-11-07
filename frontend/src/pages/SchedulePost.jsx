
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function SchedulePost() {
    const [posts, setPosts] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const [logs, setLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);

    const [selectedPost, setSelectedPost] = useState("");
    const [selectedAccount, setSelectedAccount] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");

    // EDIT STATES
    const [editId, setEditId] = useState(null);
    const [editTime, setEditTime] = useState("");

    const accessToken = localStorage.getItem("accessToken");
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchData();
        fetchScheduled();
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

            toast.success("✅ Post Scheduled!");
            setSelectedPost("");
            setSelectedAccount("");
            setScheduleTime("");
            fetchScheduled();
        } catch {
            toast.error("Something went wrong.");
        }
    };

    // OPEN EDIT MODAL
    const openEdit = (item) => {
        setEditId(item.id);
        setEditTime(item.scheduled_time.slice(0, 16));
    };

    // CANCEL EDIT
    const cancelEdit = () => {
        setEditId(null);
        setEditTime("");
    };

    // SAVE UPDATED TIME (PUT FULL DATA — OLD WORKING WAY)
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

            toast.success("✅ Rescheduled!");
            cancelEdit();
            fetchScheduled();
        } catch {
            toast.error("Update failed.");
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}/posts/schedule/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("🗑️ Deleted!");
            fetchScheduled();
        } catch {
            toast.error("Delete failed.");
        }
    };

    return (
        <div className="text-white min-h-screen p-8">
            <Toaster position="top-right" />

            <motion.h1 className="text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Schedule a Post
            </motion.h1>

            {/* FORM */}
            <motion.form onSubmit={handleSchedule} className="space-y-4 max-w-lg bg-gray-900 p-6 rounded-lg shadow-lg mx-auto">
                <select value={selectedPost} onChange={(e) => setSelectedPost(e.target.value)} className="w-full p-2 rounded bg-white text-black">
                    <option value="">Select Post</option>
                    {posts.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.caption?.slice(0, 40) || `Post #${p.id}`}
                        </option>
                    ))}
                </select>

                <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} className="w-full p-2 rounded bg-white text-black">
                    <option value="">Select Social Account</option>
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                            {acc.username} — {acc.platform}
                        </option>
                    ))}
                </select>

                <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full p-2 rounded bg-white text-black" />

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
                    Schedule
                </button>
            </motion.form>

            {/* HEADER */}
            <div className="flex items-center justify-between mt-10 mb-3 max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold">Scheduled Posts</h2>
                <div className="flex gap-2">
                    <button onClick={fetchScheduled} className="px-3 py-1 bg-gray-700 rounded">🔄 Refresh</button>
                    <button onClick={fetchLogs} className="px-3 py-1 bg-purple-700 rounded">📜 Logs</button>
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-2 max-w-lg mx-auto">
                {scheduled.length === 0 && <p>No scheduled posts yet.</p>}

                {scheduled.map((item) => (
                    <div key={item.id} className="bg-gray-800 px-4 py-3 rounded flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{item.post_caption}</p>
                            <p className={item.status === "completed" ? "text-green-400 text-sm" : "text-yellow-400 text-sm"}>
                                {item.status.toUpperCase()}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-400 text-sm mb-2">
                                {new Date(item.scheduled_time).toLocaleString()}
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button onClick={() => openEdit(item)} className="text-blue-400 text-sm">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-400 text-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT MODAL */}
            {editId && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                    <div className="bg-gray-900 p-6 rounded shadow-lg w-80 space-y-3">
                        <h3 className="text-xl font-bold">Edit Schedule</h3>

                        <input type="datetime-local" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full p-2 rounded bg-white text-black" />

                        <div className="flex justify-between">
                            <button onClick={cancelEdit} className="px-3 py-1 bg-gray-700 rounded">Cancel</button>
                            <button onClick={saveEdit} className="px-3 py-1 bg-blue-600 rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* LOG PANEL */}
            {showLogs && (
                <div className="fixed top-0 right-0 w-96 h-full bg-gray-900 shadow-xl p-5 overflow-y-auto">
                    <div className="flex justify-between mb-3">
                        <h2 className="text-xl font-bold">Post Logs</h2>
                        <button onClick={() => setShowLogs(false)} className="text-red-400">✖</button>
                    </div>

                    {logs.length === 0 && <p>No logs available.</p>}

                    {logs.map((log) => (
                        <div key={log.id} className="border-b border-gray-700 py-2">
                            <p className="text-sm">{log.message}</p>
                            <p className="text-xs text-gray-500">{new Date(log.log_time).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



