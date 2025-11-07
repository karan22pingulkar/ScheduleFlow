import { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/accounts/register/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            }
        );
        const data = await response.json();
        console.log(data);
        alert("Registered successfully!");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Register
                </h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded p-2 text-black placeholder-gray-500"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded p-2 text-black placeholder-gray-500"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded p-2 text-black placeholder-gray-500"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
