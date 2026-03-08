'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const applyDarkMode = (enabled: boolean) => {
  const html = document.documentElement;
  const body = document.body;

  if (enabled) {
    html.setAttribute('data-dark-mode', 'on');
    body.setAttribute('data-dark-mode', 'on');
    document.cookie = 'dark-mode=on; path=/; max-age=31536000; samesite=lax';
    html.setAttribute('data-bg-anim', 'off');
    body.setAttribute('data-bg-anim', 'off');
    document.cookie = 'bg-anim=off; path=/; max-age=31536000; samesite=lax';
  } else {
    html.setAttribute('data-dark-mode', 'off');
    body.setAttribute('data-dark-mode', 'off');
    document.cookie = 'dark-mode=off; path=/; max-age=31536000; samesite=lax';
  }
};

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

function OptionsPage() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.getAttribute('data-dark-mode') === 'on';
    const isAnimationOff = document.documentElement.getAttribute('data-bg-anim') === 'off';
    setDarkModeEnabled(isDarkMode);
    setAnimationEnabled(!isAnimationOff);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-25 text-white text-center px-4 pt-30">
      <h1 className="text-5xl text-shadow-lg font-bold mb-5">Options</h1>

      <div className="w-full max-w-[440px] mx-auto p-2 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl text-shadow-lg">Dark Mode:</span>
          <button
            type="button"
            role="checkbox"
            aria-checked={darkModeEnabled}
            onClick={() => {
              const next = !darkModeEnabled;
              setDarkModeEnabled(next);
              applyDarkMode(next);
              if (next) {
                setAnimationEnabled(false);
              }
            }}
            className={`w-8 h-8 rounded border-2 shadow-lg transition cursor-pointer flex items-center justify-center text-xl font-bold ${
              darkModeEnabled
                ? 'bg-transparent text-white border-white'
                : 'bg-transparent text-transparent border-white'
            }`}
          >
            {darkModeEnabled ? '\u2713' : ''}
          </button>
        </div>

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
          <span className="text-2xl text-shadow-lg">Reset Progress:</span>
          <span className="text-xl text-shadow-lg">[WIP]</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl text-shadow-lg">Change Username:</span>
          <span className="text-xl text-shadow-lg">[WIP]</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl text-shadow-lg">Disable Hints:</span>
          <span className="text-xl text-shadow-lg">[WIP]</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl text-shadow-lg">Disable Sound:</span>
          <span className="text-xl text-shadow-lg">[WIP]</span>
        </div>
      </div>

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

export default OptionsPage;


