import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Share2, Pencil, Trash2, Plus, KeyRound, AtSign, Link2 } from "lucide-react";
import { getPlatformMeta, PLATFORM_META } from "../utils/platforms";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/accounts/social-accounts/`;

export default function SocialAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [platform, setPlatform] = useState("instagram");
    const [username, setUsername] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAccounts(response.data);
        } catch {
            toast.error("Failed to load accounts");
        }
        setLoading(false);
    };

    const createOrUpdateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = { platform, username, access_token: accessToken };

        try {
            if (editId) {
                await axios.patch(`${API_URL}${editId}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Account updated");
            } else {
                await axios.post(API_URL, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Account added");
            }

            setUsername("");
            setAccessToken("");
            setEditId(null);
            fetchAccounts();
        } catch {
            toast.error("Error saving account");
        }
        setLoading(false);
    };

    const deleteAccount = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${API_URL}${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Deleted");
            fetchAccounts();
        } catch {
            toast.error("Delete failed");
        }
        setLoading(false);
    };

    const SelectedIcon = getPlatformMeta(platform).icon;

    return (
        <div className="min-h-screen px-6 pt-28 pb-20">
            <div className="mx-auto max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-glow-sm">
                        <Share2 size={26} className="text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-white">Social Accounts</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Connect the platforms your posts will flow to.
                    </p>
                </motion.div>

                {/* ---------- FORM ---------- */}
                <motion.form
                    onSubmit={createOrUpdateAccount}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass mt-8 space-y-4 rounded-3xl p-6"
                >
                    <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                            <Link2 size={13} /> Platform
                        </span>
                        <div className="relative">
                            <SelectedIcon
                                size={16}
                                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${getPlatformMeta(platform).text}`}
                            />
                            <select
                                className="input-dark pl-11 capitalize"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            >
                                {Object.keys(PLATFORM_META).slice(0, 4).map((key) => (
                                    <option key={key} value={key}>
                                        {PLATFORM_META[key].label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>

                    <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                            <AtSign size={13} /> Username
                        </span>
                        <input
                            type="text"
                            placeholder="@yourhandle"
                            className="input-dark"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                            <KeyRound size={13} /> Access token
                        </span>
                        <input
                            type="text"
                            placeholder="Paste token (POC — any value works)"
                            className="input-dark"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            required
                        />
                    </label>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="btn-gradient w-full"
                    >
                        <Plus size={16} />
                        {loading ? "Saving..." : editId ? "Update Account" : "Add Account"}
                    </motion.button>
                </motion.form>

                {/* ---------- ACCOUNTS LIST ---------- */}
                <h2 className="mt-10 font-display text-xl font-semibold text-white">Your Accounts</h2>
                {loading && <p className="mt-3 text-sm text-gray-500">Loading...</p>}

                <div className="mt-4 space-y-3">
                    {!loading && accounts.length === 0 && (
                        <div className="glass rounded-3xl py-12 text-center text-gray-400">
                            <Share2 size={30} className="mx-auto mb-3 text-gray-600" />
                            No accounts connected yet.
                        </div>
                    )}

                    <AnimatePresence>
                        {accounts.map((acc, i) => {
                            const meta = getPlatformMeta(acc.platform);
                            return (
                                <motion.div
                                    key={acc.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                                    className="glass flex items-center justify-between rounded-2xl px-5 py-4"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <span
                                            className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-glow-sm`}
                                        >
                                            <meta.icon size={18} className="text-white" />
                                        </span>
                                        <div>
                                            <p className="font-medium capitalize text-gray-100">
                                                {meta.label}
                                            </p>
                                            <p className="text-xs text-gray-500">@{acc.username}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="flex h-8 w-8 items-center justify-center rounded-xl text-amber-300 transition-colors hover:bg-amber-500/15"
                                            title="Edit"
                                            onClick={() => {
                                                setEditId(acc.id);
                                                setPlatform(acc.platform);
                                                setUsername(acc.username);
                                                setAccessToken(acc.access_token || "");
                                            }}
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            className="flex h-8 w-8 items-center justify-center rounded-xl text-red-300 transition-colors hover:bg-red-500/15"
                                            title="Delete"
                                            onClick={() => deleteAccount(acc.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
