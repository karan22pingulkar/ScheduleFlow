import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Welcome() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    return (
        // <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        //     <h1 className="text-4xl font-bold mb-4 text-black">Welcome to Your welcome page</h1>
        //     <p className="mb-6 text-gray-700 text-black">Manage your posts and schedule here.</p>
        //     <button
        //         onClick={() => navigate("/dashboard")}
        //         className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
        //     >
        //         Go to Dashboard
        //     </button>
        // </div>
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6"
            style={{
                backgroundImage: "url('https://res.cloudinary.com/dobltkhw3/image/upload/v1762518992/bg2_ejmakn.jpg')",
                backgroundSize: "70% ",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "scroll",
            }}
        >
            {/* BLUR / GLASS CARD */}
            <div className="bg-white/30 backdrop-blur-md shadow-lg p-10 rounded-2xl text-center">
                <h1 className="text-4xl font-bold mb-4 text-black">Manage your posts and schedule here. 🚀</h1>
                {/* <p className="mb-6 text-black">Manage your posts and schedule here.</p> */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}
