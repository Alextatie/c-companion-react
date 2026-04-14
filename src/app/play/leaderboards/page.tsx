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

const LEADERBOARD_PAGE_SIZE = 10;

function LeaderboardTable({
  valueHeader,
  entries,
}: {
  valueHeader: string;
  entries: LeaderboardEntry[];
}) {
  const emptyRows = Array.from({ length: Math.max(0, LEADERBOARD_PAGE_SIZE - entries.length) });

  return (
    <div className="overflow-hidden rounded-b-[6px] bg-transparent backdrop-blur-[4px]">
      <div className="grid grid-cols-[156.8px_1fr_156.8px] items-center bg-[rgb(86,116,145)] px-[6px] py-[3px] text-center text-[17.6px] leading-none text-white">
        <div className="text-center">Rank</div>
        <div className="text-center">Player Name</div>
        <div className="text-center">{valueHeader}</div>
      </div>
      <div>
        {entries.map((entry) => (
          <Link
            key={`${entry.rank}-${entry.player}`}
            href={`/profile/${entry.uid}`}
            className="grid grid-cols-[156.8px_1fr_156.8px] items-center border-t-[0.8px] border-white/10 bg-black/[0.23] px-[6px] py-[1.6px] text-center text-[22.4px] leading-[1.25] text-white transition hover:bg-black/[0.288]"
          >
            <div className="text-center">{entry.rank}</div>
            <div className="text-center">{entry.player}</div>
            <div className="text-center">{entry.value}</div>
          </Link>
        ))}
        {emptyRows.map((_, index) => (
          <div
            key={`empty-leaderboard-row-${index}`}
            className="grid grid-cols-[156.8px_1fr_156.8px] items-center border-t-[0.8px] border-white/10 bg-black/[0.154] px-[6px] py-[1.6px] text-center text-[22.4px] leading-[1.25] text-transparent"
            aria-hidden="true"
          >
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardsPage() {
  const [user, authLoading] = useAuthState(auth);
  const [mode, setMode] = useState<LeaderboardMode>('total-stars');
  const [pageIndex, setPageIndex] = useState(0);
  const [entriesByMode, setEntriesByMode] = useState<Partial<Record<LeaderboardMode, LeaderboardRow[]>>>({});
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const headers = useMemo<Record<LeaderboardMode, string>>(
    () => ({
      'total-stars': 'Total Stars',
      'fixer-stars': 'Fixer Stars',
      'attack-stars': 'Quiz Rush Stars',
      'fixer-time': 'Best Time',
      'attack-time': 'Best Time',
    }),
    []
  );

  const tabs: Array<{ key: LeaderboardMode; label: string }> = [
    { key: 'total-stars', label: 'Total☆' },
    { key: 'fixer-stars', label: 'Fixer☆' },
    { key: 'attack-stars', label: 'Quiz☆' },
    { key: 'fixer-time', label: 'Fixer◷' },
    { key: 'attack-time', label: 'Quiz◷' },
  ];

  useEffect(() => {
    setPageIndex(0);
  }, [mode]);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorText('');

    loadLeaderboard(mode, 25)
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
  }, [authLoading, user, mode]);

  const currentRows = entriesByMode[mode] || [];
  const currentEntries: LeaderboardEntry[] = currentRows.map((row) => ({
    uid: row.uid,
    rank: row.rank,
    player: row.player,
    value: formatLeaderboardValue(mode, row.value),
  }));
  const totalPages = Math.max(1, Math.ceil(currentEntries.length / LEADERBOARD_PAGE_SIZE));
  const activePageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedEntries = currentEntries.slice(
    activePageIndex * LEADERBOARD_PAGE_SIZE,
    activePageIndex * LEADERBOARD_PAGE_SIZE + LEADERBOARD_PAGE_SIZE
  );
  const canGoPrev = !loading && activePageIndex > 0;
  const canGoNext = !loading && activePageIndex < totalPages - 1;

  return (
    <div className="h-screen overflow-hidden px-[40px] py-[40px] text-white">
      <ScaledLessonFrame baseWidth={832}>
        <div className="mx-auto flex w-[832px] flex-col items-center text-center">
          <h1 className="mb-4 w-full text-center text-[38.4px] font-bold leading-none text-shadow-lg">Leaderboards</h1>

          <div className="mx-auto mt-[10px] w-[784px] rounded-none bg-transparent p-0">
            <div className="grid grid-cols-5 gap-0">
              {tabs.map((tab, index) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMode(tab.key)}
                  className={`flex h-[44.8px] w-full items-center justify-center rounded-none border-[0.8px] border-[rgb(68,96,123)] text-center text-[32px] leading-none transition ${
                    index === 0 ? 'rounded-tl-[6px]' : ''
                  } ${
                    index === tabs.length - 1 ? 'rounded-tr-[6px]' : ''
                  } ${
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
              <div className="px-[13px] py-[19px] text-center text-[19.2px] text-white">Sign in to view leaderboards.</div>
            ) : errorText && !loading ? (
              <div className="px-[13px] py-[19px] text-center text-[14.4px] text-[#ff6565]">{errorText}</div>
            ) : (
              <div className="relative">
                <LeaderboardTable valueHeader={headers[mode]} entries={pagedEntries} />
                {loading ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/[0.12]">
                    <div className="h-[51.2px] w-[51.2px] animate-spin rounded-full border-[3.2px] border-t-[3.2px] border-white border-t-transparent" />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="mx-auto mt-[7px] flex w-[784px] items-center justify-center gap-[19px] text-center text-[24px] leading-none">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              className={`flex w-[71px] items-center justify-center rounded-[3px] bg-[rgb(86,116,145)] px-[13px] py-[3px] text-center text-white transition ${
                canGoPrev ? 'hover:bg-[rgb(68,96,123)]' : 'opacity-30'
              }`}
            >
              Prev
            </button>
            <span className="text-[#dceff1]">
              {activePageIndex + 1}/{totalPages}
            </span>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
              className={`flex w-[71px] items-center justify-center rounded-[3px] bg-[rgb(86,116,145)] px-[13px] py-[3px] text-center text-white transition ${
                canGoNext ? 'hover:bg-[rgb(68,96,123)]' : 'opacity-30'
              }`}
            >
              Next
            </button>
          </div>

          <div className="mx-auto mt-[13px] w-[784px] text-center">
            <Link
              href="/play"
              className="inline-flex items-center justify-center rounded-[3px] bg-white px-[10px] py-[6px] text-center text-[14.4px] text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
            >
              <span>{'<-'}</span>
              <span className="ml-[3px]">Back</span>
            </Link>
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LeaderboardsPage;
