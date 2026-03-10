'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { Tone } from '@/components/lesson/text';
import {
  ChoiceButtonGroup,
  CodeEditor,
  HomeButton,
  LessonBackButton,
  LessonChip,
  LessonNextButton,
  LessonTable,
} from '@/components/lesson/ui';

function OptionFeedback({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="min-h-[44px] space-y-0.5 text-[17px] leading-tight text-left">
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 3;

  const [page4Result1, setPage4Result1] = useState<ReactNode[]>([]);
  const [page4Result2, setPage4Result2] = useState<ReactNode[]>([]);
  const [page4Result3, setPage4Result3] = useState<ReactNode[]>([]);
  const page4ChoiceClassName =
    '!rounded-sm !border-[#94c8aa] !bg-[#69ac8a] !text-white hover:!bg-[#94c8aa]';

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

  const page4_input1 = (option: number) => {
    if (option === 3) {
      setPage4Result1([<Tone key="op-q1-correct" color="green">Correct! 5 * 3 = 15</Tone>]);
      return;
    }
    setPage4Result1([<Tone key="op-q1-wrong" color="red">Wrong!</Tone>]);
  };

  const page4_input2 = (option: number) => {
    if (option === 1) {
      setPage4Result2([<Tone key="op-q2-correct" color="green">Correct! 15 + 1 = 16</Tone>]);
      return;
    }
    setPage4Result2([<Tone key="op-q2-wrong" color="red">Wrong!</Tone>]);
  };

  const page4_input3 = (option: number) => {
    if (option === 2) {
      setPage4Result3([
        <Tone key="op-q3-correct-1" color="green">Correct! 10 % 4 = 2</Tone>,
        <Tone key="op-q3-correct-2" color="green">2 isn't bigger than 2</Tone>,
      ]);
      return;
    }
    setPage4Result3([<Tone key="op-q3-wrong" color="red">Wrong!</Tone>]);
  };

  const exampleCode1 = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>sum = </span>
        <Tone color="red">10</Tone>
        <span> + </span>
        <Tone color="red">5</Tone>
        <Tone color="dark">;</Tone>
      </>,
    ],
    []
  );

  const exampleCode2 = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>sum = a + b;</span>
      </>,
    ],
    []
  );

  const exampleCode3 = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>sum = a + </span>
        <Tone color="red">5</Tone>
        <Tone color="dark">;</Tone>
      </>,
    ],
    []
  );

  const quizCode1 = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>x = </span>
        <Tone color="red">5</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <span>x *= </span>
        <Tone color="red">3</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        printf(<Tone color="red">"%d"</Tone>, x);
      </>,
    ],
    []
  );

  const quizCode2 = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>y = </span>
        <Tone color="red">15</Tone>
        <Tone color="dark">;</Tone>
      </>,
      'y++;',
      <>
        printf(<Tone color="red">"%d"</Tone>, y);
      </>,
    ],
    []
  );

  const quizCode3 = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>z = </span>
        <Tone color="red">10</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        <span>z = z % </span>
        <Tone color="red">4</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        printf(<Tone color="red">"%d"</Tone>, z&gt;2);
      </>,
    ],
    []
  );

  return (
    <div className="lesson-selectable flex min-h-screen -mt-12 flex-col items-center justify-start px-4 pt-30 pb-12 text-center text-white">
      <h1 className="mb-8 text-5xl font-bold text-shadow-lg">Operators</h1>

      <ScaledLessonFrame baseWidth={1165}>
        <div className="relative w-[1165px] max-w-none">
          <HomeButton />

          <section className="w-full rounded-2xl bg-black/20 p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  <Tone color="red">Operators</Tone> are used to prefrom operations on variables and values.
                </p>

                <p className="w-full text-[19px] leading-tight">
                  For example, with the operator <Tone color="red">+</Tone>, we can add together
                  <br />
                  two <Tone color="red">values</Tone>:
                </p>

                <div className="w-[285px] shrink-0">
                  <CodeEditor code={exampleCode1} lineStart={1} activeLineIndex={-1} />
                </div>

                <p className="w-full text-[19px] leading-tight">
                  Two <Tone color="red">variables</Tone>:
                </p>

                <div className="w-[285px] shrink-0">
                  <CodeEditor code={exampleCode2} lineStart={1} activeLineIndex={-1} />
                </div>

                <p className="w-full text-[19px] leading-tight">
                  Or a <Tone color="red">variable</Tone> and a <Tone color="red">value</Tone>:
                </p>

                <div className="w-[285px] shrink-0">
                  <CodeEditor code={exampleCode3} lineStart={1} activeLineIndex={-1} />
                </div>

                <p className="w-full text-[19px] leading-tight">
                  There are 5 categories of <Tone color="red">operators</Tone> in C:
                </p>

                <div className="w-full text-[19px] leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff3232]">•</span>
                    <span>Arithmetic operators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff3232]">•</span>
                    <span>Assignment operators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff3232]">•</span>
                    <span>Comparison operators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff3232]">•</span>
                    <span>Bitwise operators</span>
                  </div>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="space-y-3 text-left">
                <div className="relative min-h-[340px]">
                  <div className="w-[610px]">
                    <div className="text-[22px] leading-none underline underline-offset-4">Arithmetic Operators</div>
                    <div className="text-[18px] leading-tight">Used to perform common mathematical operations.</div>
                  </div>

                  <div className="absolute left-0 top-[2.9rem] w-[640px] shrink-0">
                    <LessonTable
                      className="w-full"
                      columnsClassName="grid-cols-[72px_118px_1fr_84px]"
                      headers={[
                        <span className="text-[14px]" key="arith-operator">
                          Operator
                        </span>,
                        'Name',
                        'Description',
                        'Example',
                      ]}
                      rows={[
                        ['+', 'Addition', 'Adds together two values', 'x + y'],
                        ['-', 'Subtraction', 'Subtracts one value from another', 'x - y'],
                        ['*', 'Multiplication', 'Multiplies two values', 'x * y'],
                        ['/', 'Division', 'Divadies one value by another', 'x / y'],
                        ['%', 'Modulus', 'Returns the division reminder', 'x % y'],
                        ['++', 'Increment', 'Increases the value of a variable by 1', '++x'],
                        ['--', 'Decrement', 'Decreases the value of a variable by 1', '--x'],
                      ]}
                    />
                  </div>

                  <div className="ml-auto w-[685px] shrink-0 space-y-2 pb-3 pt-[10.9rem] text-right">
                    <div className="text-[22px] leading-none underline underline-offset-4">Logical Operators</div>
                    <div className="text-[18px] leading-tight">
                      Used to determine logic,
                      <br />
                      test if statements are true or false
                    </div>
                    <LessonTable
                      className="w-full"
                      columnsClassName="grid-cols-[73px_78px_173px_1fr]"
                      headers={[
                        <span className="text-[14px]" key="logic-operator">
                          Operator
                        </span>,
                        'Name',
                        'Example',
                        'Description',
                      ]}
                      rows={[
                        ['&&', 'And', 'x < 5 && x > 2', 'Return 1 if both statements is true'],
                        ['||', 'Or', 'x < 2 || x > 5', 'Return 1 if one of the statements is true'],
                        ['!', 'Not', '!(x < 5 && x > 2)', 'Reverse the result (return 1 instead 0)'],
                      ]}
                    />
                  </div>
                </div>
              </div>
            ) : pageIndex === 2 ? (
              <div className="space-y-3 text-left">
                <div className="relative min-h-[250px]">
                  <div className="space-y-2">
                    <div className="text-[22px] leading-none underline underline-offset-4">Assignment Operators</div>
                    <div className="text-[18px] leading-tight">Used to assign values to variables.</div>
                    <LessonTable
                      className="w-[320px]"
                      columnsClassName="grid-cols-[68px_88px_1fr]"
                      headers={[
                        <span className="text-[13px]" key="assign-operator">
                          Operator
                        </span>,
                        'Example',
                        'Same as',
                      ]}
                      rows={[
                        ['=', 'x = 10', 'x = 10'],
                        ['+=', 'x += 10', 'x = x + 10'],
                        ['-=', 'x -= 10', 'x = x - 10'],
                        ['*=', 'x *= 10', 'x = x * 10'],
                        ['/=', 'x /= 10', 'x = x / 10'],
                        ['%=', 'x %= 10', 'x = x % 10'],
                      ]}
                    />
                  </div>

                  <div className="absolute right-0 top-0 space-y-2">
                    <div className="text-center text-[22px] leading-none underline underline-offset-4">Comparison Operators</div>
                    <div className="text-center text-[18px] leading-tight">Used to compare values.</div>
                    <LessonTable
                      className="w-[765px]"
                      columnsClassName="grid-cols-[63px_223px_84px_1fr]"
                      headers={[
                        <span className="text-[13px]" key="compare-operator">
                          Operator
                        </span>,
                        'Name',
                        'Example',
                        'Description',
                      ]}
                      rows={[
                        ['==', 'Equal to', 'x == y', 'Returns 1 if the values are equal'],
                        ['!=', 'Not equal', 'x != y', 'Returns 1 if the values are not equal'],
                        ['>', 'Greater than', 'x > y', 'Returns 1 if x is greater than y'],
                        ['<', 'Less than', 'x < y', 'Returns 1 if x is less than y'],
                        ['>=', 'Greater than or equal to', 'x >= y', 'Returns 1 if x is greater than y or equal to it'],
                        ['<=', 'Less than or equal to', 'x <= y', 'Returns 1 if x is less than y or equal to it'],
                      ]}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <p className="w-full text-[19px] leading-tight">What will be printed?</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-[25px]">
                    <div className="w-[270px] shrink-0">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={quizCode1} lineStart={1} activeLineIndex={-1} />
                      </div>
                    </div>

                    <ChoiceButtonGroup
                      buttonClassName={page4ChoiceClassName}
                      options={[
                        { label: '5', onClick: () => page4_input1(1) },
                        { label: '8', onClick: () => page4_input1(2) },
                        { label: '15', onClick: () => page4_input1(3) },
                        { label: 'Error', onClick: () => page4_input1(4) },
                      ]}
                    />

                    <div className="pt-4">
                      <OptionFeedback lines={page4Result1} />
                    </div>
                  </div>

                  <div className="flex items-start gap-[25px]">
                    <div className="w-[270px] shrink-0">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={quizCode2} lineStart={1} activeLineIndex={-1} />
                      </div>
                    </div>

                    <ChoiceButtonGroup
                      buttonClassName={page4ChoiceClassName}
                      options={[
                        { label: '16', onClick: () => page4_input2(1) },
                        { label: '15', onClick: () => page4_input2(2) },
                        { label: '30', onClick: () => page4_input2(3) },
                        { label: 'Error', onClick: () => page4_input2(4) },
                      ]}
                    />

                    <div className="pt-4">
                      <OptionFeedback lines={page4Result2} />
                    </div>
                  </div>

                  <div className="flex items-start gap-[25px]">
                    <div className="w-[270px] shrink-0">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={quizCode3} lineStart={1} activeLineIndex={-1} />
                      </div>
                    </div>

                    <ChoiceButtonGroup
                      buttonClassName={page4ChoiceClassName}
                      options={[
                        { label: '2', onClick: () => page4_input3(1) },
                        { label: '0', onClick: () => page4_input3(2) },
                        { label: '2.5', onClick: () => page4_input3(3) },
                        { label: 'Error', onClick: () => page4_input3(4) },
                      ]}
                    />

                    <div className="pt-4">
                      <OptionFeedback lines={page4Result3} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.4rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LessonPage;


