'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

function PlayPage() {
  const [user] = useAuthState(auth);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center -mt-40 px-4 pt-30 text-center text-white">
      <div className="mb-5 text-5xl font-bold text-shadow-lg">Select a game</div>
      <div className="mx-auto w-[280px] p-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/play/code_fixer"
            className="flex h-[52px] items-center justify-center rounded bg-[rgb(86,117,145)] text-center text-4xl leading-none text-shadow-lg shadow-lg text-white transition hover:bg-[rgb(68,96,123)] disabled:cursor-default"
            style={{ fontSize: '36px' }}
          >
            Code Fixer
          </Link>

          <Link
            href="/play/time_attack"
            className="flex h-[52px] items-center justify-center rounded bg-[rgb(86,116,145)] text-center leading-none text-shadow-lg shadow-lg text-white transition hover:bg-[rgb(68,96,123)] disabled:cursor-default"
            style={{ fontSize: '33px' }}
          >
            Time Attack
          </Link>

          <div className="my-2 h-px w-full bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />

          <Link
            href="/play/leaderboards"
            className="flex h-[52px] items-center justify-center rounded bg-[rgb(86,116,145)] text-center text-3xl leading-none text-shadow-lg shadow-lg text-white transition hover:bg-[rgb(68,96,123)]"
            style={{ fontSize: '30px' }}
          >
            Leaderboards
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="./Home"
          className="flex w-full cursor-pointer items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
        >
          <span>{'<-'}</span> <span className="ml-1">Back</span>
        </Link>
      </div>

    </div>
  );
}

export default PlayPage;
