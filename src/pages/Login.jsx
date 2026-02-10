import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { saveUser } from "../storage/indexedDb";

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Login popup
      const result = await signInWithPopup(auth, provider);

      // Save user data in IndexedDB
      await saveUser({
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL,
        loginTime: new Date().toISOString(),
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Bluestock Login</h1>

        <p className="mt-2 text-slate-600">Sign in to continue</p>

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

