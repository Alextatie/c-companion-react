'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { Tone } from '@/components/lesson/text';
import {
  CodeEditor,
  HintButton,
  HomeButton,
  LessonBackButton,
  LessonChip,
  LessonNextButton,
  OutputPanel,
  RunButton,
} from '@/components/lesson/ui';

function InlineInput({
  value,
  onChange,
  widthClass,
}: {
  value: string;
  onChange: (value: string) => void;
  widthClass: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-8 rounded border border-slate-400 bg-white px-1 text-[16px] text-slate-900 ${widthClass}`}
    />
  );
}

function RecursionExerciseEditor({
  value1,
  value2,
  onValue1,
  onValue2,
}: {
  value1: string;
  value2: string;
  onValue1: (value: string) => void;
  onValue2: (value: string) => void;
}) {
  const lineClass = 'flex items-center whitespace-pre font-mono text-[17px] leading-7 text-slate-900';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-[#3c4455] shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className="select-none bg-[#3c4455] py-1 text-[17px] leading-7 text-[#c2c7d1]">
          {Array.from({ length: 16 }, (_, index) => (
            <div key={index} className="text-center font-mono">
              {index + 1}
            </div>
          ))}
        </div>
        <div className="bg-white px-1 py-1 font-mono text-[17px] leading-7 text-slate-900">
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>factorial(</span>
            <Tone color="blue">int </Tone>
            <span>x);</span>
          </div>
          <div className={lineClass}>{' '}</div>
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>main() {'{'}</span>
          </div>
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>num = </span>
            <Tone color="red">5</Tone>
            <span>;</span>
          </div>
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>result = factorial(num);</span>
          </div>
          <div className={lineClass}>
            printf(<Tone color="red">"%d! = %d"</Tone>, num, result);
          </div>
          <div className={lineClass}>
            <Tone color="blue">return </Tone>
            <Tone color="red">0</Tone>
            <span>;</span>
          </div>
          <div className={lineClass}>{'}'}</div>
          <div className={lineClass}>{' '}</div>
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>factorial(</span>
            <Tone color="blue">int </Tone>
            <span>x) {'{'}</span>
          </div>
          <div className={lineClass}>
            if (<InlineInput value={value1} onChange={onValue1} widthClass="w-[8ch]" />) {'{'}
          </div>
          <div className={lineClass}>
            <Tone color="blue">return </Tone>
            <Tone color="red">1</Tone>
            <span>;</span>
          </div>
          <div className={lineClass}>{'} else {'}</div>
          <div className={lineClass}>
            <Tone color="blue">return </Tone>
            <span>x * factorial(</span>
            <InlineInput value={value2} onChange={onValue2} widthClass="w-[5ch]" />
            <span>);</span>
          </div>
          <div className={lineClass}>{'}'}</div>
          <div className={lineClass}>{'}'}</div>
        </div>
      </div>
    </div>
  );
}

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 1;

  const [Output_1, setOutput_1] = useState<ReactNode[]>([]);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [page2Result, setPage2Result] = useState<ReactNode[]>([]);

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

  const page1_input1 = () => {
    setOutput_1([<Tone key="r1-out" color="white">55</Tone>]);
  };

  const page2_input1 = () => {
    const leftOk = value1 === 'x==0' || value1 === 'x == 0' || value1 === 'x < 1' || value1 === 'x<1';
    const rightOk = value2 === 'x-1' || value2 === 'x - 1';

    if (leftOk && rightOk) {
      setPage2Result([<Tone key="r2-correct" color="green">Correct!</Tone>]);
      return;
    }

    setPage2Result([<Tone key="r2-wrong" color="red">Wrong!</Tone>]);
  };

  const page1Code = [
    <>
      <Tone color="blue">int </Tone>
      <span>sum(</span>
      <Tone color="blue">int </Tone>
      <span>x);</span>
    </>,
    ' ',
    <>
      <Tone color="blue">int </Tone>
      <span>main() {'{'}</span>
    </>,
    <>
      <Tone color="blue">int </Tone>
      <span>result = sum(</span>
      <Tone color="red">10</Tone>
      <span>);</span>
    </>,
    <>
      printf(<Tone color="red">"Result: %d"</Tone>, result);
    </>,
    <>
      <Tone color="blue">return </Tone>
      <Tone color="red">0</Tone>
      <span>;</span>
    </>,
    '}',
    ' ',
    <>
      <Tone color="blue">int </Tone>
      <span>sum(</span>
      <Tone color="blue">int </Tone>
      <span>x) {'{'}</span>
    </>,
    <>
      if (x &gt; <Tone color="red">0</Tone>) {'{'}</>
    ,
    <>
      {'  '}<Tone color="blue">return </Tone>
      <span>x + sum(x - </span>
      <Tone color="red">1</Tone>
      <span>);</span>
    </>,
    <>
      {'} else {'}
    </>,
    <>
      {'  '}<Tone color="blue">return </Tone>
      <Tone color="red">0</Tone>
      <span>;</span>
    </>,
    '}',
    '}',
  ];

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="Recursion">
        <div className="relative w-[1090px] max-w-none">
          <HomeButton />

          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  <Tone color="red">Recursion</Tone> is the technique of making a function call itself.
                  <br />
                  This technique provides an alternative method to solve
                  <br />
                  certain problems. Recursion can be difficult to understand,
                  <br />
                  so the best way to get it is with an example:
                </p>

                <div className="relative min-h-[430px]">
                  <div className="w-[300px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page1Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page1_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="absolute left-[315px] top-[0.3rem] w-[360px] text-[17px] leading-tight">
                    <div className="text-[22px] leading-none">Explanation:</div>
                    <p>
                      With every new <Tone color="red">call</Tone>, the function adds the
                      <Tone color="red">value</Tone> of the current <Tone color="red">x</Tone> to the <Tone color="red">return</Tone> value,
                      and then diminishes the <Tone color="red">value</Tone> of x, and calls
                      itself again with this diminished value. The
                      initial <Tone color="red">value</Tone> in our example is <Tone color="red">10</Tone>, so the
                      next round it becomes <Tone color="red">9</Tone> and then <Tone color="red">8</Tone>, and <Tone color="red">7</Tone>,
                      and so on until it reaches <Tone color="red">0</Tone> and returns 0.
                    </p>
                    <div className="text-[#6d94ff]">10 + sum(<Tone color="red">9</Tone>)</div>
                    <div className="text-[#6d94ff]">10 + 9 +sum(<Tone color="red">8</Tone>)</div>
                    <div className="text-[#6d94ff]">10 + 9 + 8 +sum(<Tone color="red">7</Tone>)</div>
                    <div className="text-[#6d94ff]">...</div>
                    <div className="text-[#6d94ff]">10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 +sum(<Tone color="red">0</Tone>)</div>
                    <div className="text-[#6d94ff]">10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 + 0 = <Tone color="green">55</Tone></div>
                  </div>

                  <div className="absolute right-[120px] top-[0.3rem] w-[190px] shrink-0">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_1} minHeightClass="min-h-[60px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  Fill in the blanks in the following code segment to make it
                  <br />
                  work with the expected output:
                </p>

                <div className="relative min-h-[430px]">
                  <div className="w-[300px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <RecursionExerciseEditor value1={value1} value2={value2} onValue1={setValue1} onValue2={setValue2} />
                      <RunButton onClick={page2_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="absolute left-[335px] top-[0rem] w-[220px] shrink-0">
                    <LessonChip text="Output" />
                    <OutputPanel
                      lines={[<Tone key="r2-expected" color="white">5! = 120</Tone>]}
                      minHeightClass="min-h-[60px]"
                    />
                  </div>

                </div>

                <div className="min-h-[2rem] text-[18px] leading-tight">
                  {page2Result.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.5rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <div className="flex items-center gap-1.5">
              {pageIndex === 1 && (
                <HintButton widthClass="w-[300px]">
                  <Tone color="red">x == 0</Tone>
                  <br />
                  x - <Tone color="red">1</Tone>
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
