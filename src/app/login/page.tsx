'use client';

import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGlobalLoading } from '../providers/loading-provider';
import { defaultUsernameFromEmail, setStatsDisplayName } from '@/lib/username';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, loadingUser] = useAuthState(auth);
  const { setLoading, withLoading } = useGlobalLoading();

  useEffect(() => {
    setLoading('login-auth-state', loadingUser);
    if (!loadingUser && user) {
      window.location.replace('/Home');
    }
    return () => setLoading('login-auth-state', false);
  }, [user, loadingUser, setLoading]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await withLoading('login-email', async () =>
        signInWithEmailAndPassword(auth, email, password)
      );
      window.location.replace('/Home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);

    try {
      const credential = await signInWithPopup(
        auth,
        new GoogleAuthProvider().setCustomParameters({
          prompt: 'select_account',
        })
      );
      await setStatsDisplayName({
        uid: credential.user.uid,
        displayName: defaultUsernameFromEmail(credential.user.email),
      });
      window.location.replace('/Home');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        return;
      }
      setError(err.message);
    }
  };

  if (loadingUser || user) return null;

  return (
    <div className="mx-auto mt-26 w-[305px] text-center">
      <h2 className="mb-4 text-5xl font-bold text-white text-shadow-lg">Log In</h2>
      <div className="rounded bg-black/20 p-4 shadow-lg backdrop-blur-[1px]">
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <label className="-mb-4 text-left text-white text-shadow-lg">Email:</label>
          <input
            type="email"
            placeholder="Email"
            className="rounded bg-white p-2 text-black shadow-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="-mb-4 text-left text-white text-shadow-lg">Password:</label>
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
            className="rounded bg-[rgb(107,195,95)] py-2 text-white shadow-lg text-shadow-lg transition hover:bg-[rgb(129,218,133)]"
          >
            Log In with Email
          </button>
        </form>

        <div className="mt-4 flex gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full rounded bg-[rgb(95,165,195)] py-2 text-white shadow-lg text-shadow-lg transition hover:bg-[rgb(116,181,209)]"
          >
            Log In with Google
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>

      <Link
        href="/Home"
        className="mt-4 inline-flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] shadow-lg text-shadow-lg transition hover:bg-[rgb(214,232,220)]"
      >
        <span>{'<-'}</span>
        <span className="ml-1">Back</span>
      </Link>
    </div>
  );
};

export default LoginPage;
