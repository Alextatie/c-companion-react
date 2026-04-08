'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import {
  ADVANCED_LESSON_FIELDS,
  BEGINNER_LESSON_FIELDS,
  INTERMEDIATE_LESSON_FIELDS,
  LESSON_DEFAULT_FIELDS,
} from '@/lib/lesson-progress';

const applyAnimation = (enabled: boolean) => {
  const html = document.documentElement;
  const body = document.body;

  if (enabled) {
    html.removeAttribute('data-bg-anim');
    body.removeAttribute('data-bg-anim');
    document.cookie = 'bg-anim=on; path=/; max-age=31536000; samesite=lax';
  } else {
    html.setAttribute('data-bg-anim', 'off');
    body.setAttribute('data-bg-anim', 'off');
    document.cookie = 'bg-anim=off; path=/; max-age=31536000; samesite=lax';
  }
};

const applyHints = (enabled: boolean) => {
  const html = document.documentElement;
  const body = document.body;

  if (enabled) {
    html.removeAttribute('data-hints');
    body.removeAttribute('data-hints');
    document.cookie = 'hints=on; path=/; max-age=31536000; samesite=lax';
  } else {
    html.setAttribute('data-hints', 'off');
    body.setAttribute('data-hints', 'off');
    document.cookie = 'hints=off; path=/; max-age=31536000; samesite=lax';
  }
  window.dispatchEvent(new Event('hints-setting-change'));
};

