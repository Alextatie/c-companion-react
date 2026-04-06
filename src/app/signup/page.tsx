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
import {
  claimUsername,
  defaultUsernameFromEmail,
  getProfileUsername,
  setStatsDisplayName,
  validateUsername,
} from '@/lib/username';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [googleUsernameStep, setGoogleUsernameStep] = useState(false);
  const [googleUid, setGoogleUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, loadingUser] = useAuthState(auth);
  const { setLoading: setGlobalLoading, withLoading } = useGlobalLoading();

  useEffect(() => {
    setGlobalLoading('signup-auth-state', loadingUser);
    return () => setGlobalLoading('signup-auth-state', false);
  }, [loadingUser, setGlobalLoading]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedUsername = username.trim();
    const usernameError = validateUsername(trimmedUsername);
    if (usernameError) {
      setError(usernameError);
      setLoading(false);
      return;
    }

    try {
      const credential = await withLoading('signup-email', async () =>
        createUserWithEmailAndPassword(auth, email, password)
      );
      await claimUsername({
        uid: credential.user.uid,
        username: trimmedUsername,
      });
      window.location.replace('/Home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const credential = await signInWithPopup(
        auth,
        new GoogleAuthProvider().setCustomParameters({
          prompt: 'select_account',
        })
      );

      const existingUsername = await getProfileUsername(credential.user.uid);
      if (existingUsername) {
        window.location.replace('/Home');
        setLoading(false);
        return;
      }

      await setStatsDisplayName({
        uid: credential.user.uid,
        displayName: defaultUsernameFromEmail(credential.user.email),
      });
      setGoogleUid(credential.user.uid);
      setUsername('');
      setGoogleUsernameStep(true);
      setLoading(false);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setLoading(false);
        return;
      }
      setError('Failed to sign up with Google.');
      setLoading(false);
    }
  };

  const handleGoogleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUid) {
      return;
    }

    setLoading(true);
    setError(null);

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setLoading(false);
      return;
    }

    try {
      await claimUsername({
        uid: googleUid,
        username: username.trim(),
      });
      window.location.replace('/Home');
    } catch (err: any) {
      setError(err?.message || 'Failed to save username.');
      setLoading(false);
    }
  };

  if (loadingUser) return null;

  return (
    <div className="mx-auto mt-26 w-[305px] text-center">
      <h2 className="mb-3 text-5xl font-bold text-white text-shadow-lg">Sign Up</h2>
      <div className="rounded bg-black/20 p-4 shadow-lg backdrop-blur-[1px]">
        {googleUsernameStep ? (
          <form
            id="google-username-form"
            onSubmit={handleGoogleUsernameSubmit}
            className="flex flex-col items-center gap-4 text-center"
          >
            <p className="text-xl text-white text-shadow-lg">Choose a username:</p>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded bg-white p-2 text-black shadow-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
            />
          </form>
        ) : (
          <>
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <label className="-mb-4 text-left text-white text-shadow-lg">Username:</label>
              <input
                type="text"
                placeholder="Username"
                className="rounded bg-white p-2 text-black shadow-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
              />
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
          </>
        )}

        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>

      {googleUsernameStep ? (
        <button
          type="submit"
          form="google-username-form"
          className={`mt-4 inline-flex w-[80px] items-center justify-center rounded bg-[rgb(107,195,95)] py-2 text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(129,218,133)] ${
            loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={loading}
        >
          Save
        </button>
      ) : (
        <Link
          href="/Home"
          className="mt-4 inline-flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] shadow-lg text-shadow-lg transition hover:bg-[rgb(214,232,220)]"
        >
          <span>{'<-'}</span>
          <span className="ml-1">Back</span>
        </Link>
      )}
    </div>
  );
};

export default SignUp;
