import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/accounts/profile/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch profile");

                const data = await res.json();
                console.log("Profile data:", data);
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
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

            const data = await res.json();
            console.log("Posts data:", data);
            setPosts(data);
            setFilteredPosts(data);
        } catch (err) {
            console.error(err);
            setError(`Could not fetch posts: ${err.message}`);
        } finally {
            setLoadingPosts(false);
        }
    };

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

    // Add new post
    const handleAddPost = async (e) => {
        e.preventDefault();
        if (!newCaption) return alert("Caption is required");

        try {
            const formData = new FormData();
            formData.append("caption", newCaption);
            if (newImage) formData.append("image", newImage);

            console.log("Sending post data:", newCaption, newImage);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);

            const data = await res.json();
            console.log("Created post response:", data);

            const updatedPosts = [data, ...posts];
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
            setNewCaption("");
            setNewImage(null);
            setImagePreview(null);
            setShowAddModal(false);
        } catch (err) {
            console.error(err);
            alert(`Could not create post: ${err.message}`);
        }
    };

    // Delete post
    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete post");

            const updatedPosts = posts.filter((post) => post.id !== postId);
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
        } catch (err) {
            console.error(err);
            alert("Could not delete post");
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
        if (!newCaption) return alert("Caption is required");

        try {
            const formData = new FormData();
            formData.append("caption", newCaption);
            if (newImage) formData.append("image", newImage);

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/posts/${currentPost.id}/`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

            if (!res.ok) throw new Error("Failed to update post");

            const updatedPost = await res.json();
            console.log("Updated post:", updatedPost);

            const updatedPosts = posts.map((p) =>
                p.id === updatedPost.id ? updatedPost : p
            );
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
            setShowEditModal(false);
            setCurrentPost(null);
            setNewCaption("");
            setNewImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error(err);
            alert("Could not update post");
        }
    };

    // Debug: log filtered posts whenever they change
    useEffect(() => {
        console.log("Filtered posts state:", filteredPosts);
    }, [filteredPosts]);

    if (loadingProfile) return <p className="text-center mt-20">Loading profile...</p>;
    if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center px-4 py-10"
            style={{ backgroundImage: "url('YOUR_BACKGROUND_IMAGE_URL_HERE')" }}
        >
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md text-center"
            >
                <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username} 🎉</h1>
                <p className="text-gray-700 mb-4">{user?.email}</p>

                <button
                    onClick={loadPosts}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    {loadingPosts ? "Loading..." : "Load My Posts"}
                </button>
            </motion.div>

            {/* Search Bar */}
            <div className="mt-6 w-full max-w-xl">
                <input
                    type="text"
                    value={searchId}
                    onChange={handleSearch}
                    placeholder="Search post by ID"
                    className="w-full border rounded p-2 text-black"
                />
            </div>

            {/* Posts Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-8 w-full max-w-xl space-y-4"
            >
                {loadingPosts && <p className="text-center text-gray-700">Fetching posts...</p>}

                {!loadingPosts && filteredPosts.length === 0 && (
                    <p className="text-center text-gray-600 text-lg">No posts found.</p>
                )}

                {filteredPosts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-md relative"
                    >
                        <p className="text-gray-500 text-xs">ID: {post.id}</p>
                        <p className="text-gray-600 text-sm mb-1">Posted by: {post.username}</p>
                        <p className="font-semibold text-gray-800 mb-2">{post.caption}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt="Post"
                                className="rounded max-w-full h-auto mb-2"
                            />
                        )}
                        <p className="text-gray-500 text-xs">
                            Created at: {new Date(post.created_at).toLocaleString()}
                        </p>

                        {/* Edit & Delete Buttons */}
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                onClick={() => openEditModal(post)}
                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Floating Add Post Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all"
            >
                + Add Post
            </button>

            {/* Add Post Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.form
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleAddPost}
                        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-black"
                    >
                        <h2 className="text-2xl font-bold text-center">Create New Post</h2>

                        <input
                            type="text"
                            placeholder="Caption"
                            value={newCaption}
                            onChange={(e) => setNewCaption(e.target.value)}
                            className="w-full border rounded p-2 text-black"
                            required
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border rounded p-2 text-black"
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 max-w-full rounded shadow-sm"
                            />
                        )}

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewCaption("");
                                    setNewImage(null);
                                    setImagePreview(null);
                                }}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                            >
                                Post
                            </button>
                        </div>
                    </motion.form>
                </div>
            )}

            {/* Edit Post Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.form
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleEditPost}
                        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-black"
                    >
                        <h2 className="text-2xl font-bold text-center">Edit Post</h2>

                        <input
                            type="text"
                            placeholder="Caption"
                            value={newCaption}
                            onChange={(e) => setNewCaption(e.target.value)}
                            className="w-full border rounded p-2 text-black"
                            required
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border rounded p-2 text-black"
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 max-w-full rounded shadow-sm"
                            />
                        )}

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setCurrentPost(null);
                                    setNewCaption("");
                                    setNewImage(null);
                                    setImagePreview(null);
                                }}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all"
                            >
                                Update
                            </button>
                        </div>
                    </motion.form>
                </div>
            )}

            {/* Logout Button */}
            <motion.button
                onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-10 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
                Logout
            </motion.button>
        </div>
    );
}
