'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config'; // Adjust the path as needed
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); // Added a loading state for waiting for auth state
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth); // Firebase hook to check the user state

  useEffect(() => {
    // Wait until the authentication state has been determined
    if (loadingUser) {
      return; // Don't render anything until loading is complete
    }
    
    // If a user is already logged in, redirect them to the homepage
    if (user) {
      router.push('/');
    } else {
      setLoading(false); // Set loading to false once user state is resolved
    }
  }, [user, loadingUser, router]);

  // Function to handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(false);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider().setCustomParameters({
        prompt: 'select_account', // This forces account selection
      }));
      setSuccess(true);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Check if we're in loading state (waiting for Firebase to determine user)
  if (loadingUser || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-4 border-t-4 border-gray-500 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="w-[305px] shadow-lg mx-auto mt-10 p-4 rounded text-center shadow bg-[rgba(86,118,145,0.85)]">
      <h2 className="text-4xl text-shadow-lg font-bold mb-4">Log In</h2>
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="bg-white text-black p-2 rounded shadow-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-white text-black p-2 rounded shadow-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[rgb(107,195,95,0.85)] shadow-lg text-shadow-lg text-white py-2 rounded hover:bg-[rgb(129,218,133,0.85)] transition"
        >
          Log In with Email
        </button>
      </form>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleGoogleLogin}
          className="bg-[rgb(95,165,195,0.85)] shadow-lg text-shadow-lg text-white py-2 rounded hover:bg-[rgb(116,181,209,0.85)] w-full"
        >
          Log In with Google
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">Logged in successfully!</p>}
    </div>
  );
};

export default LoginPage;
