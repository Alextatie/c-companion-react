'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
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

function ExerciseEditor({
  input,
  onInput,
}: {
  input: string;
  onInput: (value: string) => void;
}) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-300 bg-[#3c4455] shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className="select-none bg-[#3c4455] py-4 text-[17px] leading-7 text-[#c2c7d1]">
          {[1, 2, 3, 4, 5].map((line) => (
            <div key={line} className="text-center font-mono">
              {line}
            </div>
          ))}
        </div>
        <div className="bg-white px-4 py-4 font-mono text-[17px] leading-7 text-slate-900">
          <div className="whitespace-pre">
            <>
              printf(<Tone color="red">"Hello World!"</Tone>
              <Tone color="dark">);</Tone>
            </>
          </div>
          <div className="flex items-center">
            <textarea
              value={input}
              onChange={(e) => onInput(e.target.value)}
              rows={2}
              className="h-16 w-[32ch] resize-none rounded border border-slate-300 bg-white px-1.5 text-[16px] leading-7 text-slate-900"
            />
          </div>
          <div className="whitespace-pre">
            <>
              printf(<Tone color="red">"I learned how to write comments!"</Tone>
              <Tone color="dark">);</Tone>
            </>
          </div>
          <div className="whitespace-pre">
            <>
              <Tone color="blue">return </Tone>
              <Tone color="red">0</Tone>
              <Tone color="dark">;</Tone>
            </>
          </div>
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

  const [Output_1, setOutput_1] = useState<ReactNode[]>([<EmptyLine key="c1-empty" />]);
  const [Output_2, setOutput_2] = useState<ReactNode[]>([<EmptyLine key="c2-empty" />]);
  const [page2Input, setPage2Input] = useState('');
  const [page2Result, setPage2Result] = useState('');
  const delayedPage2Result = useDelayedLessonValue(page2Result, '');

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
    setOutput_1([<Tone key="c1-a" color="white">Hello World!</Tone>]);
  };

  const page1_input2 = () => {
    setOutput_1([<Tone key="c1-b" color="white">Hello World!</Tone>]);
  };

  const handlePage2InputChange = (value: string) => {
    const normalized = value.replace(/\r/g, '');
    const lines = normalized.split('\n').slice(0, 2).map((line) => line.slice(0, 30));
    setPage2Input(lines.join('\n'));
  };

  const page2_input1 = () => {
    const [input = '', inputB = ''] = page2Input.replace(/\r/g, '').split('\n');
    const inputEmpty = input.trim().length === 0;
    const inputBEmpty = inputB.trim().length === 0;

    if (inputEmpty && inputBEmpty) {
      setPage2Result("Wrong! You didn't write any comment.");
      setOutput_2([
        <Tone key="c2-empty-message-1" color="white">Hello World!</Tone>,
        <Tone key="c2-empty-message-2" color="white">I learned how to write comments!</Tone>,
      ]);
      return;
    }

    if (inputBEmpty) {
      if (input.startsWith('//') || (input.startsWith('/*') && input.endsWith('*/'))) {
        setPage2Result('Correct!');
        setOutput_2([
          <Tone key="c2-correct-a1" color="white">Hello World!</Tone>,
          <Tone key="c2-correct-a2" color="white">I learned how to write comments!</Tone>,
        ]);
        return;
      }
    }

    if (inputEmpty) {
      if (inputB.startsWith('//') || (inputB.startsWith('/*') && inputB.endsWith('*/'))) {
        setPage2Result('Correct!');
        setOutput_2([
          <Tone key="c2-correct-b1" color="white">Hello World!</Tone>,
          <Tone key="c2-correct-b2" color="white">I learned how to write comments!</Tone>,
        ]);
        return;
      }
    }

    if (
      (input.startsWith('//') && inputB.startsWith('//')) ||
      (input.startsWith('/*') && inputB.endsWith('*/')) ||
      ((input.startsWith('/*') && input.endsWith('*/')) && inputB.startsWith('//')) ||
      ((inputB.startsWith('/*') && inputB.endsWith('*/')) && input.startsWith('//'))
    ) {
      setPage2Result('Correct!');
      setOutput_2([
        <Tone key="c2-correct-c1" color="white">Hello World!</Tone>,
        <Tone key="c2-correct-c2" color="white">I learned how to write comments!</Tone>,
      ]);
      return;
    }

    setPage2Result('Wrong!');
    setOutput_2([<Tone key="c2-wrong" color="red">Error!</Tone>]);
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1030} title="Comments">
      <div className="relative w-[1030px] max-w-none">
        <HomeButton />

        <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
          {pageIndex === 0 ? (
            <div className="space-y-3 text-left">
              <p className="w-full text-[19px] leading-tight">
                Comments are chunks of code that are ignored by the compiler.
                <br />
                They can be used to explain code, or to prevent execution of code when running tests.
              </p>

              <p className="w-full text-[19px] leading-tight">
                Single line comments start with two forward slashes <span className="text-[#ff6565]">//</span>.
                <br />
                Any text between <span className="text-[#ff6565]">//</span> and the end of the line is ignored by the compiler.
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[410px] shrink-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor
                      code={[
                        <Tone color="green">//This is a comment</Tone>,
                        <>
                          printf(<Tone color="red">"Hello World!"</Tone>
                          <Tone color="dark">);</Tone>
                        </>,
                        <EmptyLine />,
                      ]}
                    />
                    <RunButton onClick={page1_input1} className="absolute bottom-2 right-3" />
                  </div>
                </div>

                <div className="w-[410px] shrink-0">
                  <LessonChip text="output" />
                  <OutputPanel lines={Output_1} minHeightClass="min-h-[94px]" />
                </div>
              </div>

              <p className="w-full text-[19px] leading-tight">
                Multi line comments start with <span className="text-[#ff6565]">/*</span> and end with <span className="text-[#ff6565]">*/</span>.
                <br />
                Any text in between is ignored by the compiler.
              </p>

              <div className="w-[410px] shrink-0">
                <LessonChip text="Input" />
                <div className="relative">
                  <CodeEditor
                      code={[
                        <Tone color="green">/*This is a comment.</Tone>,
                        <Tone color="green">I will explain my code here. */</Tone>,
                        <>
                          printf(<Tone color="red">"Hello World!"</Tone>
                          <Tone color="dark">);</Tone>
                        </>,
                      ]}
                  />
                  <RunButton onClick={page1_input2} className="absolute bottom-2 right-3" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              <p className="w-full text-[19px] leading-tight">
                Write a comment between line 1 and 2
                <br />
                without ruining the code:
              </p>

              <div className="flex items-start gap-15">
                <div className="w-[500px] shrink-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <ExerciseEditor
                      input={page2Input}
                      onInput={handlePage2InputChange}
                    />
                    <RunButton onClick={page2_input1} className="absolute bottom-3 right-4" />
                  </div>
                  <div className="mt-2 min-h-[3rem] text-xl leading-tight text-[#ff6565]">
                    {delayedPage2Result && (
                      <span className={delayedPage2Result === 'Correct!' ? 'text-[#34d356]' : 'text-[#ff6565]'}>
                        {delayedPage2Result}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-[405px] shrink-0">
                  <LessonChip text="output" />
                  <OutputPanel lines={Output_2} minHeightClass="min-h-[180px]" />
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-[2.5rem] flex items-center justify-between">
          <LessonBackButton onClick={onBack} />

          <div className="flex items-center gap-1.5">
            {isLastPage && (
              <HintButton widthClass="w-[260px]">
                Write a comment
                <br />
                using <span className="text-[#ff6565]">//</span> or <span className="text-[#ff6565]">/* */</span>.
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
