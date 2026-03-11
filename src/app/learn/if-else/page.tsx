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

function InlineExerciseInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-[2.2ch] rounded border border-slate-300 bg-white px-1 text-[16px] text-slate-900"
    />
  );
}

function ExerciseRow({
  label,
  value,
  onChange,
  onRun,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[19px] leading-none">
        for <Tone color="red">{label}</Tone>:
      </p>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded bg-[#e5e5e5] px-2 py-1 text-[16px] text-slate-900 shadow-sm">
          <Tone color="blue">int</Tone>
          <span>num =</span>
          <InlineExerciseInput value={value} onChange={onChange} />
          <span>;</span>
        </div>
        <RunButton onClick={onRun} />
      </div>
    </div>
  );
}

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 4;

  const [output1, setOutput1] = useState<ReactNode[]>([<EmptyLine key="ifelse-1" />]);
  const [output2, setOutput2] = useState<ReactNode[]>([<EmptyLine key="ifelse-2" />]);
  const [output3, setOutput3] = useState<ReactNode[]>([<EmptyLine key="ifelse-3" />]);
  const [output4, setOutput4] = useState<ReactNode[]>([<EmptyLine key="ifelse-4" />]);
  const [output5, setOutput5] = useState<ReactNode[]>([<EmptyLine key="ifelse-5" />]);

  const [valueX, setValueX] = useState('');
  const [valueY, setValueY] = useState('');
  const [valueZ, setValueZ] = useState('');
  const [page5Result, setPage5Result] = useState<ReactNode[]>([]);

  const delayedPage5Result = useDelayedLessonValue<ReactNode[]>(page5Result, []);

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
      <>
        <Tone color="blue">if </Tone>
        <Tone color="dark">(</Tone>
        <Tone color="red">10 &gt; 5</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"10 is greater than 5"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      '}',
    ],
    []
  );

  const page1CodeB = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>x = </span>
        <Tone color="red">8</Tone>
        <span>, y = </span>
        <Tone color="red">7</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">if </Tone>
        <Tone color="dark">(x &gt; y) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"x is greater than y"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      '}',
    ],
    []
  );

  const page2Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>x = </span>
        <Tone color="red">8</Tone>
        <span>, y = </span>
        <Tone color="red">7</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">if </Tone>
        <Tone color="dark">(x &lt; y) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"x is greater than y"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        <Tone color="blue">else </Tone>
        <Tone color="dark">{'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"y is greater than x"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      '}',
    ],
    []
  );

  const page3Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>x = </span>
        <Tone color="red">8</Tone>
        <span>, y = </span>
        <Tone color="red">8</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">if </Tone>
        <Tone color="dark">(x &lt; y) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"x is greater than y"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        <Tone color="blue">else if </Tone>
        <Tone color="dark">(x &gt; y) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"y is greater than x"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        <Tone color="blue">else </Tone>
        <Tone color="dark">{'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"x and y are equal"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      '}',
    ],
    []
  );

  const page4CodeA = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>age = </span>
        <Tone color="red">26</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="blue">if </Tone>
        <Tone color="dark">(age &lt; 18) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"You are young"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        <Tone color="blue">else </Tone>
        <Tone color="dark">{'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"You are old"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      '}',
    ],
    []
  );

  const page4CodeB = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>age = </span>
        <Tone color="red">26</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <Tone color="dark">(age &lt; </Tone>
        <Tone color="red">18</Tone>
        <Tone color="dark">) ? printf(</Tone>
        <Tone color="red">"You are young"</Tone>
        <Tone color="dark">) : printf(</Tone>
        <Tone color="red">"You are old"</Tone>
        <Tone color="dark">);</Tone>
      </>,
    ],
    []
  );

  const page5Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>num = </span>
        <Tone color="yellow">??</Tone>
        <span>;</span>
      </>,
      <>
        <Tone color="blue">if </Tone>
        <Tone color="dark">(num &lt; </Tone>
        <Tone color="red">10</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"x"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        <Tone color="blue">else if </Tone>
        <Tone color="dark">(num &gt; </Tone>
        <Tone color="red">10</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"y"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      <>
        <Tone color="blue">else if </Tone>
        <Tone color="dark">(num == </Tone>
        <Tone color="red">10</Tone>
        <Tone color="dark">) {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"z"</Tone>
        <Tone color="dark">);</Tone>
      </>,
      '}',
    ],
    []
  );

  const runPage1A = () => setOutput1([<Tone key="ifelse-1-a" color="white">10 is greater than 5</Tone>]);
  const runPage1B = () => setOutput1([<Tone key="ifelse-1-b" color="white">x is greater than y</Tone>]);
  const runPage2 = () => setOutput2([<Tone key="ifelse-2-a" color="white">y is greater than x</Tone>]);
  const runPage3 = () => setOutput3([<Tone key="ifelse-3-a" color="white">x and y are equal</Tone>]);
  const runPage4A = () => setOutput4([<Tone key="ifelse-4-a" color="white">You are old</Tone>]);
  const runPage4B = () => setOutput4([<Tone key="ifelse-4-b" color="white">You are old</Tone>]);

  const runX = () => {
    const num = Number(valueX);
    if (valueX.trim() !== '' && Number.isFinite(num) && num < 10) {
      setOutput5([<Tone key="ifelse-5-x" color="white">x</Tone>]);
      setPage5Result([<Tone key="ifelse-rx" color="green">Correct!</Tone>]);
      return;
    }
    setOutput5([<Tone key="ifelse-5-xe" color="red">Error!</Tone>]);
    setPage5Result([<Tone key="ifelse-rxw" color="red">Wrong!</Tone>]);
  };

  const runY = () => {
    const num = Number(valueY);
    if (valueY.trim() !== '' && Number.isFinite(num) && num > 10) {
      setOutput5([<Tone key="ifelse-5-y" color="white">y</Tone>]);
      setPage5Result([<Tone key="ifelse-ry" color="green">Correct!</Tone>]);
      return;
    }
    setOutput5([<Tone key="ifelse-5-ye" color="red">Error!</Tone>]);
    setPage5Result([<Tone key="ifelse-ryw" color="red">Wrong!</Tone>]);
  };

  const runZ = () => {
    const num = Number(valueZ);
    if (valueZ.trim() !== '' && Number.isFinite(num) && num === 10) {
      setOutput5([<Tone key="ifelse-5-z" color="white">z</Tone>]);
      setPage5Result([<Tone key="ifelse-rz" color="green">Correct!</Tone>]);
      return;
    }
    setOutput5([<Tone key="ifelse-5-ze" color="red">Error!</Tone>]);
    setPage5Result([<Tone key="ifelse-rzw" color="red">Wrong!</Tone>]);
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1120} title="If... Else">
        <div className="relative w-[1120px] max-w-none">
          <HomeButton />

          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You've learned how to use conditions in C, such as <Tone color="red">a &gt; b</Tone> or <Tone color="red">x != y</Tone>.
                  <br />
                  Now you can use these conditions to preform different
                  <br />
                  actions based on if the statement is true or false.
                </p>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[515px] shrink-0 space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-[31px] leading-none underline underline-offset-4">
                        The <Tone color="red">if</Tone> Statement
                      </h2>
                      <p className="text-[19px] leading-tight">
                        Use the <Tone color="red">if</Tone> statement to execute a block of code if
                        <br />
                        a condition is <Tone color="red">true</Tone>:
                      </p>
                      <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">syntax:</div>
                      <div className="w-[250px] rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                        <div>
                          <Tone color="blue">if</Tone> (condition) {'{'}
                        </div>
                        <div>
                          <Tone color="green">// code to be executed</Tone>
                        </div>
                        <div>{'}'}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[19px] leading-tight">For example:</p>
                      <div className="w-[420px]">
                        <LessonChip text="Input" />
                        <div className="relative">
                          <CodeEditor code={page1CodeA} lineStart={1} activeLineIndex={-1} />
                          <RunButton onClick={runPage1A} className="absolute bottom-2 right-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[495px] shrink-0 space-y-3 pt-[4.6rem]">
                    <div className="w-[470px]">
                      <LessonChip text="output" />
                      <OutputPanel lines={output1} minHeightClass="min-h-[150px]" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-[19px] leading-tight">We can also use it to test variables:</p>
                      <div className="w-[420px]">
                        <LessonChip text="Input" />
                        <div className="relative">
                          <CodeEditor code={page1CodeB} lineStart={1} activeLineIndex={-1} />
                          <RunButton onClick={runPage1B} className="absolute bottom-2 right-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="space-y-3 text-left">
                <div className="flex items-start justify-between gap-10">
                  <div className="w-[520px] shrink-0 space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-[31px] leading-none underline underline-offset-4">
                        The <Tone color="red">else</Tone> Statement
                      </h2>
                      <p className="text-[19px] leading-tight">
                        Use the <Tone color="red">else</Tone> statement to execute a block of code if
                        <br />
                        a condition is <Tone color="red">false</Tone>:
                      </p>
                      <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                      <div className="w-[310px] rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                        <div>
                          <Tone color="blue">if</Tone> (condition) {'{'}
                        </div>
                        <div>
                          <Tone color="green">// code to be executed</Tone>
                        </div>
                        <div>
                          {'} '}
                          <Tone color="blue">else</Tone> {'{'}
                        </div>
                        <div>
                          <Tone color="green">// other code to be executed</Tone>
                        </div>
                        <div>{'}'}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[19px] leading-tight">For example:</p>
                      <div className="w-[420px]">
                        <LessonChip text="Input" />
                        <div className="relative">
                          <CodeEditor code={page2Code} lineStart={1} activeLineIndex={-1} />
                          <RunButton onClick={runPage2} className="absolute bottom-2 right-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[470px] shrink-0 pt-[4.6rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output2} minHeightClass="min-h-[150px]" />
                  </div>
                </div>
              </div>
            ) : pageIndex === 2 ? (
              <div className="space-y-3 text-left">
                <div className="flex items-start justify-between gap-10">
                  <div className="w-[420px] shrink-0 space-y-2">
                    <p className="text-[19px] leading-tight">
                      You can keep repeating the <Tone color="red">else if</Tone> statement to specify new conditions.
                      <br />
                      It will work as sort of a priority, checking if the first condition is met, if not,
                      <br />
                      it will check the second, then the third, and so on...
                    </p>
                    <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                    <div className="w-[370px] rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] leading-7 text-slate-900">
                      <div>
                        <Tone color="blue">if</Tone> (condition1) {'{'}
                      </div>
                      <div>
                        <Tone color="green">// code to be executed</Tone>
                      </div>
                      <div>
                        {'} '}
                        <Tone color="blue">else if</Tone> (condition2) {'{'}
                      </div>
                      <div>
                        <Tone color="green">// other code to be executed</Tone>
                      </div>
                      <div>
                        {'} '}
                        <Tone color="blue">else</Tone> {'{'}
                      </div>
                      <div>
                        <Tone color="green">// other other code to be executed</Tone>
                      </div>
                      <div>{'}'}</div>
                    </div>
                    <p className="w-[350px] text-[19px] leading-tight">
                      The conditionless <Tone color="blue">else</Tone> will always
                      <br />
                      come at the end, and it will execute
                      <br />
                      when none of the previous <Tone color="red">if</Tone>'s were
                      <br />
                      met.
                    </p>
                  </div>

                  <div className="w-[590px] shrink-0 space-y-3 pt-[4.2rem]">
                    <div className="w-[360px] ml-auto">
                      <LessonChip text="output" />
                      <OutputPanel lines={output3} minHeightClass="min-h-[118px]" />
                    </div>

                    <div className="w-[420px] ml-[35px]">
                      <p className="text-[19px] leading-tight">For example:</p>
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={page3Code} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage3} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 3 ? (
              <div className="space-y-3 text-left">
                <div className="space-y-1">
                  <h2 className="text-[31px] leading-none underline underline-offset-4">Short hand If...Else</h2>
                  <p className="text-[19px] leading-tight">
                    Also known as the <Tone color="red">ternary operator</Tone> because it consists of three operands.
                    <br />
                    Is a another way to write an If...Else statement in just one line,
                    <br />
                    it's often used to replace simple if...else statements.
                  </p>
                  <div className="text-[18px] font-semibold leading-none text-[#c6d6d5]">Syntax:</div>
                  <div className="inline-block rounded bg-[#e5e5e5] px-2 py-1 font-mono text-[16px] text-slate-900">
                    condition ? expression_True : expression_False;
                  </div>
                </div>

                <div className="flex items-start justify-between gap-10">
                  <div className="w-[430px] shrink-0 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[19px] leading-tight">
                        For example (normal <Tone color="red">If...Else</Tone>):
                      </p>
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={page4CodeA} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage4A} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[19px] leading-tight">
                        Short hand <Tone color="red">If...Else</Tone>:
                      </p>
                      <LessonChip text="Input" />
                      <div className="relative w-[545px]">
                        <CodeEditor code={page4CodeB} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={runPage4B} className="absolute right-3 top-[3px]" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[390px] shrink-0 pt-[7rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output4} minHeightClass="min-h-[150px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">Give a valid number to trigger each of the conditions:</p>

                <div className="flex items-start justify-between gap-9">
                  <div className="w-[610px] shrink-0">
                    <LessonChip text="Input" />
                    <CodeEditor code={page5Code} lineStart={1} activeLineIndex={-1} />
                  </div>

                  <div className="w-[390px] shrink-0 space-y-2">
                    <ExerciseRow
                      label="x"
                      value={valueX}
                      onChange={setValueX}
                      onRun={runX}
                    />
                    <ExerciseRow
                      label="y"
                      value={valueY}
                      onChange={setValueY}
                      onRun={runY}
                    />
                    <ExerciseRow
                      label="z"
                      value={valueZ}
                      onChange={setValueZ}
                      onRun={runZ}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-3">
                  <div className="w-[285px]">
                    <LessonChip text="output" />
                    <OutputPanel lines={output5} minHeightClass="min-h-[90px]" />
                  </div>
                  <div className="min-h-[1.5rem] pt-[2.2rem] text-[18px] leading-none">
                    {delayedPage5Result.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.4rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />

            <div className="flex items-center gap-1.5">
              {isLastPage && (
                <HintButton widthClass="w-[290px]">
                  A number smaller than 10, a
                  <br />
                  number greater than 10, 10
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
