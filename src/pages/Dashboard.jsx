import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
    const user = auth.currentUser;

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Dashboard ✅
                </h1>

                <p className="mt-2 text-slate-700">
                    Logged in as: <b>{user?.email}</b>
                </p>

                <button
                    onClick={handleLogout}
                    className="mt-6 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

