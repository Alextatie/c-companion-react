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
  LessonTable,
  OutputPanel,
  RunButton,
} from '@/components/lesson/ui';

function ExerciseInput({
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
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 rounded border border-slate-400 bg-white px-1.5 text-[16px] text-slate-900 ${widthClass}`}
    />
  );
}

function VariablesExerciseEditor({
  value1,
  value2,
  value3,
  value4,
  value5,
  value6,
  onValue1,
  onValue2,
  onValue3,
  onValue4,
  onValue5,
  onValue6,
}: {
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  value6: string;
  onValue1: (value: string) => void;
  onValue2: (value: string) => void;
  onValue3: (value: string) => void;
  onValue4: (value: string) => void;
  onValue5: (value: string) => void;
  onValue6: (value: string) => void;
}) {
  const lineClass = 'flex items-center whitespace-pre font-mono text-[17px] leading-7 text-slate-900';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-[#3c4455] shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className="select-none bg-[#3c4455] py-1 text-[17px] leading-7 text-[#c2c7d1]">
          {[1, 2, 3, 4, 5].map((line) => (
            <div key={line} className="text-center font-mono">
              {line}
            </div>
          ))}
        </div>
        <div className="bg-white px-1 py-1">
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>bob = </span>
            <Tone color="red">14</Tone>
            <Tone color="dark">;</Tone>
          </div>
          <div className={lineClass}>
            <Tone color="blue">char </Tone>
            <span>math = </span>
            <Tone color="red">'A'</Tone>
            <Tone color="dark">;</Tone>
          </div>
          <div className={lineClass}>
            <Tone color="blue">char </Tone>
            <span>geo = </span>
            <Tone color="red">'C'</Tone>
            <Tone color="dark">;</Tone>
          </div>
          <div className={lineClass}>
            <span>printf(</span>
            <Tone color="red">"My brother Bob is </Tone>
            <ExerciseInput value={value1} onChange={onValue1} widthClass="w-[3.8ch]" />
            <Tone color="red"> years old.\n"</Tone>
            <span>, </span>
            <ExerciseInput value={value2} onChange={onValue2} widthClass="w-[43px]" />
            <span>);</span>
          </div>
          <div className={lineClass}>
            <span>printf(</span>
            <Tone color="red">"He got </Tone>
            <ExerciseInput value={value3} onChange={onValue3} widthClass="w-[3.8ch]" />
            <Tone color="red"> on his last math test, and </Tone>
            <ExerciseInput value={value4} onChange={onValue4} widthClass="w-[3.8ch]" />
            <Tone color="red"> on his last geography test.\n"</Tone>
            <span>, </span>
            <ExerciseInput value={value5} onChange={onValue5} widthClass="w-[52px]" />
            <span>, </span>
            <ExerciseInput value={value6} onChange={onValue6} widthClass="w-[43px]" />
            <span>);</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [showMorePage, setShowMorePage] = useState(false);

  const isFirstPage = pageIndex === 0 && !showMorePage;
  const isLastPage = pageIndex === 8 && !showMorePage;

  const [Output_2, setOutput_2] = useState<ReactNode[]>([<EmptyLine key="o2-empty" />]);
  const [Output_3, setOutput_3] = useState<ReactNode[]>([<EmptyLine key="o3-empty" />]);
  const [Output_4, setOutput_4] = useState<ReactNode[]>([<EmptyLine key="o4-empty" />]);
  const [page4Result, setPage4Result] = useState<ReactNode[]>([]);
  const [Output_5, setOutput_5] = useState<ReactNode[]>([<EmptyLine key="o5-empty" />]);
  const [Output_6, setOutput_6] = useState<ReactNode[]>([<EmptyLine key="o6-empty" />]);
  const [Output_7, setOutput_7] = useState<ReactNode[]>([<EmptyLine key="o7-empty" />]);
  const [Output_8, setOutput_8] = useState<ReactNode[]>([<EmptyLine key="o8-empty" />]);
  const [Output_9, setOutput_9] = useState<ReactNode[]>([<EmptyLine key="o9-empty" />]);
  const [Output_10, setOutput_10] = useState<ReactNode[]>([<EmptyLine key="o10-empty" />]);

  const [page6Value1, setPage6Value1] = useState('');
  const [page6Value2, setPage6Value2] = useState('');
  const [page6Value3, setPage6Value3] = useState('');
  const [page6Value4, setPage6Value4] = useState('');
  const [page6Value5, setPage6Value5] = useState('');
  const [page6Value6, setPage6Value6] = useState('');
  const [page6Result, setPage6Result] = useState<ReactNode[]>([]);

  const onBack = () => {
    if (showMorePage) {
      setShowMorePage(false);
      return;
    }

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

  const page2_input1 = () => {
    setOutput_2([<Tone key="o2-run1" color="white">15</Tone>]);
  };

  const page2_input2 = () => {
    setOutput_2([
      <Tone key="o2-run2a" color="white">15</Tone>,
      <Tone key="o2-run2b" color="white">189.13</Tone>,
      <Tone key="o2-run2c" color="white">z</Tone>,
    ]);
  };

  const page3_input1 = () => {
    setOutput_3([
      <Tone key="o3-run1a" color="white">15</Tone>,
      <Tone key="o3-run1b" color="white">189.13</Tone>,
      <Tone key="o3-run1c" color="white">z</Tone>,
    ]);
  };

  const page3_input2 = () => {
    setOutput_3([<Tone key="o3-run2" color="white">15189.13z</Tone>]);
  };

  const page3_more = () => {
    setShowMorePage(true);
  };

  const page4_input1 = () => {
    setOutput_4([<Tone key="o4-run1" color="red">Error!</Tone>]);
    setPage4Result([<Tone key="p4-result" color="white">You cannot change a const</Tone>]);
  };

  const page5_input1 = () => {
    setOutput_5([
      <Tone key="o5-run1" color="white">My name starts with A and I'm 30 years old</Tone>,
    ]);
  };

  const page5_input2 = () => {
    setOutput_5([
      <Tone key="o5-run2a" color="white">My favorite number is: 27</Tone>,
      <Tone key="o5-run2b" color="white">My favorite letter is: K</Tone>,
    ]);
  };

  const page6_input1 = () => {
    if (
      page6Value1 === '%d' &&
      page6Value2 === 'bob' &&
      page6Value3 === '%c' &&
      page6Value4 === '%c' &&
      page6Value5 === 'math' &&
      page6Value6 === 'geo'
    ) {
      setPage6Result([<Tone key="p6-correct" color="green">Correct!</Tone>]);
      setOutput_6([
        <Tone key="o6-correct-a" color="white">My brother Bob is 14 years old.</Tone>,
        <Tone key="o6-correct-b" color="white">He got A on his math test, and C on his last geography test.</Tone>,
      ]);
      return;
    }

    if (
      page6Value1 === '%d' &&
      page6Value2 === 'bob' &&
      page6Value3 === '%c' &&
      page6Value4 === '%c' &&
      page6Value5 === 'geo' &&
      page6Value6 === 'math'
    ) {
      setPage6Result([
        <Tone key="p6-swap-1" color="red">Wrong!</Tone>,
        <Tone key="p6-swap-2" color="red">The code is functionally correct</Tone>,
        <Tone key="p6-swap-3" color="red">but you swapped the scores.</Tone>,
      ]);
      setOutput_6([
        <Tone key="o6-swap-a" color="white">My brother Bob is 14 years old.</Tone>,
        <Tone key="o6-swap-b" color="white">He got C on his math test, and A on his last geography test.</Tone>,
      ]);
      return;
    }

    setPage6Result([
      <Tone key="p6-1" color={page6Value1 === '%d' ? 'green' : 'red'}>1) {page6Value1 === '%d' ? 'Correct' : 'Wrong'}</Tone>,
      <Tone key="p6-2" color={page6Value2 === 'bob' ? 'green' : 'red'}>2) {page6Value2 === 'bob' ? 'Correct' : 'Wrong'}</Tone>,
      <Tone key="p6-3" color={page6Value3 === '%c' ? 'green' : 'red'}>3) {page6Value3 === '%c' ? 'Correct' : 'Wrong'}</Tone>,
      <Tone key="p6-4" color={page6Value4 === '%c' ? 'green' : 'red'}>4) {page6Value4 === '%c' ? 'Correct' : 'Wrong'}</Tone>,
      <Tone key="p6-5" color={page6Value5 === 'math' ? 'green' : 'red'}>5) {page6Value5 === 'math' ? 'Correct' : 'Wrong'}</Tone>,
      <Tone key="p6-6" color={page6Value6 === 'geo' ? 'green' : 'red'}>6) {page6Value6 === 'geo' ? 'Correct' : 'Wrong'}</Tone>,
    ]);
    setOutput_6([<Tone key="o6-wrong" color="red">Error!</Tone>]);
  };

  const page7_input1 = () => {
    setOutput_7([<Tone key="o7-run1" color="white">55</Tone>]);
  };

  const page7_input2 = () => {
    setOutput_7([<Tone key="o7-run2" color="white">15</Tone>]);
  };

  const page8_input1 = () => {
    setOutput_8([<Tone key="o8-run1" color="white">32096</Tone>]);
  };

  const page8_input2 = () => {
    setOutput_8([<Tone key="o8-run2" color="white">33</Tone>]);
  };

  const page9_input1 = () => {
    setOutput_9([<Tone key="o9-run1" color="white">12, 6, 35</Tone>]);
  };

  const page9_input2 = () => {
    setOutput_9([<Tone key="o9-run2" color="white">71, 71, 71</Tone>]);
  };

  const page10_input1 = () => {
    setOutput_10([<Tone key="o10-run1" color="white">A, B, C</Tone>]);
  };

  const page10_input2 = () => {
    setOutput_10([
      <Tone key="o10-run2a" color="white">3.500000</Tone>,
      <Tone key="o10-run2b" color="white">3.5</Tone>,
      <Tone key="o10-run2c" color="white">3.500</Tone>,
    ]);
  };

  const page10_input3 = () => {
    setOutput_10([
      <Tone key="o10-run3a" color="white">2.000000</Tone>,
      <Tone key="o10-run3b" color="white">2.500000</Tone>,
    ]);
  };

  return (
    <div className="lesson-selectable flex min-h-screen flex-col items-center justify-start -mt-12 px-4 pt-30 pb-12 text-center text-white">
      <h1 className="mb-8 text-5xl font-bold text-shadow-lg">Variables</h1>

      <ScaledLessonFrame baseWidth={1165}>
        <div className="relative w-[1165px] max-w-none">
          <HomeButton />

          <section className="w-full rounded-2xl bg-black/20 p-8 shadow-lg backdrop-blur-[1px]">
            {showMorePage ? (
              <div className="relative space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  Every variable must be a specified <Tone color="red">data type</Tone> and use
                  <br />
                  a <Tone color="red">format specifier</Tone> inside the <Tone color="red">printf()</Tone> function to display it.
                </p>

                <div className="flex items-center justify-between gap-8">
                  <div className="w-[810px] shrink-0 space-y-2">
                    <p className="text-[19px] leading-tight">Some more data types:</p>
                    <LessonTable
                      columnsClassName="grid-cols-[66px_96px_116px_1fr_78px]"
                      headers={[
                        <span className="text-[14px]" key="type-header">Data Type</span>,
                        <span className="text-[14px]" key="format-header">Format<br />Specifier</span>,
                        'Size',
                        'Description',
                        'Example',
                      ]}
                      rows={[
                        ['int', '%d or %i', '2 or 4 bytes', 'Whole numbers, no decimals', '1'],
                        ['float', '%f or %F', '4 bytes', 'Fractional numbers, contain up to 6-7 decimal digits', '1.66'],
                        ['double', '%lf', '8 bytes', 'Fractional numbers, contain up to 15 decimal digits', '1.66'],
                        ['char', '%c', '1 byte', 'single character/letter/number/ASCII value', '"A"'],
                        ['string', '%s', '', 'Strings, which you will learn about in a later chapter.', '"Hello"'],
                      ]}
                      accentColumns={[0, 1, 4]}
                    />
                  </div>

                  <div className="w-[245px] shrink-0 pt-1">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_10} minHeightClass="min-h-[158px]" />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-10 pt-1">
                  <div className="w-[340px] shrink-0">
                    <p className="mb-2 text-[18px] leading-tight">
                      Use <Tone color="red">ASCII</Tone> (a character
                      <br />
                      encoding standard) values to
                      <br />
                      display characters.
                    </p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor
                        code={[
                          <>
                            <Tone color="blue">char </Tone>
                            <span>x = </span>
                            <Tone color="red">65</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <Tone color="blue">char </Tone>
                            <span>y = </span>
                            <Tone color="red">66</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <Tone color="blue">char </Tone>
                            <span>z = </span>
                            <Tone color="red">67</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <span>printf(</span>
                            <Tone color="red">"%c, %c, %c"</Tone>
                            <span>, x, y, z);</span>
                          </>,
                        ]}
                        activeLineIndex={-1}
                      />
                      <RunButton onClick={page10_input1} className="absolute bottom-9 right-3" />
                    </div>
                  </div>

                  <div className="w-[340px] shrink-0">
                    <p className="mb-2 text-[18px] leading-tight">
                      Use a <Tone color="red">.x</Tone> (x is a digit) between
                      <br />
                      the <Tone color="red">%</Tone> and the <Tone color="red">f</Tone> to print only x
                      <br />
                      digits after the decimal.
                    </p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor
                        code={[
                          <>
                            <Tone color="blue">float </Tone>
                            <span>a = </span>
                            <Tone color="red">3.5</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <span>printf(</span>
                            <Tone color="red">"%f\n"</Tone>
                            <span>, a);</span>
                          </>,
                          <>
                            <span>printf(</span>
                            <Tone color="red">"%.1f\n"</Tone>
                            <span>, a);</span>
                          </>,
                          <>
                            <span>printf(</span>
                            <Tone color="red">"%.3f\n"</Tone>
                            <span>, a);</span>
                          </>,
                        ]}
                        activeLineIndex={-1}
                      />
                      <RunButton onClick={page10_input2} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="w-[340px] shrink-0">
                    <p className="mb-2 text-[18px] leading-tight">
                      Use the <Tone color="blue">(type)</Tone> prefix to
                      <br />
                      explicitly convered between
                      <br />
                      certain data types.
                    </p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor
                        code={[
                          <>
                            <Tone color="blue">float </Tone>
                            <span>x = </span>
                            <Tone color="red">5 / 2</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <Tone color="blue">float </Tone>
                            <span>y = </span>
                            <Tone color="blue">(float)</Tone>
                            <Tone color="red">5 / 2</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <span>printf(</span>
                            <Tone color="red">"%f\n"</Tone>
                            <span>, x);</span>
                          </>,
                          <>
                            <span>printf(</span>
                            <Tone color="red">"%f\n"</Tone>
                            <span>, y);</span>
                          </>,
                        ]}
                        activeLineIndex={-1}
                      />
                      <RunButton onClick={page10_input3} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 0 ? (
              <div className="relative space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  Variables are used to store data values.
                  <br />
                  There are different types of variables, defined with different keywords.
                  <br />
                  For example:
                </p>

                <ul className="w-full list-disc pl-6 text-[19px] leading-tight marker:text-white">
                  <li>
                    <Tone color="red">int</Tone> - Stores integers (whole numbers) [<Tone color="red">33, 128, ...</Tone>].
                  </li>
                  <li>
                    <Tone color="red">float</Tone> - Stores floating point numbers with decimals [<Tone color="red">33.53, 0.126, ...</Tone>].
                  </li>
                  <li>
                    <Tone color="red">char</Tone> - Stores single characters [<Tone color="red">'a', 'G', ...</Tone>].
                  </li>
                </ul>

                <p className="pl-16 text-[17px] leading-tight">
                  *characters must be surrounded by single quotes <Tone color="red">' '</Tone>.
                </p>

                <div className="space-y-1">
                  <h2 className="text-[33px] leading-none underline decoration-1 underline-offset-2">Declaring Variables</h2>
                  <p className="w-full text-[19px] leading-tight">
                    To create a variable, specify the <Tone color="red">type</Tone> and assign it a <Tone color="red">name</Tone> and a <Tone color="red">value</Tone>.
                  </p>
                  <p className="text-[17px] leading-tight text-[#d7e6df]">Syntax:</p>
                  <div className="inline-block rounded-sm bg-white px-3 py-1 font-mono text-[19px] leading-none text-slate-700 shadow-sm">
                    <Tone color="blue">type</Tone> name = <Tone color="red">value</Tone>;
                  </div>
                </div>

                <p className="text-[19px] leading-tight">For example:</p>

                <div className="flex items-center gap-2">
                  <div className="w-[450px] shrink-0">
                    <LessonChip text="Input" />
                    <CodeEditor
                      code={[
                        <>
                          <Tone color="blue">int </Tone>
                          <span>num = </span>
                          <Tone color="red">15</Tone>
                          <Tone color="dark">;</Tone>
                        </>,
                        <>
                          <Tone color="blue">float </Tone>
                          <span>f_num = </span>
                          <Tone color="red">189.13</Tone>
                          <Tone color="dark">;</Tone>
                        </>,
                        <>
                          <Tone color="blue">char </Tone>
                          <span>letter = </span>
                          <Tone color="red">'z'</Tone>
                          <Tone color="dark">;</Tone>
                        </>,
                      ]}
                      lineStart={1}
                      activeLineIndex={-1}
                    />
                  </div>

                  <p className="flex-1 pt-6 text-[19px] leading-tight">
                    All variable names must be <Tone color="red">unique</Tone>
                    <br />
                    It is recommended to use descriptive names
                    <br />
                    to create understandable code
                  </p>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="relative space-y-3 text-left">
                <p className="text-[19px] leading-tight">Let's print our new variable:</p>

                <div className="w-[450px] shrink-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor
                      code={[
                        <>
                          <Tone color="blue">int </Tone>
                          <span>num = </span>
                          <Tone color="red">15</Tone>
                          <Tone color="dark">;</Tone>
                        </>,
                        'printf(num);',
                      ]}
                      activeLineIndex={-1}
                    />
                    <RunButton onClick={page2_input1} className="absolute bottom-2 right-3" />
                  </div>
                </div>

                <div className="absolute right-0 top-[2.1rem] w-[345px] shrink-0">
                  <LessonChip text="output" />
                  <OutputPanel lines={Output_2} minHeightClass="min-h-[138px]" />
                </div>

                <p className="text-[19px] leading-tight">
                  To print variables, C requires format specifiers.
                </p>

                <div className="space-y-1">
                  <h2 className="text-[33px] leading-none underline decoration-1 underline-offset-2">Format Specifiers</h2>
                  <p className="w-full text-[19px] leading-tight">
                    A <Tone color="red">placeholder</Tone> that's used inside the <Tone color="red">printf()</Tone> function.
                    <br />
                    It tells the compiler what type of data is stored in the variable.
                    <br />
                    A format specifier starts with <Tone color="red">%</Tone>, followed by a character and surrounded by
                    <br />
                    double quotes <Tone color="red">" "</Tone>. For a variable of type <Tone color="blue">int</Tone> the character is <Tone color="red">d</Tone>.
                  </p>
                </div>

                <div className="w-[450px] shrink-0">
                  <div className="relative">
                    <CodeEditor
                      code={[
                        <>
                          <Tone color="blue">int </Tone>
                          <span>num = </span>
                          <Tone color="red">15</Tone>
                          <Tone color="dark">;</Tone>
                        </>,
                        <>
                          <span>printf(</span>
                          <Tone color="red">"%d"</Tone>
                          <span>, num);</span>
                        </>,
                      ]}
                      activeLineIndex={-1}
                    />
                    <RunButton onClick={page2_input2} className="absolute bottom-2 right-3" />
                  </div>
                </div>

                <p className="w-full text-[19px] leading-tight">
                  Notice that after the format specifier, we used a coma <Tone color="red">,</Tone> and we specify
                  <br />
                  white variable we want to print here (num).
                </p>
              </div>
            ) : pageIndex === 2 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  To print our other variables,
                  <br />
                  we use <Tone color="red">%c</Tone> for char and <Tone color="red">%f</Tone> for float:
                </p>

                <div className="flex items-start gap-8">
                  <div className="flex-1 space-y-2">
                    <div className="w-[450px] shrink-0">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>num = </span>
                              <Tone color="red">15</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <Tone color="blue">float </Tone>
                              <span>f_num = </span>
                              <Tone color="red">189.13</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <Tone color="blue">char </Tone>
                              <span>letter = </span>
                              <Tone color="red">'z'</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d\n"</Tone>
                              <span>, num);</span>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%f\n"</Tone>
                              <span>, f_num);</span>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%c\n"</Tone>
                              <span>, letter);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page3_input1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <div className="w-[735px] shrink-0">
                      <p className="text-[19px] leading-tight">
                        Notice that we added <Tone color="red">\n</Tone>. When used inside the
                        <br />
                        quotes of <Tone color="red">printf()</Tone>, it creates a new line.
                      </p>
                    </div>

                    <div className="w-[450px] shrink-0">
                      <p className="text-[19px] leading-tight">Without the <Tone color="red">\n</Tone>:</p>
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>num = </span>
                              <Tone color="red">15</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <Tone color="blue">float </Tone>
                              <span>f_num = </span>
                              <Tone color="red">189.13</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <Tone color="blue">char </Tone>
                              <span>letter = </span>
                              <Tone color="red">'z'</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d"</Tone>
                              <span>, num);</span>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%f"</Tone>
                              <span>, f_num);</span>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%c"</Tone>
                              <span>, letter);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <button
                          type="button"
                          onClick={page3_more}
                          className="absolute bottom-[2.45rem] right-3 h-[60px] w-[60px] rounded-sm bg-[#a86bdb] px-1 py-1 text-center text-[15px] leading-none text-[#f0e5ff]"
                        >
                          More
                          <br />
                          Data
                          <br />
                          Types
                        </button>
                        <RunButton onClick={page3_input2} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[360px] shrink-0 pt-0.5">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_3} minHeightClass="min-h-[170px]" />
                  </div>
                </div>
              </div>
            ) : pageIndex === 3 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You can declare a variable as <Tone color="red">constant</Tone> if you don't want
                  <br />
                  yourself or others to change it's value:
                </p>

                <div className="flex items-start gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="w-[450px] shrink-0">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">const </Tone>
                              <Tone color="blue">int </Tone>
                              <span>num = </span>
                              <Tone color="red">15</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <span>num = </span>
                              <Tone color="red">30</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page4_input1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <p className="w-full text-[19px] leading-tight">
                      You should always declare the variable as <Tone color="red">constant</Tone>
                      <br />
                      if you know it's unlikely to change:
                    </p>

                    <div className="w-[450px] shrink-0">
                      <CodeEditor
                        code={[
                          <>
                            <Tone color="blue">const </Tone>
                            <Tone color="blue">float </Tone>
                            <span>pi = </span>
                            <Tone color="red">3.14</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                          <>
                            <Tone color="blue">const </Tone>
                            <Tone color="blue">int </Tone>
                            <span>secondsPerMinute = </span>
                            <Tone color="red">60</Tone>
                            <Tone color="dark">;</Tone>
                          </>,
                        ]}
                        activeLineIndex={-1}
                      />
                    </div>
                  </div>

                  <div className="w-[360px] shrink-0 pt-4">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_4} minHeightClass="min-h-[134px]" />
                    <div className="mt-2 min-h-[1.75rem] text-[18px] leading-tight">
                      {page4Result.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="w-full text-[19px] leading-tight">
                  A <Tone color="red">constant</Tone> variable should be assigned a value
                  <br />
                  on declaration or it will be initialized with a garbage
                  <br />
                  value and wouldn't be able to change (since it's a const).
                </p>
              </div>
            ) : pageIndex === 4 ? (
              <div className="relative space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You can combine text with viriables, and also
                  <br />
                  combine different variable types:
                </p>

                <div className="flex items-start gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="w-[735px] shrink-0">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>age = </span>
                              <Tone color="red">30</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <Tone color="blue">char </Tone>
                              <span>letter = </span>
                              <Tone color="red">'A'</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"My name starts with %c and I'm %d years old\n"</Tone>
                              <span>, letter, age);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page5_input1} className="absolute bottom-9 right-3" />
                      </div>
                    </div>

                    <div className="w-[550px] shrink-0">
                      <p className="text-[19px] leading-tight">
                        You can also print values directly,
                        <br />
                        without using any stores varuables:
                      </p>
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <span>printf(</span>
                              <Tone color="red">"My favorite number is: %d\n"</Tone>
                              <span>, </span>
                              <Tone color="red">27</Tone>
                              <span>);</span>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"My favorite letter is: %c\n"</Tone>
                              <span>, </span>
                              <Tone color="red">'K'</Tone>
                              <span>);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page5_input2} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-0 top-[13.5rem] w-[465px] shrink-0">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_5} minHeightClass="min-h-[110px]" />
                  </div>
                </div>

                <p className="text-[19px] leading-tight">
                  Remember to use quotes <Tone color="red">' '</Tone> when working with <Tone color="blue">chars</Tone>.
                  <br />
                  But not with <Tone color="blue">ints</Tone> or <Tone color="blue">floats</Tone>.
                </p>
              </div>
            ) : pageIndex === 5 ? (
              <div className="space-y-3 text-left">
                <p className="text-[19px] leading-tight">Fill in the missing code:</p>

                <div className="w-[1015px] shrink-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <VariablesExerciseEditor
                      value1={page6Value1}
                      value2={page6Value2}
                      value3={page6Value3}
                      value4={page6Value4}
                      value5={page6Value5}
                      value6={page6Value6}
                      onValue1={setPage6Value1}
                      onValue2={setPage6Value2}
                      onValue3={setPage6Value3}
                      onValue4={setPage6Value4}
                      onValue5={setPage6Value5}
                      onValue6={setPage6Value6}
                    />
                    <RunButton onClick={page6_input1} className="absolute right-4 top-[5.6rem]" />
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-[650px] shrink-0">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_6} minHeightClass="min-h-[136px]" />
                  </div>

                  <div className="min-h-[7rem] pt-[1.36rem] space-y-0.5 text-[17px] leading-tight">
                    {page6Result.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : pageIndex === 6 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You can assign a new value to an existing variable,
                  <br />
                  it will overwrite the previous value:
                </p>

                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="w-[435px]">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>num = </span>
                              <Tone color="red">30</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            'num = 55',
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d"</Tone>
                              <span>, num);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page7_input1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <div className="w-[435px]">
                      <p className="text-[19px] leading-tight">
                        You can also asign the value of one
                        <br />
                        variable to another:
                      </p>
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>num = </span>
                              <Tone color="red">20</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <Tone color="blue">int </Tone>
                              <span>new_num = </span>
                              <Tone color="red">15</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            'num = new_num;',
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d"</Tone>
                              <span>, num);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page7_input2} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[400px] shrink-0 pt-0">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_7} minHeightClass="min-h-[135px]" />
                  </div>
                </div>

                <p className="w-full text-[19px] leading-tight">
                  Notice that you don't need to write <Tone color="blue">int</Tone> before every usage
                  <br />
                  of our variable <Tone color="red">num</Tone>. We only need to write it at the
                  <br />
                  declaration (the creation) of the variable.
                </p>
              </div>
            ) : pageIndex === 7 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You can declare a variable without
                  <br />
                  assigning it a value:
                </p>

                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="w-[435px]">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>num;</span>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d"</Tone>
                              <span>, num);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page8_input1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <p className="w-full text-[19px] leading-tight">
                      Printing it will give us a garbage result, a garbage
                      <br />
                      number from the allocated memory location.
                    </p>

                    <div>
                      <p className="w-full text-[19px] leading-tight">
                        We can asign a new value to the variable we
                        <br />
                        previously declared, a completely new value,
                        <br />
                        or initiate it with another variable:
                      </p>
                      <div className="w-[435px]">
                        <div className="relative">
                          <CodeEditor
                            code={[
                              <>
                                <Tone color="blue">int </Tone>
                                <span>num;</span>
                              </>,
                              <>
                                <Tone color="blue">int </Tone>
                                <span>new_num = </span>
                                <Tone color="red">33</Tone>
                                <Tone color="dark">;</Tone>
                              </>,
                              'num = new_num;',
                              <>
                                <span>printf(</span>
                                <Tone color="red">"%d"</Tone>
                                <span>, num);</span>
                              </>,
                            ]}
                            activeLineIndex={-1}
                          />
                          <RunButton onClick={page8_input2} className="absolute bottom-2 right-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[400px] shrink-0 pt-0">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_8} minHeightClass="min-h-[135px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You can declare multiple variables <Tone color="red">of the same type</Tone>
                  <br />
                  using a comma <Tone color="red">,</Tone> to separate them:
                </p>

                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div>
                      <LessonChip text="Input" />
                      <div className="relative w-[420px] shrink-0">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>x = </span>
                              <Tone color="red">12</Tone>
                              <span>, y = </span>
                              <Tone color="red">6</Tone>
                              <span>, z = </span>
                              <Tone color="red">35</Tone>
                              <Tone color="dark">;</Tone>
                            </>,
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d,%d,%d"</Tone>
                              <span>, x, y, z);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page9_input1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <div>
                      <p className="text-[19px] leading-tight">Or asign the same value to multiple variables:</p>
                      <div className="relative w-[420px] shrink-0">
                        <CodeEditor
                          code={[
                            <>
                              <Tone color="blue">int </Tone>
                              <span>x, y, z;</span>
                            </>,
                            'x = y = z = 71;',
                            <>
                              <span>printf(</span>
                              <Tone color="red">"%d,%d,%d"</Tone>
                              <span>, x, y, z);</span>
                            </>,
                          ]}
                          activeLineIndex={-1}
                        />
                        <RunButton onClick={page9_input2} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[400px] shrink-0 -mt-px">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_9} minHeightClass="min-h-[135px]" />
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.4rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />

            {!showMorePage && (
              <div className="flex items-center gap-1.5">
                {pageIndex === 5 && (
                  <HintButton widthClass="w-[330px]">
                    In order:
                    <br />
                    <Tone color="red">%d</Tone>, bob, <Tone color="red">%c</Tone>, <Tone color="red">%c</Tone>, math, geo.
                  </HintButton>
                )}
                <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
              </div>
            )}
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LessonPage;
