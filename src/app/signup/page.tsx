'use client';

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config"; // Adjust the path as needed
import { useRouter } from 'next/navigation';
import { useAuthState } from "react-firebase-hooks/auth";
import { useGlobalLoading } from "../providers/loading-provider";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth); // Firebase hook to check the user state
  const { setLoading: setGlobalLoading, withLoading } = useGlobalLoading();

  useEffect(() => {
    setGlobalLoading('signup-auth-state', loadingUser);
    if (!loadingUser && user) {
      router.push('/');
    }
    return () => setGlobalLoading('signup-auth-state', false);
  }, [user, loadingUser, router, setGlobalLoading]);

  // Function to handle email and password sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the sign-up starts
    setError(null);
    setSuccess(false);

    try {
      await withLoading('signup-email', async () =>
        createUserWithEmailAndPassword(auth, email, password)
      );
      setSuccess(true);
      router.push('/');  // Redirect to homepage after successful sign-up
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false after operation completes
    }
  };

  // Function to handle Google sign-up
  const handleGoogleSignUp = async () => {
    setLoading(true); // Set loading to true when the sign-up starts
    setError(null);
    setSuccess(false);

    try {
      const result = await withLoading('signup-google', async () =>
        signInWithPopup(
          auth,
          new GoogleAuthProvider().setCustomParameters({
            prompt: "select_account", // This forces account selection
          })
        )
      );
      const user = result.user; // user info returned after successful login

      // You can handle the user info here if needed
      console.log("Google user:", user);
      setSuccess(true); // Indicating the sign-up was successful
      router.push('/');  // Redirect to homepage after successful sign-up
    } catch (err: any) {
      setError("Failed to sign up with Google.");
    } finally {
      setLoading(false); // Set loading to false after operation completes
    }
  };

  if (loadingUser || user) return null;

  return (
    <div className="w-[305px] mx-auto mt-10 p-4 mt-26 rounded text-center shadow-lg bg-[rgb(86,118,145)]">
      <h2 className="text-4xl text-shadow-lg font-bold mb-4">Sign Up</h2>

      {/* Email and Password Sign-Up Form */}
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="bg-white text-black p-2 rounded shadow-lg "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-white text-black p-2 rounded shadow-lg "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className={`bg-[rgb(107,195,95)] shadow-lg text-shadow-lg text-white py-2 rounded hover:bg-[rgb(129,218,133)] transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable button while loading
        >
          Sign Up with Email
        </button>
      </form>

      {/* Google Sign-Up Button */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleGoogleSignUp}
          className={`bg-[rgb(95,165,195)] shadow-lg text-shadow-lg text-white py-2 rounded hover:bg-[rgb(116,181,209)] w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading} // Disable button while loading
        >
          Sign Up with Google
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">Account created successfully!</p>}
    </div>
  );
};

export default SignUp;


