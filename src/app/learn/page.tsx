'use client';

import { useState } from 'react';
import Link from 'next/link';

function LearnPage() {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const difficultyOrder = ['beginner', 'intermediate', 'advanced'] as const;

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

          <div className={`flex h-[52px] w-[184px] items-center justify-center rounded px-4 text-2xl text-white shadow-lg ${difficultyPanelClass}`}>
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
          {lessons[difficulty].map((lesson, index) => (
            <Link
              key={index}
              href={`/learn/${lesson.slug}`}
              className="flex items-center justify-between bg-[rgb(86,116,145)] px-4 py-2 text-2xl text-white text-shadow-lg shadow-lg rounded hover:bg-[rgb(68,96,123)] transition"
            >
              <span className="text-left">{`${index + 1}) ${lesson.title}`}</span>
              <span className="text-right">[ ]</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-12">
        <Link
          href="/"
          className="bg-white text-shadow-lg shadow-lg w-full text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer"
        >
          <span>{'<-'}</span> <span className="ml-1">Back</span>
        </Link>
      </div>

    </div>
  );
}

export default LearnPage;



