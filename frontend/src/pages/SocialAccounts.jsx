import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

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
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAccounts(response.data);
        } catch (error) {
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
                toast.success("Account updated ✅");
            } else {
                await axios.post(API_URL, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Account added ✅");
            }

            setUsername("");
            setAccessToken("");
            setEditId(null);
            fetchAccounts();
        } catch (error) {
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
            toast.success("Deleted ✅");
            fetchAccounts();
        } catch {
            toast.error("Delete failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen  text-white p-6 max-w-xl mx-auto space-y-6">
            <Toaster position="top-right" />

            <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-center">
                Social Accounts 👨🏻‍⚖️
            </motion.h2>

            <motion.form
                onSubmit={createOrUpdateAccount}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <label className="block text-white">Platform</label>
                <select
                    className="w-full border rounded p-2 bg-white text-black"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                >
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                </select>

                <div>
                    <label className="block text-white">Username</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 bg-white text-black"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-white">Access Token</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2 bg-white text-black"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        required
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : editId ? "Update Account" : "Add Account"}
                </motion.button>
            </motion.form>

            <h3 className="text-xl font-semibold">Your Accounts</h3>
            {loading && <p className="text-gray-400">Loading...</p>}

            <ul className="space-y-3">
                {accounts.map((acc) => (
                    <motion.li
                        key={acc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-gray-900 border border-gray-700 rounded flex justify-between items-center"
                    >
                        <span className="capitalize">{acc.platform} - {acc.username}</span>
                        <div className="space-x-3">
                            <button
                                className="text-yellow-400"
                                onClick={() => {
                                    setEditId(acc.id);
                                    setPlatform(acc.platform);
                                    setUsername(acc.username);
                                    setAccessToken(acc.access_token || "");
                                }}
                            >Edit</button>
                            <button className="text-red-500" onClick={() => deleteAccount(acc.id)}>Delete</button>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}
