import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { getUser, saveUser, clearUser } from "../storage/indexedDb";

export default function Dashboard() {
    const user = auth.currentUser;
    const [storedUser, setStoredUser] = useState(null);

    useEffect(() => {
        const syncUser = async () => {
            const u = await getUser();

            // If IndexedDB is empty but Firebase user exists, store it now
            if (!u && user) {
                await saveUser({
                    email: user.email,
                    name: user.displayName,
                    photo: user.photoURL,
                    loginTime: new Date().toISOString(),
                });
            }

            const updated = await getUser();
            setStoredUser(updated);
        };

        syncUser();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        await clearUser();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard ✅</h1>

                <p className="mt-4 text-slate-700">
                    Firebase user: <b>{user?.email}</b>
                </p>

                <p className="mt-2 text-slate-700">
                    IndexedDB stored: <b>{storedUser?.email || "Not saved"}</b>
                </p>

                <p className="mt-2 text-slate-600 text-sm">
                    Login time: {storedUser?.loginTime || "-"}
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
