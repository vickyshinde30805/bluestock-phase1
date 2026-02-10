import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-slate-900">
                    Bluestock Login
                </h1>

                <p className="mt-2 text-slate-600">
                    Sign in to continue
                </p>

                <button
                    onClick={handleGoogleLogin}
                    className="mt-6 w-full py-3 rounded-xl bg-black text-white font-semibold"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
