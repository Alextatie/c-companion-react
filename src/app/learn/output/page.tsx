'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { EmptyLine, Tone } from '@/components/lesson/text';
import {
  CodeEditor,
  HintButton,
  HomeButton,
  LessonBackButton,
  LessonChip,
  LessonNextButton,
  OutputPanel,
  RunButton,
  useDelayedLessonValue,
} from '@/components/lesson/ui';

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 2;

  const [Output_1, setOutput_1] = useState<ReactNode[]>([<EmptyLine key="o1-empty" />]);
  const [Output_2, setOutput_2] = useState<ReactNode[]>([<EmptyLine key="o2-empty" />]);
  const [missingFn, setMissingFn] = useState('');
  const [page2Result, setPage2Result] = useState<'correct' | 'wrong' | 'lowercase' | null>(null);
  const [Output_3, setOutput_3] = useState<ReactNode[]>([<EmptyLine key="o3-empty" />]);
  const [missingText, setMissingText] = useState('printf(Hello World!);');
  const [page3Result, setPage3Result] = useState<'correct' | 'wrong' | null>(null);
  const delayedPage2Result = useDelayedLessonValue(page2Result, null);
  const delayedPage3Result = useDelayedLessonValue(page3Result, null);

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
    []
  );

  const page1CodeB = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <Tone color="dark">main() {'{'}</Tone>
      </>,
      '  printf(Hello World!);',
      <>
        {'  '}
        <Tone color="blue">return </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '}',
    ],
    []
  );

  const page2Code = useMemo(
    () => [
      '#include <stdio.h>',
      <EmptyLine />,
      <>
        <Tone color="blue">int </Tone>
        <Tone color="dark">main() {'{'}</Tone>
      </>,
      null,
      <>
        {'  '}
        <Tone color="blue">return </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '}',
    ],
    []
  );

  const page1_input1 = () => setOutput_1([<Tone key="o1-correct" color="white">Hello World!</Tone>]);
  const page1_input2 = () => setOutput_1([<Tone key="o1-wrong" color="red">Error!</Tone>]);

  const page2_input1 = () => {
    if (missingFn === 'printf') {
      setOutput_2([<Tone key="o2-correct" color="white">Hello World!</Tone>]);
      setPage2Result('correct');
      return;
    }
    if (missingFn === 'Printf') {
      setOutput_2([<Tone key="o2-lowercase" color="red">Error!</Tone>]);
      setPage2Result('lowercase');
      return;
    }
    setOutput_2([<Tone key="o2-wrong" color="red">Error!</Tone>]);
    setPage2Result('wrong');
  };

  const page3_input1 = () => {
    if (missingText === 'printf("Hello World!");') {
      setOutput_3([<Tone key="o3-correct" color="white">Hello World!</Tone>]);
      setPage3Result('correct');
      return;
    }
    setOutput_3([<Tone key="o3-wrong" color="red">Error!</Tone>]);
    setPage3Result('wrong');
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1030} title="Output">
      <div className="relative w-[1030px] max-w-none">
        <HomeButton />

        <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
          {pageIndex === 0 ? (
            <div className="space-y-3 text-left">
              <p className="text-xl leading-relaxed">
                <>
                  To print a value or a message to the output screen,
                  <br />
                  you can use the <Tone color="red">print()</Tone> function.
                </>
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] shrink-0 space-y-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor code={page1CodeA} lineStart={1} />
                    <RunButton onClick={page1_input1} className="absolute bottom-2 right-3" />
                  </div>
                </div>

                <div className="w-[410px] shrink-0 space-y-0">
                  <LessonChip text="output" />
                  <OutputPanel lines={Output_1} minHeightClass="min-h-[178px]" />
                </div>
              </div>

              <p className="text-xl leading-relaxed">
                <>
                  When working with text, it must be wrapped inside
                  <br />
                  double quoatation marks <Tone color="red">""</Tone>.
                </>
              </p>

              <div className="w-[410px] shrink-0">
                <div className="space-y-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor code={page1CodeB} lineStart={3} />
                    <RunButton onClick={page1_input2} className="absolute bottom-2 right-3" />
                  </div>
                </div>
              </div>
            </div>
          ) : pageIndex === 1 ? (
            <div className="space-y-3 text-left">
              <p className="text-xl leading-relaxed">
                <>
                  Make the code bellow print <Tone color="red">Hello World!</Tone> on the screen.
                </>
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] shrink-0 space-y-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor
                      code={page2Code}
                      lineStart={1}
                      inputBefore={<span>{'  '}</span>}
                      inputAfter={
                        <>
                          <Tone color="dark">(</Tone>
                          <Tone color="red">"Hello World!"</Tone>
                          <Tone color="dark">);</Tone>
                        </>
                      }
                      rightSlot={
                        <input
                          value={missingFn}
                          onChange={(e) => setMissingFn(e.target.value)}
                          className="h-8 w-[7.2ch] rounded border border-slate-400 px-1.5 text-[16px] text-slate-900 bg-white"
                        />
                      }
                    />
                    <RunButton onClick={page2_input1} className="absolute bottom-2 right-3" />
                  </div>
                  <div className="mt-2 min-h-[3rem]">
                    {delayedPage2Result && (
                      <div className={`text-xl leading-none ${delayedPage2Result === 'correct' ? 'text-[#34d356]' : 'text-[#ff6565]'}`}>
                        {delayedPage2Result === 'correct'
                          ? 'Correct!'
                          : delayedPage2Result === 'lowercase'
                            ? 'Wrong! try lowercase'
                            : 'Wrong!'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-[410px] shrink-0 space-y-0">
                  <LessonChip text="output" />
                  <OutputPanel lines={Output_2} minHeightClass="min-h-[178px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              <p className="text-xl leading-relaxed">
                <>
                  The code bellow should print: <Tone color="red">Hello World!</Tone>
                  <br />
                  It isn't working. What's missing?
                </>
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] shrink-0 space-y-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor
                      code={[
                        '#include <stdio.h>',
                        <EmptyLine />,
                        <>
                          <Tone color="blue">int </Tone>
                          <Tone color="dark">main() {'{'}</Tone>
                        </>,
                        null,
                        <>
                          {'  '}
                          <Tone color="blue">return </Tone>
                          <Tone color="red">0</Tone>
                          <Tone color="dark">;</Tone>
                        </>,
                        '}',
                      ]}
                      lineStart={1}
                      inputBefore={<span>{'  '}</span>}
                      rightSlot={
                        <input
                          value={missingText}
                          onChange={(e) => setMissingText(e.target.value)}
                          className="h-8 w-[25ch] rounded border border-slate-400 px-1.5 text-[16px] text-slate-900 bg-white"
                        />
                      }
                    />
                    <RunButton onClick={page3_input1} className="absolute bottom-2 right-3" />
                  </div>
                  <div className="mt-2 min-h-[3rem]">
                    {delayedPage3Result && (
                      <div className={`text-xl leading-none ${delayedPage3Result === 'correct' ? 'text-[#34d356]' : 'text-[#ff6565]'}`}>
                        {delayedPage3Result === 'correct' ? 'Correct!' : 'Wrong!'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-[410px] shrink-0 space-y-0">
                  <LessonChip text="output" />
                  <OutputPanel lines={Output_3} minHeightClass="min-h-[178px]" />
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-[2.4rem] flex items-center justify-between">
          <LessonBackButton onClick={onBack} />

          <div className="flex items-center gap-1.5">
            {pageIndex > 0 && (
              <HintButton widthClass={pageIndex === 2 ? 'w-[330px]' : 'w-[238px]'}>
                {pageIndex === 1 ? (
                  <>
                    write <Tone color="red">printf</Tone>.
                  </>
                ) : (
                  <>
                    Add double quoatation
                    <br />
                    marks <Tone color="red">" "</Tone>, around <Tone color="red">Hello World</Tone>.
                  </>
                )}
              </HintButton>
            )}

            <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
          </div>
        </div>
      </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LessonPage;
