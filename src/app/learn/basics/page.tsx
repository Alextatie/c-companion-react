'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { EmptyLine, Tone } from '@/components/lesson/text';
import { CodeEditor, HomeButton, LessonBackButton, LessonNextButton } from '@/components/lesson/ui';

type SectionPage = {
  kind: 'sections';
  title: string;
  sections: Array<{ heading: string; body: ReactNode[] }>;
};

type CodePage = {
  kind: 'code';
  title: string;
  code: ReactNode[];
  body: ReactNode[];
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
          <>
            <Tone color="green">C</Tone> is a general-purpose programming language created by Dennis Ritchie
            <br/>
            at the Bell Laboratories in <Tone color="green">1972</Tone>.
          </>,
          'It is a very popular language, despite being old. The main reason for its popularity is because it is a fundamental language in the field of computer science.',
        ],
      },
      {
        heading: 'Why learn C?',
        body: [
          '- It is one of the most popular programming languages in the world.',
          <>
            - If you know <Tone color="green">C</Tone>, learning <Tone color="green">Java</Tone>,{' '}
            <Tone color="green">Python</Tone>, <Tone color="green">C++</Tone>, and <Tone color="green">C#</Tone>{' '}
            becomes easier because many core ideas and syntax are similar.
          </>,
          <>
            - <Tone color="green">C</Tone> is also very fast compared to many higher-level languages.
          </>,
        ],
      },
    ],
  },
  {
    kind: 'code',
    title: 'Basic syntax that you will write in every program.',
    code: [
      '#include <stdio.h>',
      <EmptyLine />,
      <>
        <Tone color="blue">int </Tone>
        <Tone color="dark">main() {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"Hello World!"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">return </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '}',
    ],
    body: [
      <>
        <Tone color="dark">Line 1: </Tone>
        <Tone color="red">#include {'<stdio.h>'}</Tone> lets us use built-in functions such as{' '}
        <Tone color="red">printf()</Tone>.
      </>,
      <>
        <Tone color="dark">Line 3: </Tone>
        <Tone color="red">main()</Tone> is the main function. Code inside <Tone color="red">{'{ }'}</Tone> is
        executed.
      </>,
      <>
        <Tone color="dark">Line 4: </Tone>
        <Tone color="red">printf()</Tone> prints text to the screen. In this example it prints "Hello World!".
      </>,
      <>
        <Tone color="dark">Line 5: </Tone>
        <Tone color="red">return 0</Tone> ends the <Tone color="red">main()</Tone> function.
      </>,
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
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="Basics">
      <div className="relative w-[1090px] max-w-none">
        <HomeButton />

        <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
          {currentPage.kind === 'sections' ? (
            <div className="space-y-8 text-center text-xl leading-relaxed">
              {currentPage.sections.map((section) => (
                <div key={section.heading} className="space-y-3">
                  <h3 className="text-6xl font-light text-[#dafad9]">{section.heading}</h3>
                  {section.body.map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-left">
              <p className="text-xl font-normal leading-relaxed">{currentPage.title}</p>
              <div className="w-full">
                <CodeEditor code={currentPage.code} lineStart={1} activeLineIndex={-1} />
              </div>
              <div className="space-y-3 text-xl leading-relaxed">
                {currentPage.body.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="mt-[2.5rem] flex items-center justify-between">
          <LessonBackButton onClick={onBack} />
          <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
        </div>
      </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LessonPage;
