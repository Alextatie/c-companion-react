'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const unityColorMap: Record<string, string> = {
  red: '#ff6565',
  green: '#34d356',
  blue: '#6d94ff',
  white: '#ffffff',
  black: '#222222',
};

const toUnityHtml = (text: string) => {
  const tokenized = text
    .replace(/<size=\d+>/gi, '')
    .replace(/<\/size>/gi, '')
    .replace(/<color=([^>]+)>/gi, (_, rawColor: string) => {
      return `@@COLOR_OPEN:${rawColor.trim()}@@`;
    })
    .replace(/<\/color>/gi, '@@COLOR_CLOSE@@');

  const escaped = tokenized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/@@COLOR_OPEN:([^@]+)@@/gi, (_, rawColor: string) => {
      const key = rawColor.trim().toLowerCase();
      const color = key.startsWith('#') ? key : unityColorMap[key] ?? key;
      return `<span style="color:${color}">`;
    })
    .replace(/@@COLOR_CLOSE@@/gi, '</span>')
    .replace(/\r?\n/g, '<br/>');
};

function UnityRichText({ text, className }: { text: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: toUnityHtml(text) }} />;
}

type SectionPage = {
  kind: 'sections';
  title: string;
  sections: Array<{ heading: string; body: string[] }>;
};

type CodePage = {
  kind: 'code';
  title: string;
  code: string;
  body: string[];
};

type LessonPageData = SectionPage | CodePage;

const lessonPages: LessonPageData[] = [
  {
    kind: 'sections',
    title: '',
    sections: [
      {
        heading: 'What is C?',
        body: [
          '<color=green>C<color=white> is a general-purpose programming language created by Dennis Ritchie at Bell Labs in <color=green>1972<color=white>.',
          'It is still very popular, and one of the main reasons is that it is a foundational language in computer science.',
        ],
      },
      {
        heading: 'Why learn C?',
        body: [
          '- It is one of the most popular programming languages in the world.',
          '- If you know <color=green>C<color=white>, learning <color=green>Java<color=white>, <color=green>Python<color=white>, <color=green>C++<color=white>, and <color=green>C#<color=white> becomes easier because many core ideas and syntax are similar.',
          '- <color=green>C<color=white> is also very fast compared to many higher-level languages.',
        ],
      },
    ],
  },
  {
    kind: 'code',
    title: 'Basic syntax that you will write in every program.',
    code:
      '#include <stdio.h>\n\n<color=blue>int <color=black>main() {\n  printf(<color=red>"Hello World!"<color=black>);\n  <color=blue>return <color=red>0<color=black>;\n}',
    body: [
      '<color=black>Line 1: <color=red>#include <stdio.h><color=white> lets us use built-in functions such as <color=red>printf()<color=white>.',
      '<color=black>Line 3: <color=red>main()<color=white> is the main function. Code inside <color=red>{ }<color=white> is executed.',
      '<color=black>Line 4: <color=red>printf()<color=white> prints text to the screen. In this example it prints "Hello World!".',
      '<color=black>Line 5: <color=red>return 0<color=white> ends the <color=red>main()<color=white> function.',
    ],
  },
];

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === lessonPages.length - 1;
  const currentPage = lessonPages[pageIndex];

  const onBack = () => {
    if (isFirstPage) {
      router.push('/learn');
      return;
    }
    setPageIndex((prev) => prev - 1);
  };

  const onNextOrFinish = () => {
    if (!isLastPage) {
      setPageIndex((prev) => prev + 1);
      return;
    }
    router.push('/learn');
  };

  return (
    <div className="lesson-selectable flex flex-col items-center justify-center min-h-screen -mt-12 text-white text-center px-4 pt-30">
      <h1 className="text-5xl text-shadow-lg font-bold mb-8">Basics</h1>

      <div className="relative w-full max-w-4xl">
        <Link
          href="/"
          className="no-select absolute -top-[4.6rem] left-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white text-[#8fd89a] shadow-lg hover:bg-[rgb(214,232,220)] transition"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.5V21h13V9.5" />
            <path d="M10 21v-6h4v6" />
          </svg>
          <span className="sr-only">Home</span>
        </Link>

        <section className="w-full rounded-2xl bg-black/20 p-6 md:p-8 shadow-lg backdrop-blur-[1px]">
          {currentPage.kind === 'sections' ? (
            <div className="space-y-8 text-center text-xl leading-relaxed">
              {currentPage.sections.map((section) => (
                <div key={section.heading} className="space-y-3">
                  <h3 className="text-6xl font-light text-[#dafad9]">{section.heading}</h3>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>
                      <UnityRichText text={paragraph} />
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <p className="text-xl font-normal leading-relaxed">{currentPage.title}</p>
              <div className="w-full max-w-115 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-lg">
                <div className="grid grid-cols-[20px_1fr]">
                  <div className="bg-[#3c4455] text-[#c2c7d1] text-[17px] leading-7 py-4 select-none">
                    {currentPage.code.split('\n').map((_, index) => (
                      <div key={`ln-${index}`} className="text-center font-mono">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="text-slate-900 text-[17px] leading-7 py-4 px-4 font-mono overflow-x-auto">
                    {currentPage.code.split('\n').map((line, index) => (
                      <div key={`code-${index}`} className="whitespace-pre">
                        <UnityRichText text={line || ' '} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-xl leading-relaxed">
                {currentPage.body.map((paragraph) => (
                  <p key={paragraph}>
                    <UnityRichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="mt-[2.5rem] flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-white text-shadow-lg shadow-lg text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer"
          >
            <span>{'<-'}</span>
            <span className="ml-1">Back</span>
          </button>

          <button
            type="button"
            onClick={onNextOrFinish}
            className={`bg-white text-shadow-lg shadow-lg text-[#3d7f80] text-lg py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer ${
              isLastPage ? 'px-2.5' : 'px-3'
            }`}
          >
            <span>{isLastPage ? 'Finish Lesson' : 'Next'}</span>
            {!isLastPage && <span className="ml-1">{'->'}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
