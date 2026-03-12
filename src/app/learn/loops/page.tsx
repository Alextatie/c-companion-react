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
  const isLastPage = pageIndex === 5;

  const [output1, setOutput1] = useState<ReactNode[]>([<EmptyLine key="loops-o1" />]);
  const [output2, setOutput2] = useState<ReactNode[]>([<EmptyLine key="loops-o2" />]);
  const [output3, setOutput3] = useState<ReactNode[]>([<EmptyLine key="loops-o3" />]);
  const [output4, setOutput4] = useState<ReactNode[]>([<EmptyLine key="loops-o4" />]);
  const [output5, setOutput5] = useState<ReactNode[]>([<EmptyLine key="loops-o5" />]);
  const [output6, setOutput6] = useState<ReactNode[]>([<EmptyLine key="loops-o6" />]);

  const [fillInit, setFillInit] = useState('');
  const [fillCondition, setFillCondition] = useState('');
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

  const page1Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>i = </span>
        <Tone color="red">0</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">while </Tone>
        <Tone color="dark">(i &lt; </Tone>
        <Tone color="red">5</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"%d\n"</Tone>, i);
      </>,
      '  i++;',
      '}',
    ],
    []
  );

  const page2Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>i = </span>
        <Tone color="red">0</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">do </Tone>
        <Tone color="dark">{'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"%d\n"</Tone>, i);
      </>,
      '  i++;',
      <>
        {'} '}
        <Tone color="blue">while </Tone>
        <Tone color="dark">(i &lt; </Tone>
        <Tone color="red">5</Tone>
        <Tone color="dark">);</Tone>
      </>,
    ],
    []
  );

  const page4Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>i;</span>
      </>,
      <>
        <Tone color="blue">for </Tone>
        <Tone color="dark">(i = </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">; i &lt; </Tone>
        <Tone color="red">5</Tone>
        <Tone color="dark">; i++) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"%d\n"</Tone>, i);
      </>,
      '}',
      <EmptyLine key="loops-empty-4" />,
    ],
    []
  );

  const page5Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>i, j;</span>
      </>,
      <EmptyLine key="loops-empty-5a" />,
      <Tone color="green">// outer loop</Tone>,
      <>
        <Tone color="blue">for </Tone>
        <Tone color="dark">(i = </Tone>
        <Tone color="red">1</Tone>
        <Tone color="dark">; i &lt;= </Tone>
        <Tone color="red">3</Tone>
        <Tone color="dark">; i++) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"Outer: %d\n"</Tone>, i);
      </>,
      <Tone color="green">  // inner loop</Tone>,
      <>
        {'  '}
        <Tone color="blue">for </Tone>
        <Tone color="dark">(j = </Tone>
        <Tone color="red">1</Tone>
        <Tone color="dark">; j &lt;= </Tone>
        <Tone color="red">3</Tone>
        <Tone color="dark">; j++) {'{'}</Tone>
      </>,
      <>
        {'    '}printf(<Tone color="red">" Inner: %d\n"</Tone>, j);
      </>,
      '  }',
      '}',
    ],
    []
  );

  const page6CodeA = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>i;</span>
      </>,
      <EmptyLine key="loops-empty-6a" />,
      <>
        <Tone color="blue">for </Tone>
        <Tone color="dark">(i = </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">; i &lt; </Tone>
        <Tone color="red">9</Tone>
        <Tone color="dark">; i++) {'{'}</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">if </Tone>
        <Tone color="dark">(i == </Tone>
        <Tone color="red">5</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">break</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '  }',
      <>
        {'  '}printf(<Tone color="red">"%d\n"</Tone>, i);
      </>,
      '}',
    ],
    []
  );

  const page6CodeB = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>i;</span>
      </>,
      <EmptyLine key="loops-empty-6b" />,
      <>
        <Tone color="blue">for </Tone>
        <Tone color="dark">(i = </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">; i &lt; </Tone>
        <Tone color="red">9</Tone>
        <Tone color="dark">; i++) {'{'}</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">if </Tone>
        <Tone color="dark">(i == </Tone>
        <Tone color="red">5</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'    '}
        <Tone color="blue">continue</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '  }',
      <>
        {'  '}printf(<Tone color="red">"%d\n"</Tone>, i);
      </>,
      '}',
    ],
    []
  );

  const runPage1 = () => {
    setOutput1([
      <Tone key="loops-1-0" color="white">0</Tone>,
      <Tone key="loops-1-1" color="white">1</Tone>,
      <Tone key="loops-1-2" color="white">2</Tone>,
      <Tone key="loops-1-3" color="white">3</Tone>,
      <Tone key="loops-1-4" color="white">4</Tone>,
    ]);
  };

  const runPage2 = () => {
    setOutput2([
      <Tone key="loops-2-0" color="white">0</Tone>,
      <Tone key="loops-2-1" color="white">1</Tone>,
      <Tone key="loops-2-2" color="white">2</Tone>,
      <Tone key="loops-2-3" color="white">3</Tone>,
      <Tone key="loops-2-4" color="white">4</Tone>,
    ]);
  };

  const runPage3 = () => {
    const initOk = fillInit.trim() === '5';
    const normalized = fillCondition.replace(/\s+/g, '');
    const conditionOk = normalized === 'i>0' || normalized === 'i>=1';

    if (initOk && conditionOk) {
      setOutput3([
        <Tone key="loops-3-5" color="white">5</Tone>,
        <Tone key="loops-3-4" color="white">4</Tone>,
        <Tone key="loops-3-3" color="white">3</Tone>,
        <Tone key="loops-3-2" color="white">2</Tone>,
        <Tone key="loops-3-1" color="white">1</Tone>,
      ]);
      setPage3Result([<Tone key="loops-3-correct" color="green">Correct!</Tone>]);
      return;
    }

    setOutput3([<Tone key="loops-3-error" color="red">Error!</Tone>]);
    setPage3Result([<Tone key="loops-3-wrong" color="red">Wrong!</Tone>]);
  };

  const runPage4 = () => {
    setOutput4([
      <Tone key="loops-4-0" color="white">0</Tone>,
      <Tone key="loops-4-1" color="white">1</Tone>,
      <Tone key="loops-4-2" color="white">2</Tone>,
      <Tone key="loops-4-3" color="white">3</Tone>,
      <Tone key="loops-4-4" color="white">4</Tone>,
    ]);
  };

  const runPage5 = () => {
    setOutput5([
      <Tone key="loops-5-1" color="white">Outer: 1</Tone>,
      <Tone key="loops-5-2" color="white"> Inner: 1</Tone>,
      <Tone key="loops-5-3" color="white"> Inner: 2</Tone>,
      <Tone key="loops-5-4" color="white"> Inner: 3</Tone>,
      <Tone key="loops-5-5" color="white">Outer: 2</Tone>,
      <Tone key="loops-5-6" color="white"> Inner: 1</Tone>,
      <Tone key="loops-5-7" color="white"> Inner: 2</Tone>,
      <Tone key="loops-5-8" color="white"> Inner: 3</Tone>,
      <Tone key="loops-5-9" color="white">Outer: 3</Tone>,
      <Tone key="loops-5-10" color="white"> Inner: 1</Tone>,
      <Tone key="loops-5-11" color="white"> Inner: 2</Tone>,
      <Tone key="loops-5-12" color="white"> Inner: 3</Tone>,
    ]);
  };

  const runPage6Break = () => {
    setOutput6([
      <Tone key="loops-6b-0" color="white">0</Tone>,
      <Tone key="loops-6b-1" color="white">1</Tone>,
      <Tone key="loops-6b-2" color="white">2</Tone>,
      <Tone key="loops-6b-3" color="white">3</Tone>,
      <Tone key="loops-6b-4" color="white">4</Tone>,
    ]);
  };

  const runPage6Continue = () => {
    setOutput6([
      <Tone key="loops-6c-0" color="white">0</Tone>,
      <Tone key="loops-6c-1" color="white">1</Tone>,
      <Tone key="loops-6c-2" color="white">2</Tone>,
      <Tone key="loops-6c-3" color="white">3</Tone>,
      <Tone key="loops-6c-4" color="white">4</Tone>,
      <Tone key="loops-6c-6" color="white">6</Tone>,
      <Tone key="loops-6c-7" color="white">7</Tone>,
      <Tone key="loops-6c-8" color="white">8</Tone>,
    ]);
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1125} title="Loops">
        <div className="relative w-[1125px] max-w-none">
          <HomeButton />

          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">
                  <Tone color="red">Loops</Tone> can repeatedly execute a block of code as long
                  <br />
                  as a specified condition is met.
                </p>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[430px] shrink-0 space-y-2">
                    <h2 className="text-[31px] leading-none underline underline-offset-4">While Loop</h2>
                    <p className="text-[19px] leading-tight">
                      Loops throught a block of code as long as a specified
                      <br />
                      condition is <Tone color="red">true</Tone>:
                    </p>
                    <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                    <div className="w-[270px] rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                      <div>
                        <Tone color="blue">while </Tone>
                        <span>(condition) {'{'}</span>
                      </div>
                      <div>
                        <Tone color="green">// code to be executed</Tone>
                      </div>
                      <div>{'}'}</div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[19px] leading-tight">For example:</p>
                      <LessonChip text="Input" />
                      <div className="relative w-[330px]">
                        <CodeEditor code={page1Code} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[330px] shrink-0 pt-[5.1rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output1} minHeightClass="min-h-[170px]" />
                  </div>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="space-y-3 text-left">
                <h2 className="text-[31px] leading-none underline underline-offset-4">Do/While Loop</h2>
                <p className="text-[19px] leading-tight">
                  A variant of the <Tone color="red">while</Tone> loop that first executes the code <Tone color="red">once</Tone>
                  <br />
                  without checking the condition, and then it will repeat the loop
                  <br />
                  like a normal <Tone color="red">while</Tone> loop, checking the condition as usual.
                </p>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[430px] shrink-0 space-y-2">
                    <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                    <div className="w-[270px] rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                      <div>
                        <Tone color="blue">do </Tone>
                        <span>{'{'}</span>
                      </div>
                      <div>
                        <Tone color="green">// code to be executed</Tone>
                      </div>
                      <div>
                        {'} '}
                        <Tone color="blue">while </Tone>
                        <span>(condition);</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[19px] leading-tight">For example:</p>
                      <LessonChip text="Input" />
                      <div className="relative w-[330px]">
                        <CodeEditor code={page2Code} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage2} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[330px] shrink-0 pt-[4.7rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output2} minHeightClass="min-h-[170px]" />
                  </div>
                </div>
              </div>
            ) : pageIndex === 2 ? (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">
                  Fill in the blanks so that the code will output
                  <br />
                  the following text:
                </p>

                <div className="flex items-start gap-10">
                  <div className="w-[330px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-[#3c4455] shadow-lg">
                      <div className="grid grid-cols-[20px_1fr]">
                        <div className="select-none bg-[#3c4455] py-1 text-[17px] leading-7 text-[#c2c7d1]">
                          {[1, 2, 3, 4, 5].map((line) => (
                            <div key={line} className="text-center font-mono">
                              {line}
                            </div>
                          ))}
                        </div>
                        <div className="bg-white px-1 py-1 font-mono text-[17px] leading-7 text-slate-900">
                          <div className="flex items-center whitespace-pre">
                            <Tone color="blue">int </Tone>
                            <span>i = </span>
                            <input
                              value={fillInit}
                              onChange={(e) => setFillInit(e.target.value)}
                              className="h-8 w-[2.2ch] rounded border border-slate-300 bg-white px-1 text-[16px] text-slate-900"
                            />
                            <Tone color="dark">;</Tone>
                          </div>
                          <div className="flex items-center whitespace-pre">
                            <Tone color="blue">while </Tone>
                            <Tone color="dark">(</Tone>
                            <input
                              value={fillCondition}
                              onChange={(e) => setFillCondition(e.target.value)}
                              className="h-8 w-[8ch] rounded border border-slate-300 bg-white px-1 text-[16px] text-slate-900"
                            />
                            <Tone color="dark">) {'{'}</Tone>
                          </div>
                          <div className="whitespace-pre">
                            {'  '}printf(<Tone color="red">"%d\n"</Tone>, i);
                          </div>
                          <div className="whitespace-pre">  i--;</div>
                          <div className="whitespace-pre">{'}'}</div>
                        </div>
                      </div>
                      <RunButton onClick={runPage3} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="w-[270px] shrink-0">
                    <LessonChip text="output" />
                    <OutputPanel lines={output3} minHeightClass="min-h-[138px]" />
                  </div>
                </div>

                <div className="ml-[560px] min-h-[1.5rem] text-[18px] leading-none">
                  {delayedPage3Result.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            ) : pageIndex === 3 ? (
              <div className="space-y-3 text-left">
                <div className="w-[520px] space-y-2">
                  <h2 className="text-[31px] leading-none underline underline-offset-4">For Loop</h2>
                  <p className="text-[19px] leading-tight">
                    Used when you know exactly how many times you want the
                    <br />
                    <Tone color="red">loop</Tone> to run.
                  </p>
                  <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                  <div className="w-[410px] rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                    <div>
                      <Tone color="blue">for </Tone>
                      <span>(initialization; condition; increment) {'{'}</span>
                    </div>
                    <div>
                      <Tone color="green">// code to be executed</Tone>
                    </div>
                    <div>{'}'}</div>
                  </div>
                  <div className="space-y-1 text-[19px] leading-tight">
                    <div>• <Tone color="red">Initialization</Tone>: executed once at the start</div>
                    <div>• <Tone color="red">Condition</Tone>: a condition for executing the code block</div>
                    <div>
                      • <Tone color="red">Increment</Tone>: executed every time after the code block
                      <br />
                      {'  '}has been executed (can also be a decrement)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-10">
                  <div className="w-[370px] shrink-0">
                    <p className="text-[19px] leading-tight">For example:</p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page4Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={runPage4} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="w-[270px] shrink-0 pt-[1.45rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output4} minHeightClass="min-h-[118px]" />
                  </div>
                </div>
              </div>
            ) : pageIndex === 4 ? (
              <div className="space-y-3 text-left">
                <h2 className="text-[31px] leading-none underline underline-offset-4">Nested Loops</h2>
                <p className="text-[19px] leading-tight">
                  It's possible to place a loop inside another loop.
                  <br />
                  This is called a <Tone color="red">nested loop</Tone>.
                  <br />
                  The <Tone color="red">"inner loop"</Tone> will be executed fully each
                  <br />
                  iteration of the <Tone color="red">"outer loop"</Tone>.
                </p>

                <div className="flex items-start gap-10">
                  <div className="w-[360px] shrink-0">
                    <p className="text-[19px] leading-tight">For example:</p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page5Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={runPage5} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="w-[350px] shrink-0 pt-[1.45rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output5} minHeightClass="min-h-[225px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[330px] shrink-0 space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-[31px] leading-none underline underline-offset-4">Break</h2>
                      <p className="text-[19px] leading-tight">
                        A statement used to <Tone color="red">terminate</Tone>
                        <br />
                        a loop <span className="text-[16px]">(as we laready seen in switch case)</span>
                      </p>
                      <p className="text-[19px] leading-tight">For example:</p>
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={page6CodeA} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage6Break} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[330px] shrink-0 space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-[31px] leading-none underline underline-offset-4">Continue</h2>
                      <p className="text-[19px] leading-tight">
                        A statement used to skip a
                        <br />
                        <Tone color="red">single iteration</Tone> of a loop
                      </p>
                      <p className="text-[19px] leading-tight">For example:</p>
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={page6CodeB} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage6Continue} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[310px] shrink-0 pt-[7.2rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output6} minHeightClass="min-h-[170px]" />
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.5rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <div className="flex items-center gap-1.5">
              {pageIndex === 2 && (
                <HintButton widthClass="w-[310px]">
                  <Tone color="blue">int </Tone>i = <Tone color="red">5</Tone>;
                  <br />
                  <Tone color="blue">while </Tone>(i &gt; <Tone color="red">0</Tone>) or <Tone color="blue">while </Tone>(i &gt;= <Tone color="red">1</Tone>)
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

