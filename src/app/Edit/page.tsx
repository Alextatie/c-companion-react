'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { claimUsername } from '@/lib/username';

export default function UsernamePage() {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || user.isAnonymous) {
      router.replace('/login?mode=signup');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await claimUsername({ uid: user.uid, username });
      router.replace('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to save username.');
      setLoading(false);
    }
  };

  if (loadingUser) {
    return null;
  }

  if (!user || user.isAnonymous) {
    return null;
  }

  return (
    <div className="mx-auto mt-26 w-[305px] text-center">
      <h2 className="mb-3 text-5xl font-bold text-white text-shadow-lg">Choose Username</h2>
      <div className="rounded bg-black/20 p-4 shadow-lg backdrop-blur-[1px]">
        <form onSubmit={handleSave} className="flex flex-col items-center gap-4 text-center">
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
          <button
            type="submit"
            className={`w-full rounded bg-[rgb(107,195,95)] py-2 text-white shadow-lg text-shadow-lg transition hover:bg-[rgb(129,218,133)] ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={loading}
          >
            Save
          </button>
        </form>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </div>
  );
}
