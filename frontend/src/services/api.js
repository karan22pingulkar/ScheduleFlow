import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://scheduleflow.onrender.com/api/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Network-level failure (fetch TypeError / axios ERR_NETWORK) means the API
// was unreachable — e.g. free-tier cold start — not a rejected request.
export const friendlyError = (err, fallback) =>
    err instanceof TypeError || err?.code === "ERR_NETWORK"
        ? "Server is waking up — try again in ~30 seconds"
        : fallback;

export default api;
