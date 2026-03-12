'use client';

import Link from 'next/link';
import { useState } from 'react';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';

function CodeFixerPage() {
  const [showDifficulty, setShowDifficulty] = useState(false);

  return (
    <div className="h-screen overflow-hidden px-[50px] py-[50px] text-white">
      <ScaledLessonFrame baseWidth={760}>
        <div className="mx-auto w-[760px] text-center">
          <h1 className="mb-5 mt-[2.7rem] text-5xl font-bold text-shadow-lg">Code Fixer</h1>

          <p className="mt-3 text-[41px] leading-tight">
            You have <span className="text-[#ff6565]">2 minutes</span> to fix as many
            <br />
            <span className="text-[#ff6565]">code segments</span> as you can.
          </p>

          <p className="mt-2 text-[58px] leading-none font-semibold">Ready?</p>

          <div className="mx-auto mt-3 w-[245px]">
            {!showDifficulty ? (
              <button
                type="button"
                onClick={() => setShowDifficulty(true)}
                className="h-[95px] w-full rounded-sm bg-[rgb(86,116,145)] text-[71px] leading-none text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(68,96,123)]"
              >
                Play
              </button>
            ) : (
              <div className="space-y-[2px]">
                <button type="button" className="h-[58px] w-full rounded-none bg-[#8fd949] text-[56px] leading-none text-white">
                  Easy
                </button>
                <button type="button" className="h-[58px] w-full rounded-none bg-[#d3b93a] text-[56px] leading-none text-white">
                  Medium
                </button>
                <button type="button" className="h-[58px] w-full rounded-none bg-[#d85b5b] text-[56px] leading-none text-white">
                  Hard
                </button>
              </div>
            )}
          </div>

          <Link
            href="/play"
            className="mt-6 inline-flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
          >
            <span>{'<-'}</span>
            <span className="ml-1">Back</span>
          </Link>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default CodeFixerPage;
