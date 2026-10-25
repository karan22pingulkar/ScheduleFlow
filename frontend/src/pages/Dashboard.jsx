import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    RefreshCw,
    FileText,
    ImageIcon,
    X,
    Send,
    LogOut,
} from "lucide-react";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState("");
    const [searchId, setSearchId] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const [newCaption, setNewCaption] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const token = localStorage.getItem("accessToken");

    // Fetch user profile
    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BASE}/accounts/profile/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch profile");

                const data = await res.json();
                setUser({ ...data, username: data.user?.username });
            } catch (err) {
                console.error(err);
                setError("Could not fetch profile");
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [token]);

    // Fetch posts
    const loadPosts = async () => {
        setLoadingPosts(true);
        setError("");
        try {
            const res = await fetch(`${BASE}/posts/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

            const data = await res.json();
            setPosts(data);
            setFilteredPosts(data);
        } catch (err) {
            console.error(err);
            setError(`Could not fetch posts: ${err.message}`);
        } finally {
            setLoadingPosts(false);
        }
    };

    // Auto-load posts once the profile resolves
    useEffect(() => {
        if (token) loadPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Search posts by ID
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchId(value);
        if (value === "") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(posts.filter((p) => p.id.toString().includes(value)));
        }
    };

    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setNewCaption("");
        setNewImage(null);
        setImagePreview(null);
    };

    // Add new post
    const handleAddPost = async (e) => {
        e.preventDefault();
        if (!newCaption) return toast.error("Caption is required");

        try {
            const formData = new FormData();
            formData.append("caption", newCaption);
            if (newImage) formData.append("image", newImage);

            const res = await fetch(`${BASE}/posts/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);

            const data = await res.json();

            const updatedPosts = [data, ...posts];
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
            resetForm();
            setShowAddModal(false);
            toast.success("Post created!");
        } catch (err) {
            console.error(err);
            toast.error(`Could not create post: ${err.message}`);
        }
    };

    // Delete post
    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`${BASE}/posts/${postId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete post");

            const updatedPosts = posts.filter((post) => post.id !== postId);
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
            toast.success("Post deleted");
        } catch (err) {
            console.error(err);
            toast.error("Could not delete post");
        }
    };

    // Open edit modal
    const openEditModal = (post) => {
        setCurrentPost(post);
        setNewCaption(post.caption);
        setImagePreview(post.image || null);
        setNewImage(null);
        setShowEditModal(true);
    };

    // Update post
    const handleEditPost = async (e) => {
        e.preventDefault();
        if (!newCaption) return toast.error("Caption is required");

        try {
            const formData = new FormData();
            formData.append("caption", newCaption);
            if (newImage) formData.append("image", newImage);

            const res = await fetch(`${BASE}/posts/${currentPost.id}/`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to update post");

            const updatedPost = await res.json();

            const updatedPosts = posts.map((p) =>
                p.id === updatedPost.id ? updatedPost : p
            );
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
            setShowEditModal(false);
            setCurrentPost(null);
            resetForm();
            toast.success("Post updated!");
        } catch (err) {
            console.error(err);
            toast.error("Could not update post");
        }
    };

    if (loadingProfile)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            </div>
        );

    if (error && !posts.length)
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
                <p className="glass rounded-2xl px-6 py-4 text-red-300">{error}</p>
                <button onClick={loadPosts} className="btn-ghost">
                    <RefreshCw size={15} /> Retry
                </button>
            </div>
        );

    return (
        <div className="min-h-screen px-6 pt-28 pb-24">
            <div className="mx-auto max-w-5xl">
                {/* ---------- HEADER ---------- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-display text-xl font-bold text-white shadow-glow-sm">
                            {user?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                                Hey, {user?.username}
                            </h1>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="glass flex items-center gap-5 rounded-2xl px-5 py-3">
                        <div className="text-center">
                            <p className="font-display text-xl font-bold text-white">{posts.length}</p>
                            <p className="text-[11px] uppercase tracking-wider text-gray-500">Posts</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="font-display text-xl font-bold text-violet-300">
                                {filteredPosts.length}
                            </p>
                            <p className="text-[11px] uppercase tracking-wider text-gray-500">Shown</p>
                        </div>
                    </div>
                </motion.div>

                {/* ---------- TOOLBAR ---------- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-8 flex flex-wrap items-center gap-3"
                >
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchId}
                            onChange={handleSearch}
                            placeholder="Search post by ID..."
                            className="input-dark pl-11"
                        />
                    </div>
                    <button onClick={loadPosts} className="btn-ghost">
                        <RefreshCw size={15} className={loadingPosts ? "animate-spin" : ""} />
                        {loadingPosts ? "Loading..." : "Refresh"}
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn-gradient">
                        <Plus size={16} /> New Post
                    </button>
                </motion.div>

                {/* ---------- POSTS GRID ---------- */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <AnimatePresence>
                        {!loadingPosts && filteredPosts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass col-span-full flex flex-col items-center gap-3 rounded-3xl py-16 text-center"
                            >
                                <FileText size={36} className="text-gray-600" />
                                <p className="text-gray-400">No posts yet. Create your first one!</p>
                                <button onClick={() => setShowAddModal(true)} className="btn-gradient mt-2">
                                    <Plus size={16} /> New Post
                                </button>
                            </motion.div>
                        )}

                        {filteredPosts.map((post, i) => (
                            <motion.article
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                                whileHover={{ y: -4 }}
                                className="glass group relative overflow-hidden rounded-3xl p-5 transition-colors hover:border-violet-400/30"
                            >
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt="Post"
                                        className="mb-4 h-44 w-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="mb-4 flex h-32 w-full items-center justify-center rounded-2xl bg-white/[0.03]">
                                        <ImageIcon size={28} className="text-gray-600" />
                                    </div>
                                )}

                                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                                    #{post.id} • by {post.username}
                                </p>
                                <p className="mt-1.5 font-medium leading-snug text-gray-100">
                                    {post.caption}
                                </p>
                                <p className="mt-3 text-xs text-gray-500">
                                    {new Date(post.created_at).toLocaleString()}
                                </p>

                                <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    <button
                                        onClick={() => openEditModal(post)}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#12121f]/80 text-amber-300 backdrop-blur-md transition-colors hover:bg-amber-500/20"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#12121f]/80 text-red-300 backdrop-blur-md transition-colors hover:bg-red-500/20"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* ---------- FAB ---------- */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 18 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-glow"
                title="New post"
            >
                <Plus size={24} />
            </motion.button>

            {/* ---------- POST MODAL (add + edit) ---------- */}
            <AnimatePresence>
                {(showAddModal || showEditModal) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
                        onClick={() => {
                            setShowAddModal(false);
                            setShowEditModal(false);
                            setCurrentPost(null);
                            resetForm();
                        }}
                    >
                        <motion.form
                            initial={{ scale: 0.85, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onSubmit={showEditModal ? handleEditPost : handleAddPost}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-strong w-full max-w-md space-y-4 rounded-3xl p-7 shadow-glow"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="font-display text-xl font-bold text-white">
                                    {showEditModal ? "Edit Post" : "Create New Post"}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setCurrentPost(null);
                                        resetForm();
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <textarea
                                placeholder="What's happening?"
                                value={newCaption}
                                onChange={(e) => setNewCaption(e.target.value)}
                                rows={3}
                                className="input-dark resize-none"
                                required
                            />

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-gray-400 transition-colors hover:border-violet-400/40 hover:text-gray-200">
                                <ImageIcon size={17} />
                                {newImage ? newImage.name : "Attach an image"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-52 w-full rounded-2xl object-cover"
                                />
                            )}

                            <div className="flex justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setCurrentPost(null);
                                        resetForm();
                                    }}
                                    className="btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-gradient">
                                    <Send size={15} />
                                    {showEditModal ? "Update" : "Post"}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---------- LOGOUT ---------- */}
            <div className="mt-16 flex justify-center">
                <button
                    onClick={() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                    }}
                    className="btn-ghost text-red-300 hover:bg-red-500/10"
                >
                    <LogOut size={15} /> Logout
                </button>
            </div>
        </div>
    );
}
