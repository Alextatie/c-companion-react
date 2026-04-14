'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/firebase/config';
import laurelImage from '../../../data/Laurel.png';
import trophyImage from '../../../data/Trophy.png';
import { LESSON_DEFINITIONS, type LessonDifficulty } from '@/lib/lesson-progress';
import { changeUsername } from '@/lib/username';

type ProfileStats = {
  displayName: string;
  codeFixerStars: number;
  timeAttackStars: number;
  totalStars: number;
  codeFixerBestTimeMs: number;
  timeAttackBestTimeMs: number;
} & Record<string, unknown>;

function formatTime(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '-';
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function countCompletedByDifficulty(stats: ProfileStats | null, difficulty: LessonDifficulty): number {
  if (!stats) {
    return 0;
  }
  return LESSON_DEFINITIONS.filter((lesson) => lesson.difficulty === difficulty).reduce((count, lesson) => {
    return stats[lesson.field] === true ? count + 1 : count;
  }, 0);
}

function ProfileByUidPage({ params }: { params: Promise<{ uid: string }> }) {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const [targetUid, setTargetUid] = useState('');
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editError, setEditError] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/Home');
  };

  const openEditPanel = () => {
    setEditUsername(stats?.displayName || '');
    setEditError('');
    setIsEditOpen(true);
  };

  const closeEditPanel = () => {
    if (isSavingUsername) {
      return;
    }
    setIsEditOpen(false);
    setEditError('');
  };

  const handleSaveUsername = async () => {
    if (!user || !isOwnProfile) {
      return;
    }

    const trimmedUsername = editUsername.trim();
    const currentUsername = (stats?.displayName || '').trim();
    if (!trimmedUsername || trimmedUsername.toLowerCase() === currentUsername.toLowerCase()) {
      setIsEditOpen(false);
      setEditError('');
      return;
    }

    setIsSavingUsername(true);
    setEditError('');

    try {
      const changed = await changeUsername({ uid: user.uid, username: trimmedUsername });
      if (!changed) {
        setIsEditOpen(false);
        return;
      }
      setStats((prev) => (prev ? { ...prev, displayName: trimmedUsername } : prev));
      setIsEditOpen(false);
    } catch (error: any) {
      setEditError(error?.message === 'Username already taken' ? 'Username already taken' : error?.message || 'Failed to save username');
    } finally {
      setIsSavingUsername(false);
    }
  };

  useEffect(() => {
    params
      .then((p) => setTargetUid(p.uid))
      .catch(() => setErrorText('Invalid profile id'));
  }, [params]);

  useEffect(() => {
    if (!targetUid || !user) {
      return;
    }

    let cancelled = false;
    setLoadingStats(true);
    setErrorText('');

    getDoc(doc(db, 'stats', targetUid))
      .then((snap) => {
        if (cancelled) {
          return;
        }
        if (!snap.exists()) {
          setStats(null);
          return;
        }
        const data = snap.data() as Partial<ProfileStats>;
        setStats({
          ...(data as Record<string, unknown>),
          displayName: data.displayName || 'Unknown',
          codeFixerStars: Number(data.codeFixerStars || 0),
          timeAttackStars: Number(data.timeAttackStars || 0),
          totalStars: Number(data.totalStars || 0),
          codeFixerBestTimeMs: Number(data.codeFixerBestTimeMs || 0),
          timeAttackBestTimeMs: Number(data.timeAttackBestTimeMs || 0),
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Failed to load profile';
        setErrorText(message);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingStats(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [targetUid, user]);

  if (!loadingAuth && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
        <div>Sign in to view profiles.</div>
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

  const titleText = stats?.displayName || (loadingAuth || loadingStats ? 'Profile' : 'Profile');
  const beginnerCount = stats ? countCompletedByDifficulty(stats, 'beginner') : 0;
  const intermediateCount = stats ? countCompletedByDifficulty(stats, 'intermediate') : 0;
  const advancedCount = stats ? countCompletedByDifficulty(stats, 'advanced') : 0;
  const beginnerCompleted = beginnerCount === 6;
  const intermediateCompleted = intermediateCount === 6;
  const advancedCompleted = advancedCount === 6;
  const codeFixerStars = stats ? stats.codeFixerStars : '0';
  const timeAttackStars = stats ? stats.timeAttackStars : '0';
  const codeFixerBestTime = stats ? formatTime(stats.codeFixerBestTimeMs) : '-';
  const timeAttackBestTime = stats ? formatTime(stats.timeAttackBestTimeMs) : '-';
  const isOwnProfile = Boolean(user && targetUid && user.uid === targetUid);
  const awardGoldFilter = {
    filter:
      'brightness(0) saturate(100%) invert(75%) sepia(65%) saturate(1360%) hue-rotate(338deg) brightness(102%) contrast(101%)',
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-30 text-center text-white">
      <div className="mx-auto mb-4 w-full max-w-[560px] text-center">
        <div className="relative mx-auto w-fit">
          <h1 className="text-5xl font-bold text-shadow-lg">{titleText}</h1>
          {isOwnProfile ? (
            <button
              type="button"
              onClick={openEditPanel}
              className="absolute left-full ml-2 -translate-y-[30px] rounded bg-[rgb(86,116,145)] px-1.5 py-0.5 text-xs text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(68,96,123)]"
            >
              Edit
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex w-full max-w-[980px] flex-col gap-4">
        <div className="relative mx-auto w-[560px] rounded bg-black/20 p-4 px-[20px] text-left shadow-lg backdrop-blur-[1px]">
          <div className="space-y-2 text-xl">
            <div>
              <span className="font-bold bg-[linear-gradient(135deg,rgb(210,249,171),rgb(150,223,138))] bg-clip-text text-transparent">Beginner:</span>{' '}
              [{beginnerCount}/6]
            </div>
            <div>
              <span className="font-bold bg-[linear-gradient(135deg,rgb(251,236,168),rgb(235,210,108))] bg-clip-text text-transparent">Intermediate:</span>{' '}
              [{intermediateCount}/6]
            </div>
            <div>
              <span className="font-bold bg-[linear-gradient(135deg,rgb(252,205,160),rgb(238,143,114))] bg-clip-text text-transparent">Advanced:</span>{' '}
              [{advancedCount}/6]
            </div>
          </div>
          <div className="pointer-events-none absolute right-[69px] top-1/2 h-[94px] w-[94px] -translate-y-1/2">
            <Image
              src={laurelImage}
              alt=""
              aria-hidden="true"
              className={`absolute -left-[62px] -top-[72px] h-[238px] w-[80px] scale-x-[1.2] scale-y-[1.3] object-contain ${
                beginnerCompleted ? 'opacity-100' : 'opacity-15'
              }`}
              style={beginnerCompleted ? awardGoldFilter : undefined}
            />
            <Image
              src={trophyImage}
              alt="Trophy"
              className={`absolute left-0 top-0 h-[94px] w-[94px] object-contain ${
                advancedCompleted ? 'opacity-100' : 'opacity-15'
              }`}
              style={advancedCompleted ? awardGoldFilter : undefined}
            />
            <Image
              src={laurelImage}
              alt=""
              aria-hidden="true"
              className={`absolute -right-[62px] -top-[72px] h-[238px] w-[80px] scale-x-[-1.2] scale-y-[1.3] object-contain ${
                intermediateCompleted ? 'opacity-100' : 'opacity-15'
              }`}
              style={intermediateCompleted ? awardGoldFilter : undefined}
            />
          </div>
        </div>

        <div className="mx-auto w-[580px] text-left">
          {errorText ? (
            <div className="text-[#ff6565]">{errorText}</div>
          ) : (
            <div className="flex justify-center gap-4">
              <div className="w-[272px] rounded bg-black/20 p-4 px-[20px] shadow-lg backdrop-blur-[1px]">
                <div className="mb-2 text-xl font-bold bg-[linear-gradient(135deg,rgb(130,255,182),rgb(40,223,195))] bg-clip-text text-transparent">
                  Code Fixer
                </div>
                <div className="space-y-1 text-xl">
                  <div>stars: [{codeFixerStars}]</div>
                  <div>Best time: [{codeFixerBestTime}]</div>
                </div>
              </div>
              <div className="w-[272px] rounded bg-black/20 p-4 px-[20px] shadow-lg backdrop-blur-[1px]">
                <div className="mb-2 text-xl font-bold bg-[linear-gradient(135deg,rgb(130,255,182),rgb(40,223,195))] bg-clip-text text-transparent">
                  Quiz Rush
                </div>
                <div className="space-y-1 text-xl">
                  <div>stars: [{timeAttackStars}]</div>
                  <div>Best time: [{timeAttackBestTime}]</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
        >
          <span>{'<-'}</span>
          <span className="ml-1">Back</span>
        </button>
      </div>

      {isEditOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[220px] backdrop-blur-[3px]">
          <div className="relative w-[305px] rounded-lg bg-black/30 p-4 text-center text-white shadow-lg">
            <button
              type="button"
              onClick={closeEditPanel}
              disabled={isSavingUsername}
              className="absolute left-full top-0 ml-2 flex h-6 w-6 items-center justify-center rounded bg-[#d85b5b] text-sm leading-none text-white text-shadow-lg shadow-lg transition hover:bg-[#e56d6d]"
              aria-label="Close edit profile"
            >
              X
            </button>
            <div className="mb-4 text-2xl font-bold text-shadow-lg">Change Username:</div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                className="rounded bg-white p-2 text-black shadow-lg"
                value={editUsername}
                onChange={(event) => setEditUsername(event.target.value)}
                maxLength={20}
                disabled={isSavingUsername}
                required
              />
              <button
                type="button"
                onClick={handleSaveUsername}
                disabled={isSavingUsername}
                className={`relative rounded bg-[rgb(107,195,95)] py-2 text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(129,218,133)] ${
                  isSavingUsername ? 'cursor-default' : ''
                }`}
              >
                <span className={isSavingUsername ? 'opacity-0' : 'opacity-100'}>Save</span>
                {isSavingUsername ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </span>
                ) : null}
              </button>
            </div>
            {editError ? <p className="mt-4 text-sm text-red-400">{editError}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProfileByUidPage;
