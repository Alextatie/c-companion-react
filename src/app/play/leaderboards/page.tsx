'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';

type LeaderboardEntry = {
  rank: number;
  player: string;
  value: number;
};

type LeaderboardMode = 'total-stars' | 'fixer-stars' | 'rush-stars' | 'fixer-time' | 'rush-time';

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
          <div
            key={`${entry.rank}-${entry.player}`}
            className="grid grid-cols-[110px_1fr_180px] border-t border-[#d9d9d9] bg-white px-2 py-[2px] text-[28px] leading-[1.25] text-[#426d67]"
          >
            <div>{entry.rank}</div>
            <div>{entry.player}</div>
            <div>{entry.value}</div>
          </div>
        ))}
      </div>
      <div className="h-[120px] bg-transparent" />
    </div>
  );
}

function LeaderboardsPage() {
  const [mode, setMode] = useState<LeaderboardMode>('total-stars');

  const data = useMemo<Record<LeaderboardMode, { header: string; rows: LeaderboardEntry[] }>>(
    () => ({
      'total-stars': {
        header: 'Total Stars',
        rows: [
          { rank: 1, player: 'Alex', value: 22 },
          { rank: 2, player: 'roberta207', value: 11 },
          { rank: 3, player: 'MagicalSleepingChimpan', value: 9 },
          { rank: 4, player: 'j0e_b1den', value: 2 },
          { rank: 5, player: 'alex556', value: 1 },
        ],
      },
      'fixer-stars': {
        header: 'Fixer Stars',
        rows: [
          { rank: 1, player: 'Alex', value: 12 },
          { rank: 2, player: 'roberta207', value: 9 },
          { rank: 3, player: 'MagicalSleepingChimpan', value: 6 },
          { rank: 4, player: 'j0e_b1den', value: 2 },
          { rank: 5, player: 'alex556', value: 1 },
        ],
      },
      'rush-stars': {
        header: 'Rush Stars',
        rows: [
          { rank: 1, player: 'Alex', value: 10 },
          { rank: 2, player: 'MagicalSleepingChimpan', value: 5 },
          { rank: 3, player: 'roberta207', value: 2 },
          { rank: 4, player: 'j0e_b1den', value: 0 },
          { rank: 5, player: 'alex556', value: 0 },
        ],
      },
      'fixer-time': {
        header: 'Best Time',
        rows: [
          { rank: 1, player: 'roberta207', value: 76 },
          { rank: 2, player: 'Alex', value: 83 },
          { rank: 3, player: 'MagicalSleepingChimpan', value: 88 },
          { rank: 4, player: 'alex556', value: 95 },
          { rank: 5, player: 'j0e_b1den', value: 102 },
        ],
      },
      'rush-time': {
        header: 'Best Time',
        rows: [
          { rank: 1, player: 'Alex', value: 49 },
          { rank: 2, player: 'MagicalSleepingChimpan', value: 53 },
          { rank: 3, player: 'roberta207', value: 57 },
          { rank: 4, player: 'alex556', value: 63 },
          { rank: 5, player: 'j0e_b1den', value: 69 },
        ],
      },
    }),
    []
  );

  const tabs: Array<{ key: LeaderboardMode; label: string }> = [
    { key: 'total-stars', label: 'Total☆' },
    { key: 'fixer-stars', label: 'Fixer☆' },
    { key: 'rush-stars', label: 'Rush☆' },
    { key: 'fixer-time', label: 'Fixer◷' },
    { key: 'rush-time', label: 'Rush◷' },
  ];

  const current = data[mode];

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

            <LeaderboardTable valueHeader={current.header} entries={current.rows} />
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
