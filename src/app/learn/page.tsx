'use client';

import { useState } from 'react';
import Link from 'next/link';

function LearnPage() {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

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
      { title: 'Memory Management', slug: 'memory-management' },
    ]
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20 text-white text-center px-4 pt-30">

      {/* Title */}
      <div className="text-5xl text-shadow-lg font-bold mb-5">
        Lessons
      </div>

      <div className="inline-flex flex-col items-stretch">
        {/* Difficulty Buttons */}
        <div className="flex gap-2 mb-0">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 text-2xl rounded shadow-lg transition
                ${
                  difficulty === level
                    ? 'bg-white text-[rgb(86,116,145)]'
                    : 'bg-[rgb(86,116,145)] hover:bg-[rgb(68,96,123)]'
                }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Lessons */}
        <div className="w-full py-4 flex flex-col gap-2">
          {lessons[difficulty].map((lesson, index) => (
            <Link
              key={index}
              href={`/learn/${lesson.slug}`}
              className="bg-[rgb(86,116,145)] text-shadow-lg shadow-lg text-white text-2xl py-2 rounded text-center hover:bg-[rgb(68,96,123)] transition"
            >
              {lesson.title}
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



