import {
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { LESSON_DEFAULT_FIELDS } from '@/lib/lesson-progress';

export type LeaderboardMode = 'total-stars' | 'fixer-stars' | 'attack-stars' | 'fixer-time' | 'attack-time';
export type LeaderboardGame = 'code_fixer' | 'time_attack';

export type StatsDoc = {
  displayName: string;
  codeFixerStars: number;
  timeAttackStars: number;
  totalStars: number;
  codeFixerBestTimeMs: number;
  timeAttackBestTimeMs: number;
};

export type LeaderboardRow = {
  uid: string;
  rank: number;
  player: string;
  value: number;
};

function fallbackNameFromEmail(email: string | null): string {
  if (!email) {
    return 'Guest';
  }
  const [name] = email.split('@');
  return name || 'Guest';
}

export function resolveDisplayName(user: { displayName?: string | null; email?: string | null }): string {
  return fallbackNameFromEmail(user.email || null).trim() || 'Guest';
}

export async function submitGameStats(params: {
  uid: string;
  displayName?: string;
  game: LeaderboardGame;
  starsEarned: number;
  completionTimeMs?: number | null;
}) {
  const { uid, displayName, game, starsEarned, completionTimeMs } = params;
  const safeStars = Number.isFinite(starsEarned) ? Math.max(0, Math.floor(starsEarned)) : 0;
  const safeTime = Number.isFinite(completionTimeMs) ? Math.max(0, Math.floor(completionTimeMs as number)) : null;
  const statsRef = doc(db, 'stats', uid);
  const fallbackName = (displayName || '').trim();

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(statsRef);
    const existingName = (snap.data() as { displayName?: string } | undefined)?.displayName?.trim() || '';
    const resolvedName = existingName || fallbackName;
    if (!resolvedName) {
      throw new Error('Missing username.');
    }

    if (!snap.exists()) {
      const codeFixerStars = game === 'code_fixer' ? safeStars : 0;
      const timeAttackStars = game === 'time_attack' ? safeStars : 0;
      const codeFixerBestTimeMs = game === 'code_fixer' && safeTime !== null ? safeTime : 0;
      const timeAttackBestTimeMs = game === 'time_attack' && safeTime !== null ? safeTime : 0;
      tx.set(statsRef, {
        displayName: resolvedName,
        codeFixerStars,
        timeAttackStars,
        totalStars: codeFixerStars + timeAttackStars,
        codeFixerBestTimeMs,
        timeAttackBestTimeMs,
        ...LESSON_DEFAULT_FIELDS,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const data = snap.data() as Partial<StatsDoc>;
    const prevCodeFixerBest = Number.isFinite(data.codeFixerBestTimeMs) ? Number(data.codeFixerBestTimeMs) : 0;
    const prevTimeAttackBest = Number.isFinite(data.timeAttackBestTimeMs) ? Number(data.timeAttackBestTimeMs) : 0;

    const updates: Record<string, unknown> = {
      displayName: resolvedName,
      totalStars: increment(safeStars),
      updatedAt: serverTimestamp(),
    };

    if (game === 'code_fixer') {
      updates.codeFixerStars = increment(safeStars);
      if (safeTime !== null && (prevCodeFixerBest <= 0 || safeTime < prevCodeFixerBest)) {
        updates.codeFixerBestTimeMs = safeTime;
      }
    } else {
      updates.timeAttackStars = increment(safeStars);
      if (safeTime !== null && (prevTimeAttackBest <= 0 || safeTime < prevTimeAttackBest)) {
        updates.timeAttackBestTimeMs = safeTime;
      }
    }

    tx.update(statsRef, updates);
  });
}

export async function loadLeaderboard(mode: LeaderboardMode, count = 20): Promise<LeaderboardRow[]> {
  const statsCollection = collection(db, 'stats');
  let q;

  if (mode === 'total-stars') {
    q = query(statsCollection, orderBy('totalStars', 'desc'), limit(count));
  } else if (mode === 'fixer-stars') {
    q = query(statsCollection, orderBy('codeFixerStars', 'desc'), limit(count));
  } else if (mode === 'attack-stars') {
    q = query(statsCollection, orderBy('timeAttackStars', 'desc'), limit(count));
  } else if (mode === 'fixer-time') {
    q = query(statsCollection, where('codeFixerBestTimeMs', '>', 0), orderBy('codeFixerBestTimeMs', 'asc'), limit(count));
  } else {
    q = query(statsCollection, where('timeAttackBestTimeMs', '>', 0), orderBy('timeAttackBestTimeMs', 'asc'), limit(count));
  }

  const snap = await getDocs(q);
  const rawRows = snap.docs.map((d) => {
    const data = d.data() as Partial<StatsDoc>;
    const value =
      mode === 'total-stars'
        ? Number(data.totalStars || 0)
        : mode === 'fixer-stars'
          ? Number(data.codeFixerStars || 0)
          : mode === 'attack-stars'
            ? Number(data.timeAttackStars || 0)
            : mode === 'fixer-time'
              ? Number(data.codeFixerBestTimeMs || 0)
              : Number(data.timeAttackBestTimeMs || 0);

    return {
      uid: d.id,
      player: data.displayName || 'Unknown',
      value,
    };
  });

  return rawRows
    .filter((row) => row.player.toLowerCase() !== 'guest')
    .map((row, index) => ({
      uid: row.uid,
      rank: index + 1,
      player: row.player,
      value: row.value,
    }));
}

export function formatLeaderboardValue(mode: LeaderboardMode, rawValue: number): string {
  if (mode === 'fixer-time' || mode === 'attack-time') {
    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      return '-';
    }
    const seconds = (rawValue / 1000).toFixed(2);
    return `${seconds}s`;
  }
  return String(rawValue);
}
