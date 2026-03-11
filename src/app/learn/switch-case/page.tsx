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

  const [output2, setOutput2] = useState<ReactNode[]>([<EmptyLine key="switch-o2" />]);
  const [output3] = useState<ReactNode[]>([
    <Tone key="switch-o3" color="white">Monday</Tone>,
  ]);
  const [answer, setAnswer] = useState('');
  const [page3Result, setPage3Result] = useState<ReactNode[]>([]);
  const delayedPage3Result = useDelayedLessonValue<ReactNode[]>(page3Result, []);

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

  const page2Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>month = </span>
        <Tone color="red">3</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">switch </Tone>
        <Tone color="dark">(month) {'{'}</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">case </Tone>
        <Tone color="red">1</Tone>
        <Tone color="dark">:</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">"January"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">case </Tone>
        <Tone color="red">2</Tone>
        <Tone color="dark">:</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">"February"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">case </Tone>
        <Tone color="red">3</Tone>
        <Tone color="dark">:</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">"March"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '}',
    ],
    []
  );

  const page3Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>day = </span>
        <Tone color="yellow">??</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">switch </Tone>
        <Tone color="dark">(day) {'{'}</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">case </Tone>
        <Tone color="red">1</Tone>
        <Tone color="dark">:</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">"Sunday"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">case </Tone>
        <Tone color="red">2</Tone>
        <Tone color="dark">:</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">"Monday"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">case </Tone>
        <Tone color="red">3</Tone>
        <Tone color="dark">:</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">"Tuesday"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '}',
    ],
    []
  );

  const runPage2 = () => {
    setOutput2([<Tone key="switch-out-march" color="white">March</Tone>]);
  };

  const answerPage3 = () => {
    if (answer.trim() === '2') {
      setPage3Result([<Tone key="switch-correct" color="green">Correct!</Tone>]);
      return;
    }

    setPage3Result([<Tone key="switch-wrong" color="red">Wrong!</Tone>]);
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1110} title="Switch Case">
        <div className="relative w-[1110px] max-w-none">
          <HomeButton />

          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">
                  Instead of writing many <Tone color="red">if..else</Tone> statements, you can use
                  <br />
                  the <Tone color="red">switch</Tone> statement.
                </p>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[380px] shrink-0 space-y-1">
                    <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                    <div className="rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                      <div>
                        <Tone color="blue">switch </Tone>
                        <span>(expression) {'{'}</span>
                      </div>
                      <div>
                        {'  '}
                        <Tone color="blue">case </Tone>
                        <span>x:</span>
                      </div>
                      <div>
                        {'    '}
                        <Tone color="green">// code to be executed</Tone>
                      </div>
                      <div>
                        {'    '}
                        <Tone color="blue">break</Tone>;
                      </div>
                      <div>
                        {'  '}
                        <Tone color="blue">case </Tone>
                        <span>y:</span>
                      </div>
                      <div>
                        {'    '}
                        <Tone color="green">// code to be executed</Tone>
                      </div>
                      <div>
                        {'    '}
                        <Tone color="blue">break</Tone>;
                      </div>
                      <div>
                        {'  '}
                        <Tone color="blue">default</Tone>
                        <span>:</span>
                      </div>
                      <div>
                        {'    '}
                        <Tone color="green">// code to be executed</Tone>
                      </div>
                      <div>{'}'}</div>
                    </div>
                  </div>

                  <div className="w-[530px] shrink-0 pt-2">
                    <h2 className="text-[31px] leading-none underline underline-offset-4">How it works:</h2>
                    <div className="mt-2 space-y-1 text-[19px] leading-tight">
                      <div>• The switch <Tone color="red">expression</Tone> is evaluated once</div>
                      <div>
                        • The <Tone color="red">value</Tone> of the expression is compared with
                        <br />
                        {'  '}the values of each case until it finds a match
                      </div>
                      <div>
                        • If there is a <Tone color="red">match</Tone>, the associated block of
                        <br />
                        {'  '}code is executed
                      </div>
                      <div>
                        • The <Tone color="blue">break</Tone> statement breaks out of the switch
                        <br />
                        {'  '}block and stops the execution
                      </div>
                      <div>
                        • The <Tone color="blue">default</Tone> statement is optional, it's executed
                        <br />
                        {'  '}if there wasn't a match
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">Code example:</p>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[420px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page2Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={runPage2} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="w-[370px] shrink-0 pt-[4.8rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output2} minHeightClass="min-h-[140px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">Code example:</p>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[420px] shrink-0">
                    <LessonChip text="Input" />
                    <CodeEditor code={page3Code} lineStart={1} activeLineIndex={-1} />
                  </div>

                  <div className="w-[395px] shrink-0 pt-[0.15rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output3} minHeightClass="min-h-[62px]" />

                    <div className="mt-3 space-y-2">
                      <p className="text-[19px] leading-tight">
                        What was the value of
                        <br />
                        the variable <Tone color="red">day</Tone>?
                      </p>
                      <div className="flex items-center gap-1">
                        <input
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="h-8 w-[2.2ch] rounded border border-slate-300 bg-white px-1 text-[16px] text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={answerPage3}
                          className="rounded-sm bg-[#8fd949] px-2 py-1 text-[18px] leading-none text-white transition hover:bg-[#9ddf50] active:bg-[#adf758]"
                        >
                          Answer
                        </button>
                      </div>
                      <div className="min-h-[1.5rem] text-[18px] leading-none">
                        {delayedPage3Result.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.4rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <div className="flex items-center gap-1.5">
              {isLastPage && <HintButton widthClass="w-[120px]">2</HintButton>}
              <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
            </div>
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LessonPage;

