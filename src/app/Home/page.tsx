'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useGlobalLoading } from '../providers/loading-provider';
import { defaultUsernameFromEmail, getProfileUsername } from '@/lib/username';

const HomeMenuPage = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { setLoading, withLoading } = useGlobalLoading();
  const [username, setUsername] = useState<string | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setLoading('home-menu-auth-state', loading);
    return () => setLoading('home-menu-auth-state', false);
  }, [loading, setLoading]);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      router.replace('/login');
      return;
    }

    if (!user || user.isAnonymous) {
      setUsername(null);
      setUsernameLoading(false);
      setUsernameChecked(true);
      return;
    }

    let cancelled = false;
    setUsernameLoading(true);
    setUsernameChecked(false);
    getProfileUsername(user.uid)
      .then((value) => {
        if (!cancelled) {
          setUsername(value || defaultUsernameFromEmail(user.email));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUsername(defaultUsernameFromEmail(user.email));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setUsernameLoading(false);
          setUsernameChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loading, router, user]);

  const handleLogout = async () => {
    try {
      await withLoading('home-menu-logout', async () => signOut(auth));
      router.replace('/login');
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  if (loading || redirecting || !user || (user && !user.isAnonymous && (!usernameChecked || usernameLoading))) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 p-4">
      <h2 className="whitespace-nowrap text-center text-7xl font-bold text-shadow-lg">C-companion</h2>
      <h2 className="mt-2 text-center text-2xl font-bold text-shadow-lg">
        Welcome, {user.isAnonymous ? 'Guest' : username || ''}!
      </h2>

      <div className="mx-auto w-[280px] p-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/learn"
            className="rounded bg-[rgb(86,116,145)] py-2 text-center text-4xl text-white text-shadow-lg shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(68,96,123)]"
          >
            Learn
          </Link>

          <Link
            href="/play"
            className="rounded bg-[rgb(86,116,145)] py-2 text-center text-4xl text-white text-shadow-lg shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(68,96,123)]"
          >
            Play
          </Link>

          <Link
            href={user.isAnonymous ? '/profile' : `/profile/${user.uid}`}
            className="rounded bg-[rgb(86,116,145)] py-2 text-center text-4xl text-white text-shadow-lg shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(68,96,123)]"
          >
            Profile
          </Link>

          <div className="flex gap-2">
            <Link
              href="/options"
              className="w-full rounded bg-[rgb(86,116,145)] py-2 text-center text-2xl text-white text-shadow-lg shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(68,96,123)]"
            >
              Options
            </Link>

            <Link
              href="/about"
              className="w-full rounded bg-[rgb(86,116,145)] py-2 text-center text-2xl text-white text-shadow-lg shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(68,96,123)]"
            >
              About
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="rounded bg-[rgb(205,70,70)] py-2 text-4xl text-white text-shadow-lg shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(179,56,56)]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeMenuPage;
