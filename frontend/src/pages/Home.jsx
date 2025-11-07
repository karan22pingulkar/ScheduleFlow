import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6"
            style={{
                backgroundImage: "url('https://res.cloudinary.com/dobltkhw3/image/upload/v1762519762/Pngtree_banner_3d_glass_abstract_background_1155339_yv4spd.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "scroll",
            }}
        >
            {/* Glass Card */}
            <div className="bg-white/30 backdrop-blur-lg shadow-2xl p-10 rounded-2xl text-center max-w-lg w-full border border-white/40">
                <h1 className="text-4xl font-bold mb-4 text-white">
                    Welcome 👋
                </h1>
                <p className="mb-6 text-white">
                    Manage your posts and schedule easily from your dashboard.
                </p>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );

}
