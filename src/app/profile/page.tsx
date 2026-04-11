'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

export default function ProfilePage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user && !user.isAnonymous) {
      router.replace(`/profile/${user.uid}`);
    }
  }, [loading, router, user]);

  const handleAuthRedirect = async () => {
    try {
      await signOut(auth);
    } catch (_error) {
      // Ignore logout failures and continue redirect.
    }
    router.replace('/login');
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/Home');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (user && !user.isAnonymous) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 pt-[170px] text-center text-white">
      <h1 className="mb-4 text-4xl font-bold text-shadow-lg">Profile</h1>
      <div className="w-full max-w-[420px] rounded-lg bg-black/20 p-4 shadow-lg backdrop-blur-[1px]">
        <p className="text-2xl text-shadow-lg">Login to see your profile</p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={handleAuthRedirect}
            className="w-32 rounded bg-[rgb(107,195,95)] py-2 text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(129,218,133)]"
          >
            Log In
          </button>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
        >
          <span>{'<-'}</span>
          <span className="ml-1">Back</span>
        </button>
      </div>
    </div>
  );
}
