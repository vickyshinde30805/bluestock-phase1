import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful ✅");
            navigate("/dashboard");
        } catch (err) {
            alert("Login failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F5F5] p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-slate-100">
                <h1 className="text-2xl font-bold text-[#222222]">Login</h1>
                <p className="mt-2 text-slate-600">
                    Login using Firebase Email/Password
                </p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full mt-1 px-4 py-3 border rounded-xl outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full mt-1 px-4 py-3 border rounded-xl outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 rounded-xl bg-[#414BEA] text-white font-semibold hover:opacity-90 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
