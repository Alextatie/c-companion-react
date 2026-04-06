'use client';

import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './firebase/config';
import { useGlobalLoading } from './providers/loading-provider';

const LandingPage = () => {
  const [user, loading] = useAuthState(auth);
  const { setLoading, withLoading } = useGlobalLoading();

  useEffect(() => {
    setLoading('landing-auth-state', loading);
    return () => setLoading('landing-auth-state', false);
  }, [loading, setLoading]);

  useEffect(() => {
    if (!loading && user) {
      window.location.replace('/Home');
    }
  }, [loading, user]);

  if (loading || user) return null;

  return (
    <div className="mx-auto mt-26 w-[305px] text-center">
      <h1 className="mb-6 whitespace-nowrap text-center text-4xl font-bold text-white text-shadow-lg">C-companion</h1>
      <div className="rounded bg-black/20 p-4 shadow-lg backdrop-blur-[1px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="w-32 rounded bg-[rgb(95,165,195)] py-2 text-center text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(116,181,209)]"
            >
              Sign Up
            </Link>

            <Link
              href="/login"
              className="w-32 rounded bg-[rgb(107,195,95)] py-2 text-center text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(129,218,133)]"
            >
              Log In
            </Link>
          </div>

          <button
            onClick={async () => {
              try {
                await withLoading('landing-guest-login', async () => signInAnonymously(auth));
              } catch (err) {
                console.error('Error signing in as guest: ', err);
              }
            }}
            className="w-full rounded bg-[rgb(122,150,201)] py-2 text-center text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(136,164,214)]"
          >
            Log In As Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