function OptionsPage() {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [showResetLessonsConfirm, setShowResetLessonsConfirm] = useState(false);
  const [showResetGameScoresConfirm, setShowResetGameScoresConfirm] = useState(false);
  const [showCompleteBeginnerConfirm, setShowCompleteBeginnerConfirm] = useState(false);
  const [showCompleteIntermediateConfirm, setShowCompleteIntermediateConfirm] = useState(false);
  const [showCompleteAdvancedConfirm, setShowCompleteAdvancedConfirm] = useState(false);

  const completeDifficultyLessons = async (fields: string[]) => {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
      return;
    }

    const lessonUpdates = fields.reduce<Record<string, boolean>>((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});

    await setDoc(
      doc(db, 'stats', user.uid),
      {
        ...lessonUpdates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleConfirmResetLessons = async () => {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
      setShowResetLessonsConfirm(false);
      return;
    }

    try {
      await setDoc(
        doc(db, 'stats', user.uid),
        {
          ...LESSON_DEFAULT_FIELDS,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to reset lesson progress', error);
    } finally {
      setShowResetLessonsConfirm(false);
    }
  };

  const handleConfirmResetGameScores = async () => {
    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
      setShowResetGameScoresConfirm(false);
      return;
    }

    try {
      await setDoc(
        doc(db, 'stats', user.uid),
        {
          codeFixerStars: 0,
          timeAttackStars: 0,
          totalStars: 0,
          codeFixerBestTimeMs: 0,
          timeAttackBestTimeMs: 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to reset game scores', error);
    } finally {
      setShowResetGameScoresConfirm(false);
    }
  };

  const handleConfirmCompleteBeginner = async () => {
    try {
      await completeDifficultyLessons(BEGINNER_LESSON_FIELDS);
    } catch (error) {
      console.error('Failed to complete beginner lessons', error);
    } finally {
      setShowCompleteBeginnerConfirm(false);
    }
  };

  const handleConfirmCompleteIntermediate = async () => {
    try {
      await completeDifficultyLessons(INTERMEDIATE_LESSON_FIELDS);
    } catch (error) {
      console.error('Failed to complete intermediate lessons', error);
    } finally {
      setShowCompleteIntermediateConfirm(false);
    }
  };

  const handleConfirmCompleteAdvanced = async () => {
    try {
      await completeDifficultyLessons(ADVANCED_LESSON_FIELDS);
    } catch (error) {
      console.error('Failed to complete advanced lessons', error);
    } finally {
      setShowCompleteAdvancedConfirm(false);
    }
  };

  useEffect(() => {
    const isAnimationOff = document.documentElement.getAttribute('data-bg-anim') === 'off';
    const isHintsOff = document.documentElement.getAttribute('data-hints') === 'off';
    setAnimationEnabled(!isAnimationOff);
    setHintsEnabled(!isHintsOff);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-confirm-button="true"]')) {
        return;
      }
      setShowResetLessonsConfirm(false);
      setShowResetGameScoresConfirm(false);
      setShowCompleteBeginnerConfirm(false);
      setShowCompleteIntermediateConfirm(false);
      setShowCompleteAdvancedConfirm(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 pt-[130px] text-center text-white">
      <h1 className="text-5xl text-shadow-lg font-bold mb-5">Options</h1>

      <div className="w-full max-w-[440px] mx-auto rounded-xl bg-black/20 p-4 shadow-lg backdrop-blur-[1px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Animation:</span>
            <button
              type="button"
              role="checkbox"
              aria-checked={animationEnabled}
              onClick={() => {
                const next = !animationEnabled;
                setAnimationEnabled(next);
                applyAnimation(next);
              }}
              className={`w-8 h-8 rounded border-2 shadow-lg transition cursor-pointer flex items-center justify-center text-xl font-bold ${
                animationEnabled
                  ? 'bg-transparent text-white border-white'
                  : 'bg-transparent text-transparent border-white'
              }`}
            >
              {animationEnabled ? '\u2713' : ''}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Hints:</span>
            <button
              type="button"
              role="checkbox"
              aria-checked={hintsEnabled}
              onClick={() => {
                const next = !hintsEnabled;
                setHintsEnabled(next);
                applyHints(next);
              }}
              className={`w-8 h-8 rounded border-2 shadow-lg transition cursor-pointer flex items-center justify-center text-xl font-bold ${
                hintsEnabled
                  ? 'bg-transparent text-white border-white'
                  : 'bg-transparent text-transparent border-white'
              }`}
            >
              {hintsEnabled ? '\u2713' : ''}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Reset Lessons:</span>
            <div className="flex items-center gap-2">
              {showResetLessonsConfirm ? (
                <button
                  type="button"
                  onClick={handleConfirmResetLessons}
                  data-confirm-button="true"
                  className="h-8 rounded border-2 border-[#bb6666] bg-transparent px-2 text-sm text-white shadow-lg transition hover:border-[#ca7a7a] hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-white"
                >
                  Confirm
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowResetLessonsConfirm(true)}
                className="h-8 w-8 cursor-pointer rounded border-2 border-[#bb6666] bg-transparent shadow-lg transition hover:border-[#ca7a7a] hover:bg-[rgba(202,122,122,0.08)]"
              >
                <span className="sr-only">Reset Lessons</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Reset Game Scores:</span>
            <div className="flex items-center gap-2">
              {showResetGameScoresConfirm ? (
                <button
                  type="button"
                  onClick={handleConfirmResetGameScores}
                  data-confirm-button="true"
                  className="h-8 rounded border-2 border-[#bb6666] bg-transparent px-2 text-sm text-white shadow-lg transition hover:border-[#ca7a7a] hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-white"
                >
                  Confirm
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowResetGameScoresConfirm(true)}
                className="h-8 w-8 cursor-pointer rounded border-2 border-[#bb6666] bg-transparent shadow-lg transition hover:border-[#ca7a7a] hover:bg-[rgba(202,122,122,0.08)]"
              >
                <span className="sr-only">Reset Game Scores</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-[440px] mx-auto rounded-xl bg-[#00244266] p-4 shadow-lg backdrop-blur-[1px]">
        <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Complete Beginner:</span>
            <div className="flex items-center gap-2">
              {showCompleteBeginnerConfirm ? (
                <button
                  type="button"
                  onClick={handleConfirmCompleteBeginner}
                  data-confirm-button="true"
                  className="h-8 rounded border-2 border-[#bb6666] bg-transparent px-2 text-sm text-white shadow-lg transition hover:border-[#ca7a7a] hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-white"
                >
                  Confirm
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowCompleteBeginnerConfirm(true)}
                className="h-8 w-8 cursor-pointer rounded border-2 border-[#bb6666] bg-transparent shadow-lg transition hover:border-[#ca7a7a] hover:bg-[rgba(202,122,122,0.08)]"
              >
                <span className="sr-only">Complete Beginner</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Complete Inter:</span>
            <div className="flex items-center gap-2">
              {showCompleteIntermediateConfirm ? (
                <button
                  type="button"
                  onClick={handleConfirmCompleteIntermediate}
                  data-confirm-button="true"
                  className="h-8 rounded border-2 border-[#bb6666] bg-transparent px-2 text-sm text-white shadow-lg transition hover:border-[#ca7a7a] hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-white"
                >
                  Confirm
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowCompleteIntermediateConfirm(true)}
                className="h-8 w-8 cursor-pointer rounded border-2 border-[#bb6666] bg-transparent shadow-lg transition hover:border-[#ca7a7a] hover:bg-[rgba(202,122,122,0.08)]"
              >
                <span className="sr-only">Complete Inter</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl text-shadow-lg">Complete Advanced:</span>
            <div className="flex items-center gap-2">
              {showCompleteAdvancedConfirm ? (
                <button
                  type="button"
                  onClick={handleConfirmCompleteAdvanced}
                  data-confirm-button="true"
                  className="h-8 rounded border-2 border-[#bb6666] bg-transparent px-2 text-sm text-white shadow-lg transition hover:border-[#ca7a7a] hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-white"
                >
                  Confirm
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowCompleteAdvancedConfirm(true)}
                className="h-8 w-8 cursor-pointer rounded border-2 border-[#bb6666] bg-transparent shadow-lg transition hover:border-[#ca7a7a] hover:bg-[rgba(202,122,122,0.08)]"
              >
                <span className="sr-only">Complete Advanced</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/Home"
          className="bg-white text-shadow-lg shadow-lg w-full text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer"
        >
          <span>{'<-'}</span> <span className="ml-1">Back</span>
        </Link>
      </div>
    </div>
  );
}

export default OptionsPage;
