'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

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

function CodeEditor({
  code,
  lineStart = 1,
  rightSlot,
}: {
  code: string[];
  lineStart?: number;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-300 bg-white shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className="bg-[#3c4455] text-[#c2c7d1] text-[17px] leading-7 py-4 select-none">
          {code.map((_, index) => (
            <div key={`ln-${index}`} className="text-center font-mono">
              {lineStart + index}
            </div>
          ))}
        </div>
        <div className="text-slate-900 text-[17px] leading-7 py-4 px-4 font-mono overflow-x-auto">
          {code.map((line, index) => (
            <div key={`code-${index}`} className="whitespace-pre flex items-center">
              {index === 3 && rightSlot && line.includes('[[INPUT]]') ? (
                <span className="flex items-center">
                  {line.split('[[INPUT]]')[0] ? <UnityRichText text={line.split('[[INPUT]]')[0]} /> : null}
                  <span>{rightSlot}</span>
                  {line.split('[[INPUT]]')[1] ? <UnityRichText text={line.split('[[INPUT]]')[1]} /> : null}
                </span>
              ) : (
                <UnityRichText text={line || ' '} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutputPanel({ lines, minHeightClass = 'min-h-[170px]' }: { lines: string[]; minHeightClass?: string }) {
  return (
    <div className="output-select w-full rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg">
      <div className={`text-[17px] leading-7 py-4 px-4 font-mono ${minHeightClass}`}>
        {lines.map((line, idx) => (
          <div key={`${line}-${idx}`} className="whitespace-pre">
            <UnityRichText text={line || ' '} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 2;

  const [page1Output, setPage1Output] = useState<string[]>(['']);
  const [page2Output, setPage2Output] = useState<string[]>(['']);
  const [missingFn, setMissingFn] = useState('');
  const [page2Result, setPage2Result] = useState<'correct' | 'wrong' | 'lowercase' | null>(null);
  const [page3Output, setPage3Output] = useState<string[]>(['']);
  const [missingText, setMissingText] = useState('printf(Hello World!);');
  const [page3Result, setPage3Result] = useState<'correct' | 'wrong' | null>(null);

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

  const page1CodeA = useMemo(
    () => [
      '#include <stdio.h>',
      '',
      '<color=blue>int <color=black>main() {',
      '  printf(<color=red>"Hello World!"<color=black>);',
      '  <color=blue>return <color=red>0<color=black>;',
      '}',
    ],
    []
  );

  const page1CodeB = useMemo(
    () => [
      '<color=blue>int <color=black>main() {',
      '  printf(Hello World!);',
      '  <color=blue>return <color=red>0<color=black>;',
      '}',
    ],
    []
  );

  const page2Code = useMemo(
    () => [
      '#include <stdio.h>',
      '',
      '<color=blue>int <color=black>main() {',
      '  [[INPUT]](<color=red>"Hello World!"<color=black>);',
      '  <color=blue>return <color=red>0<color=black>;',
      '}',
    ],
    []
  );

  const page1_input1 = () => setPage1Output(['<color=white>Hello World!']);
  const page1_input2 = () => setPage1Output(['<color=red>Error!']);

  const page2_input1 = () => {
    if (missingFn === 'printf') {
      setPage2Output(['<color=white>Hello World!']);
      setPage2Result('correct');
      return;
    }
    if (missingFn === 'Printf') {
      setPage2Output(['<color=red>Error!']);
      setPage2Result('lowercase');
      return;
    }
    setPage2Output(['<color=red>Error!']);
    setPage2Result('wrong');
  };

  const page3_input1 = () => {
    if (missingText === 'printf("Hello World!");') {
      setPage3Output(['<color=white>Hello World!']);
      setPage3Result('correct');
      return;
    }
    setPage3Output(['<color=red>Error!']);
    setPage3Result('wrong');
  };

  return (
    <div className="lesson-selectable flex flex-col items-center justify-center min-h-screen -mt-12 text-white text-center px-4 pt-30">
      <h1 className="text-5xl text-shadow-lg font-bold mb-8">Output</h1>

      <div className="relative w-full max-w-5xl">
        <Link
          href="/"
          className="no-select absolute -top-[4.7rem] left-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white text-[#8fd89a] shadow-lg hover:bg-[rgb(214,232,220)] transition"
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
          {pageIndex === 0 ? (
            <div className="space-y-5 text-left">
              <p className="text-xl leading-relaxed">
                <UnityRichText text={'To print a value or a message to the output screen,\nyou can use the <color=red>print()<color=white> function.'} />
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">Input</div>
                  <div className="relative">
                    <CodeEditor code={page1CodeA} lineStart={1} />
                    <button
                      type="button"
                      onClick={page1_input1}
                      className="absolute bottom-2 right-3 bg-[#8fd949] text-white text-xl leading-none px-3 py-0.5 rounded-sm"
                    >
                      Run
                    </button>
                  </div>
                </div>

                <div className="w-[410px] space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">output</div>
                  <OutputPanel lines={page1Output} minHeightClass="min-h-[200px]" />
                </div>
              </div>

              <p className="text-xl leading-relaxed">
                <UnityRichText text={'When working with text, it must be wrapped inside\ndouble quoatation marks <color=red>""<color=white>.'} />
              </p>

              <div className="w-[410px]">
                <div className="space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">Input</div>
                  <div className="relative">
                    <CodeEditor code={page1CodeB} lineStart={3} />
                    <button
                      type="button"
                      onClick={page1_input2}
                      className="absolute bottom-2 right-3 bg-[#8fd949] text-white text-xl leading-none px-3 py-0.5 rounded-sm"
                    >
                      Run
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : pageIndex === 1 ? (
            <div className="space-y-5 text-left">
              <p className="text-xl leading-relaxed">
                <UnityRichText text={'Make the code bellow print <color=red>Hello World!<color=white> on the screen.'} />
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">Input</div>
                  <div className="relative">
                    <CodeEditor
                      code={page2Code}
                      lineStart={1}
                      rightSlot={
                        <input
                          value={missingFn}
                          onChange={(e) => setMissingFn(e.target.value)}
                          className="h-8 w-[7.2ch] rounded border border-slate-400 px-1.5 text-[16px] text-slate-900 bg-white"
                        />
                      }
                    />
                    <button
                      type="button"
                      onClick={page2_input1}
                      className="absolute bottom-2 right-3 bg-[#8fd949] text-white text-xl leading-none px-3 py-0.5 rounded-sm"
                    >
                      Run
                    </button>
                  </div>
                  <div className="mt-2 min-h-[3rem]">
                    {page2Result && (
                      <div className={`text-xl leading-none ${page2Result === 'correct' ? 'text-[#34d356]' : 'text-[#ff6565]'}`}>
                        {page2Result === 'correct' ? 'Correct!' : page2Result === 'lowercase' ? 'Wrong! try lowercase' : 'Wrong!'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-[410px] space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">output</div>
                  <OutputPanel lines={page2Output} minHeightClass="min-h-[204px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-left">
              <p className="text-xl leading-relaxed">
                <UnityRichText text={"The code bellow should print: <color=red>Hello World!<color=white>\nIt isn't working. What's missing?"} />
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">Input</div>
                  <div className="relative">
                    <CodeEditor
                      code={[
                        '#include <stdio.h>',
                        '',
                        '<color=blue>int <color=black>main() {',
                        '  [[INPUT]]',
                        '  <color=blue>return <color=red>0<color=black>;',
                        '}',
                      ]}
                      lineStart={1}
                      rightSlot={
                        <input
                          value={missingText}
                          onChange={(e) => setMissingText(e.target.value)}
                          className="h-8 w-[25ch] rounded border border-slate-400 px-1.5 text-[16px] text-slate-900 bg-white"
                        />
                      }
                    />
                    <button
                      type="button"
                      onClick={page3_input1}
                      className="absolute bottom-2 right-3 bg-[#8fd949] text-white text-xl leading-none px-3 py-0.5 rounded-sm"
                    >
                      Run
                    </button>
                  </div>
                  <div className="mt-2 min-h-[3rem]">
                    {page3Result && (
                      <div className={`text-xl leading-none ${page3Result === 'correct' ? 'text-[#34d356]' : 'text-[#ff6565]'}`}>
                        {page3Result === 'correct' ? 'Correct!' : 'Wrong!'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-[410px] space-y-0">
                  <div className="no-select inline-block bg-white/30 text-[#d8e8dc] text-[16px] leading-none px-2 py-[2px] rounded-sm">output</div>
                  <OutputPanel lines={page3Output} minHeightClass="min-h-[204px]" />
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-[2.4rem] flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-white text-shadow-lg shadow-lg text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer"
          >
            <span>{'<-'}</span>
            <span className="ml-1">Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            {pageIndex > 0 && (
              <div className="no-select relative group">
                <div
                  className={`pointer-events-none absolute bottom-[calc(100%+1.45rem)] right-0 rounded-sm bg-[#e7e7e7] px-3 py-2 text-left text-[16px] leading-tight text-[#5b5b5b] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ${
                    pageIndex === 2 ? 'w-[330px]' : 'w-[238px]'
                  }`}
                >
                  <div className="underline decoration-1 underline-offset-2">Solution:</div>
                  <div>
                    {pageIndex === 1 ? (
                      <>
                        write <span className="text-[#ff6565]">printf</span>.
                      </>
                    ) : (
                      <>
                        Add double quoatation
                        <br />
                        marks <span className="text-[#ff6565]">" "</span>, around <span className="text-[#ff6565]">Hello World</span>.
                      </>
                    )}
                  </div>
                  <div>&nbsp;</div>
                </div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded bg-[#d3b93a] text-[32px] leading-none text-[#e4f9d9]">
                  ?
                </div>
              </div>
            )}

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
    </div>
  );
}

export default LessonPage;
