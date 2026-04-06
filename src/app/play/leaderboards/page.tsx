'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { auth } from '@/app/firebase/config';
import { formatLeaderboardValue, loadLeaderboard, type LeaderboardMode, type LeaderboardRow } from '@/lib/leaderboards';

type LeaderboardEntry = {
  uid: string;
  rank: number;
  player: string;
  value: string;
};

function LeaderboardTable({
  valueHeader,
  entries,
}: {
  valueHeader: string;
  entries: LeaderboardEntry[];
}) {
  return (
    <div className="overflow-hidden rounded-sm bg-transparent">
      <div className="grid grid-cols-[110px_1fr_180px] bg-[rgb(86,116,145)] px-2 py-1 text-[22px] leading-none text-white">
        <div>Rank</div>
        <div>Player Name</div>
        <div>{valueHeader}</div>
      </div>
      <div>
        {entries.map((entry) => (
          <Link
            key={`${entry.rank}-${entry.player}`}
            href={`/profile/${entry.uid}`}
            className="grid grid-cols-[110px_1fr_180px] border-t border-[#d9d9d9] bg-white px-2 py-[2px] text-[28px] leading-[1.25] text-[#426d67] transition hover:bg-[#eef5f5]"
          >
            <div>{entry.rank}</div>
            <div>{entry.player}</div>
            <div>{entry.value}</div>
          </Link>
        ))}
      </div>
      <div className="h-[120px] bg-transparent" />
    </div>
  );
}

function LeaderboardsPage() {
  const [user, authLoading] = useAuthState(auth);
  const [mode, setMode] = useState<LeaderboardMode>('total-stars');
  const [entriesByMode, setEntriesByMode] = useState<Partial<Record<LeaderboardMode, LeaderboardRow[]>>>({});
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const headers = useMemo<Record<LeaderboardMode, string>>(
    () => ({
      'total-stars': 'Total Stars',
      'fixer-stars': 'Fixer Stars',
      'attack-stars': 'Attack Stars',
      'fixer-time': 'Best Time',
      'attack-time': 'Best Time',
    }),
    []
  );

  const tabs: Array<{ key: LeaderboardMode; label: string }> = [
    { key: 'total-stars', label: 'Total☆' },
    { key: 'fixer-stars', label: 'Fixer☆' },
    { key: 'attack-stars', label: 'Attack☆' },
    { key: 'fixer-time', label: 'Fixer◷' },
    { key: 'attack-time', label: 'Attack◷' },
  ];

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }
    if (entriesByMode[mode]) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorText('');

    loadLeaderboard(mode, 20)
      .then((rows) => {
        if (cancelled) {
          return;
        }
        setEntriesByMode((prev) => ({ ...prev, [mode]: rows }));
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Failed to load leaderboard';
        setErrorText(message);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, mode, entriesByMode]);

  const currentRows = entriesByMode[mode] || [];
  const currentEntries: LeaderboardEntry[] = currentRows.map((row) => ({
    uid: row.uid,
    rank: row.rank,
    player: row.player,
    value: formatLeaderboardValue(mode, row.value),
  }));

  return (
    <div className="h-screen overflow-hidden px-[50px] py-[50px] text-white">
      <ScaledLessonFrame baseWidth={1040}>
        <div className="mx-auto w-[1040px] text-center">
          <h1 className="mb-5 text-5xl font-bold text-shadow-lg">Leaderboards</h1>

          <div className="mx-auto mt-3 w-[980px] rounded-none bg-black/20 p-0">
            <div className="grid grid-cols-5 gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMode(tab.key)}
                  className={`h-[56px] w-full rounded-none border border-[rgb(68,96,123)] text-[40px] leading-none transition ${
                    mode === tab.key
                      ? 'bg-[rgb(86,116,145)] text-white'
                      : 'bg-[rgb(63,85,107)] text-[#8395a7] hover:bg-[rgb(68,96,123)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {!authLoading && !user ? (
              <div className="px-4 py-6 text-center text-[24px] text-white">Sign in to view leaderboards.</div>
            ) : loading ? (
              <div className="flex items-center justify-center px-4 py-6">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-white border-t-transparent" />
              </div>
            ) : errorText ? (
              <div className="px-4 py-6 text-center text-[18px] text-[#ff6565]">{errorText}</div>
            ) : (
              <LeaderboardTable valueHeader={headers[mode]} entries={currentEntries} />
            )}
          </div>

          <div className="mx-auto mt-1 flex w-[980px] items-center justify-center gap-6 text-[30px] leading-none">
            <button type="button" disabled className="rounded-none bg-[#567491]/35 px-4 py-1 text-[#6f8d8d]">
              Prev
            </button>
            <span className="text-[#dceff1]">1/1</span>
            <button type="button" disabled className="rounded-none bg-[#567491]/35 px-4 py-1 text-[#6f8d8d]">
              Next
            </button>
          </div>

          <div className="mx-auto mt-4 w-[980px] text-center">
            <Link
              href="/play"
              className="inline-flex items-center rounded-none bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
            >
              <span>{'<-'}</span>
              <span className="ml-1">Back</span>
            </Link>
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LeaderboardsPage;
