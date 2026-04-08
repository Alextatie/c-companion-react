'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/firebase/config';
import medalImage from '@/data/Medal.png';
import { LESSON_DEFINITIONS } from '@/lib/lesson-progress';

const DIFFICULTY_STORAGE_KEY = 'learn-difficulty';
const LESSON_FIELD_BY_SLUG = LESSON_DEFINITIONS.reduce<Record<string, string>>((acc, lesson) => {
  acc[lesson.slug] = lesson.field;
  return acc;
}, {});
const DARK_TROPHY_FILTER = 'brightness(0) saturate(100%)';

function LearnPage() {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [user] = useAuthState(auth);
  const [completedLessonFields, setCompletedLessonFields] = useState<Record<string, boolean>>({});
  const difficultyOrder = ['beginner', 'intermediate', 'advanced'] as const;

  useEffect(() => {
    const savedDifficulty = window.sessionStorage.getItem(DIFFICULTY_STORAGE_KEY);

    if (
      savedDifficulty === 'beginner' ||
      savedDifficulty === 'intermediate' ||
      savedDifficulty === 'advanced'
    ) {
      setDifficulty(savedDifficulty);
      return;
    }
    setDifficulty('beginner');
  }, []);

  useEffect(() => {
    if (!difficulty) {
      return;
    }
    window.sessionStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (!user || user.isAnonymous) {
      setCompletedLessonFields({});
      return;
    }

    let cancelled = false;
    getDoc(doc(db, 'stats', user.uid))
      .then((snap) => {
        if (cancelled || !snap.exists()) {
          return;
        }

        const data = snap.data() as Record<string, unknown>;
        const nextState: Record<string, boolean> = {};
        for (const lesson of LESSON_DEFINITIONS) {
          nextState[lesson.field] = data[lesson.field] === true;
        }
        setCompletedLessonFields(nextState);
      })
      .catch(() => {
        if (!cancelled) {
          setCompletedLessonFields({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!difficulty) {
    return null;
  }

  const lessons = {
    beginner: [
      { title: 'Basics', slug: 'basics' },
      { title: 'Output', slug: 'output' },
      { title: 'Comments', slug: 'comments' },
      { title: 'Variables', slug: 'variables' },
      { title: 'Booleans', slug: 'booleans' },
      { title: 'Operators', slug: 'operators' },
    ],
    intermediate: [
      { title: 'If... Else', slug: 'if-else' },
      { title: 'Switch Case', slug: 'switch-case' },
      { title: 'Loops', slug: 'loops' },
      { title: 'Arrays', slug: 'arrays' },
      { title: 'User Input', slug: 'user-input' },
      { title: 'Memory', slug: 'memory' },
    ],
    advanced: [
      { title: 'Functions', slug: 'functions' },
      { title: 'Recursion', slug: 'recursion' },
      { title: 'Structs', slug: 'structs' },
      { title: 'Enums', slug: 'enums' },
      { title: 'Files', slug: 'files' },
      { title: 'Memory', slug: 'memory-management' },
    ]
  };

  const difficultyPanelClass =
    difficulty === 'beginner'
      ? 'bg-[#8fd949]'
      : difficulty === 'intermediate'
        ? 'bg-[#d3b93a]'
        : 'bg-[#d85b5b]';

  const difficultyIndex = difficultyOrder.indexOf(difficulty);
  const lessonNumberOffset = difficulty === 'beginner' ? 0 : difficulty === 'intermediate' ? 6 : 12;
  const isGuestUser = !user || user.isAnonymous;

  const showPreviousDifficulty = () => {
    if (difficultyIndex === 0) {
      return;
    }
    setDifficulty(difficultyOrder[difficultyIndex - 1]);
  };

  const showNextDifficulty = () => {
    if (difficultyIndex === difficultyOrder.length - 1) {
      return;
    }
    setDifficulty(difficultyOrder[difficultyIndex + 1]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20 text-white text-center px-4 pt-30">

      {/* Title */}
      <div className="text-5xl text-shadow-lg font-bold mb-5">
        Lessons
      </div>

      <div className="inline-flex flex-col items-stretch">
        {/* Difficulty Selector */}
        <div className="mb-0 flex items-center gap-2">
          <button
            type="button"
            onClick={showPreviousDifficulty}
            disabled={difficultyIndex === 0}
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgb(86,116,145)] text-white shadow-lg transition ${
              difficultyIndex === 0 ? 'pointer-events-none cursor-default opacity-50' : 'hover:bg-[rgb(68,96,123)]'
            }`}
          >
            <span className="text-3xl leading-none">{'<'}</span>
          </button>

          <div className={`flex h-[52px] w-[184px] items-center justify-center rounded px-4 text-2xl text-white shadow-[0_2px_6px_rgba(0,0,0,0.55)] ${difficultyPanelClass}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>

          <button
            type="button"
            onClick={showNextDifficulty}
            disabled={difficultyIndex === difficultyOrder.length - 1}
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgb(86,116,145)] text-white shadow-lg transition ${
              difficultyIndex === difficultyOrder.length - 1
                ? 'pointer-events-none cursor-default opacity-50'
                : 'hover:bg-[rgb(68,96,123)]'
            }`}
          >
            <span className="text-3xl leading-none">{'>'}</span>
          </button>
        </div>

        {/* Lessons */}
        <div className="w-full py-4 flex flex-col gap-2">
          {lessons[difficulty].map((lesson, index) => {
            const lessonField = LESSON_FIELD_BY_SLUG[lesson.slug];
            const isCompleted = lessonField ? completedLessonFields[lessonField] === true : false;

            return (
              <Link
                key={index}
                href={`/learn/${lesson.slug}`}
                className="flex items-center justify-between bg-[rgb(86,116,145)] px-4 py-2 text-2xl text-white text-shadow-lg shadow-lg rounded hover:bg-[rgb(68,96,123)] transition"
              >
                <span className="text-left">{`${lessonNumberOffset + index + 1}) ${lesson.title}`}</span>
                <Image
                  src={medalImage}
                  alt="Lesson completion"
                  className={isCompleted ? 'h-[36px] w-[36px] object-contain opacity-100' : 'h-[36px] w-[36px] object-contain opacity-15'}
                  style={{ filter: isCompleted ? 'none' : DARK_TROPHY_FILTER }}
                />
              </Link>
            );
          })}
        </div>

        {isGuestUser ? (
          <div className="-mt-2 -mb-2 text-center text-sm text-white">Login to keep progress</div>
        ) : null}
      </div>

      {/* Back Button */}
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

export default LearnPage;
