'use client';

import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGlobalLoading } from '../providers/loading-provider';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, loadingUser] = useAuthState(auth);
  const { setLoading: setGlobalLoading, withLoading } = useGlobalLoading();

  useEffect(() => {
    setGlobalLoading('signup-auth-state', loadingUser);
    if (!loadingUser && user) {
      window.location.replace('/');
    }
    return () => setGlobalLoading('signup-auth-state', false);
  }, [user, loadingUser, setGlobalLoading]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await withLoading('signup-email', async () =>
        createUserWithEmailAndPassword(auth, email, password)
      );
      setSuccess(true);
      window.location.replace('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await signInWithPopup(
        auth,
        new GoogleAuthProvider().setCustomParameters({
          prompt: 'select_account',
        })
      );
      console.log('Google user:', result.user);
      setSuccess(true);
      window.location.replace('/');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setLoading(false);
        return;
      }
      setError('Failed to sign up with Google.');
      setLoading(false);
    }
  };

  if (loadingUser || user) return null;

  return (
    <div className="mx-auto mt-26 w-[305px] text-center">
      <div className="rounded bg-[rgb(86,118,145)] p-4 shadow-lg">
        <h2 className="mb-4 text-4xl font-bold text-shadow-lg">Sign Up</h2>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="rounded bg-white p-2 text-black shadow-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded bg-white p-2 text-black shadow-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`rounded bg-[rgb(107,195,95)] py-2 text-white shadow-lg text-shadow-lg transition hover:bg-[rgb(129,218,133)] ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            Sign Up with Email
          </button>
        </form>

        <div className="mt-4 flex gap-4">
          <button
            onClick={handleGoogleSignUp}
            className={`w-full rounded bg-[rgb(95,165,195)] py-2 text-white shadow-lg text-shadow-lg transition hover:bg-[rgb(116,181,209)] ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            Sign Up with Google
          </button>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-600">Account created successfully!</p>}
      </div>

      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] shadow-lg text-shadow-lg transition hover:bg-[rgb(214,232,220)]"
      >
        <span>{'<-'}</span>
        <span className="ml-1">Back</span>
      </Link>
    </div>
  );
};

export default SignUp;
