'use client';

import { KeyboardEvent, ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/components/lesson/ui';

function TerminalInput({
  value,
  onChange,
  onSubmit,
  widthClass,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  widthClass: string;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      className={`h-8 rounded border border-slate-500 bg-white px-1.5 text-[16px] text-slate-900 ${widthClass}`}
    />
  );
}

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

function UserInputExerciseEditor({
  value1,
  value2,
  value3,
  value4,
  onValue1,
  onValue2,
  onValue3,
  onValue4,
}: {
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  onValue1: (value: string) => void;
  onValue2: (value: string) => void;
  onValue3: (value: string) => void;
  onValue4: (value: string) => void;
}) {
  const lineClass = 'flex items-center whitespace-pre font-mono text-[17px] leading-7 text-slate-900';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-[#3c4455] shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className="select-none bg-[#3c4455] py-1 text-[17px] leading-7 text-[#c2c7d1]">
          {[1, 2, 3, 4].map((line) => (
            <div key={line} className="text-center font-mono">
              {line}
            </div>
          ))}
        </div>
        <div className="bg-white px-1 py-1 font-mono text-[17px] leading-7 text-slate-900">
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>num;</span>
          </div>
          <div className={lineClass}>
            <span>printf(</span>
            <Tone color="red">"Enter a number: \n"</Tone>
            <span>);</span>
          </div>
          <div className={lineClass}>
            <span>scanf(</span>
            <Tone color="red">"</Tone>
            <InlineInput value={value1} onChange={onValue1} widthClass="w-[2.3ch]" />
            <Tone color="red">d"</Tone>
            <span>, </span>
            <InlineInput value={value2} onChange={onValue2} widthClass="w-[2.3ch]" />
            <span>num);</span>
          </div>
          <div className={lineClass}>
            <span>printf(</span>
            <Tone color="red">"Your numbers is: </Tone>
            <InlineInput value={value3} onChange={onValue3} widthClass="w-[5.6ch]" />
            <Tone color="red">"</Tone>
            <span>, </span>
            <InlineInput value={value4} onChange={onValue4} widthClass="w-[4.3ch]" />
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
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 3;

  const [Output_1, setOutput_1] = useState<ReactNode[]>([<EmptyLine key="u1-empty" />]);
  const [terminalValue1, setTerminalValue1] = useState('');
  const [waitingForPage1Input, setWaitingForPage1Input] = useState(false);

  const [Output_2, setOutput_2] = useState<ReactNode[]>([<EmptyLine key="u2-empty" />]);
  const [terminalValue2, setTerminalValue2] = useState('');
  const [waitingForPage2Input, setWaitingForPage2Input] = useState(false);

  const [Output_3, setOutput_3] = useState<ReactNode[]>([<EmptyLine key="u3-empty" />]);
  const [terminalValue3, setTerminalValue3] = useState('');
  const [page3Mode, setPage3Mode] = useState<'scanf' | 'fgets' | null>(null);

  const [Output_4, setOutput_4] = useState<ReactNode[]>([<EmptyLine key="u4-empty" />]);
  const [page4Value1, setPage4Value1] = useState('');
  const [page4Value2, setPage4Value2] = useState('');
  const [page4Value3, setPage4Value3] = useState('');
  const [page4Value4, setPage4Value4] = useState('');
  const [page4Result, setPage4Result] = useState<ReactNode[]>([]);
  const [terminalValue4, setTerminalValue4] = useState('');
  const [waitingForPage4Input, setWaitingForPage4Input] = useState(false);

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
        <Tone color="green">// Create a variable to store the user value</Tone>
      </>,
      <>
        <Tone color="blue">int </Tone>
        <span>num;</span>
      </>,
      <>
        <Tone color="green">// Ask the user for a value</Tone>
      </>,
      <>
        printf(<Tone color="red">"Enter a number: \n"</Tone>);
      </>,
      <>
        <Tone color="green">// Get and save the value from the user</Tone>
      </>,
      <>
        scanf(<Tone color="red">"%d"</Tone>, &num);
      </>,
      <>
        <Tone color="green">// print out the saved user value</Tone>
      </>,
      <>
        printf(<Tone color="red">"Your numbers is: %d"</Tone>, num);
      </>,
    ],
    []
  );

  const page2Code = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <span>num;</span>
      </>,
      <>
        <Tone color="blue">char </Tone>
        <span>chr;</span>
      </>,
      <EmptyLine key="u2-empty-code" />,
      <>
        printf(<Tone color="red">"Enter a number and a character, then press enter: \n"</Tone>);
      </>,
      <>
        scanf(<Tone color="red">"%d, %c"</Tone>, &num, &char);
      </>,
      <>
        printf(<Tone color="red">"Your numbers is: %d"</Tone>, num);
      </>,
      <>
        printf(<Tone color="red">"Your character is: %c"</Tone>, chr);
      </>,
    ],
    []
  );

  const page3CodeA = useMemo(
    () => [
      <>
        <Tone color="blue">char </Tone>
        <span>name[</span>
        <Tone color="red">30</Tone>
        <span>];</span>
      </>,
      <>
        printf(<Tone color="red">"Enter your name: \n"</Tone>);
      </>,
      <>
        scanf(<Tone color="red">"%s"</Tone>, name);
      </>,
      <>
        printf(<Tone color="red">"Hello %s, how are you?"</Tone>, name);
      </>,
    ],
    []
  );

  const page3CodeB = useMemo(
    () => [
      <>
        <Tone color="blue">char </Tone>
        <span>name[</span>
        <Tone color="red">30</Tone>
        <span>];</span>
      </>,
      <>
        printf(<Tone color="red">"Enter your name: \n"</Tone>);
      </>,
      'fgets(name,sizeof(name),stdin);',
      <>
        printf(<Tone color="red">"Hello %s, how are you?"</Tone>, name);
      </>,
    ],
    []
  );

  const page1_input1 = () => {
    setOutput_1([<Tone key="u1-prompt" color="white">Enter a number:</Tone>]);
    setTerminalValue1('');
    setWaitingForPage1Input(true);
  };

  const page1_submit = () => {
    if (!waitingForPage1Input) {
      return;
    }
    const parsed = Number.parseInt(terminalValue1, 10);
    if (Number.isNaN(parsed)) {
      setOutput_1([
        <Tone key="u1-out-1" color="white">Enter a number:</Tone>,
        <Tone key="u1-out-2" color="red">Error!</Tone>,
      ]);
    } else {
      setOutput_1([
        <Tone key="u1-out-1" color="white">Enter a number:</Tone>,
        <Tone key="u1-out-2" color="white">Your number is: {parsed}</Tone>,
      ]);
    }
    setWaitingForPage1Input(false);
  };

  const page2_input1 = () => {
    setOutput_2([
      <Tone key="u2-prompt" color="white">Enter a number and a character, then press enter:</Tone>,
    ]);
    setTerminalValue2('');
    setWaitingForPage2Input(true);
  };

  const page2_submit = () => {
    if (!waitingForPage2Input) {
      return;
    }

    const trimmed = terminalValue2.trim();
    let numberPart = '';
    let charPart = '';

    if (trimmed.includes(' ')) {
      const normalized = trimmed.replace(/\s+/g, ' ').trim();
      const pieces = normalized.split(' ', 2);
      if (/^-?\d+$/.test(pieces[0] ?? '')) {
        numberPart = pieces[0];
        charPart = (pieces[1] ?? '').charAt(0) || '?';
      } else {
        numberPart = '32784';
        charPart = '?';
      }
    } else {
      for (const ch of trimmed) {
        if (/\d/.test(ch) && charPart === '') {
          numberPart += ch;
        } else if (charPart === '') {
          charPart = ch;
          break;
        }
      }

      if (numberPart === '') {
        numberPart = '32784';
        charPart = '?';
      } else if (charPart === '') {
        return;
      }
    }

    setOutput_2([
      <Tone key="u2-out-1" color="white">Enter a number and a character, then press enter:</Tone>,
      <Tone key="u2-out-2" color="white">Your number is: {numberPart}</Tone>,
      <Tone key="u2-out-3" color="white">Your character is: {charPart}</Tone>,
    ]);
    setWaitingForPage2Input(false);
  };

  const page3_input1 = () => {
    setOutput_3([<Tone key="u3-out-a" color="white">Enter your name:</Tone>]);
    setTerminalValue3('');
    setPage3Mode('scanf');
  };

  const page3_input2 = () => {
    setOutput_3([<Tone key="u3-out-b" color="white">Enter your name:</Tone>]);
    setTerminalValue3('');
    setPage3Mode('fgets');
  };

  const page3_submit = () => {
    if (!page3Mode) {
      return;
    }
    const trimmed = terminalValue3.trim();
    if (page3Mode === 'scanf') {
      const firstWord = trimmed.replace(/\s+/g, ' ').trim().split(' ', 1)[0] ?? '';
      setOutput_3([
        <Tone key="u3-out-1" color="white">Enter your name:</Tone>,
        <Tone key="u3-out-2" color="white">Hello {firstWord}, how are you ?</Tone>,
      ]);
    } else {
      setOutput_3([
        <Tone key="u3-out-1" color="white">Enter your name:</Tone>,
        <Tone key="u3-out-2" color="white">Hello {trimmed}, how are you ?</Tone>,
      ]);
    }
    setPage3Mode(null);
  };

  const page4_input1 = () => {
    if (page4Value1 === '%' && page4Value2 === '&' && page4Value3 === '%d' && page4Value4 === 'num') {
      setPage4Result([<Tone key="u4-correct" color="green">Correct!</Tone>]);
      setOutput_4([<Tone key="u4-prompt" color="white">Enter a number:</Tone>]);
      setTerminalValue4('');
      setWaitingForPage4Input(true);
      return;
    }

    setPage4Result([<Tone key="u4-wrong" color="red">Wrong!</Tone>]);
    setOutput_4([<EmptyLine key="u4-empty-again" />]);
    setWaitingForPage4Input(false);
  };

  const page4_submit = () => {
    if (!waitingForPage4Input) {
      return;
    }
    const parsed = Number.parseInt(terminalValue4, 10);
    if (Number.isNaN(parsed)) {
      setOutput_4([
        <Tone key="u4-out-1" color="white">Enter a number:</Tone>,
        <Tone key="u4-out-2" color="red">Error!</Tone>,
      ]);
    } else {
      setOutput_4([
        <Tone key="u4-out-1" color="white">Enter a number:</Tone>,
        <Tone key="u4-out-2" color="white">Your number is: {parsed}</Tone>,
      ]);
    }
    setWaitingForPage4Input(false);
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="User Input">
        <div className="relative w-[1090px] max-w-none">
          <HomeButton />

          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  To receive user input, you can use the <Tone color="red">scanf()</Tone> function:
                </p>

                <div className="flex items-start justify-between gap-8">
                  <div className="w-[475px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page1Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page1_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>

                  <div className="w-[365px] shrink-0 pt-[3.6rem]">
                    <LessonChip text="output" />
                    <OutputPanel
                      lines={[
                        ...Output_1,
                        waitingForPage1Input ? (
                          <TerminalInput
                            key="u1-input"
                            value={terminalValue1}
                            onChange={setTerminalValue1}
                            onSubmit={page1_submit}
                            widthClass="w-[10ch]"
                          />
                        ) : null,
                      ].filter(Boolean) as ReactNode[]}
                      minHeightClass="min-h-[150px]"
                    />
                  </div>
                </div>

                <div className="w-full text-[18px] leading-tight">
                  <div>The <Tone color="red">scanf()</Tone> function takes two arguments:</div>
                  <div className="ml-2">● The format specifier of the variable</div>
                  <div className="ml-6"><Tone color="red">(%d</Tone> in this example)</div>
                  <div className="ml-2">● The reference operator, stores the memory</div>
                  <div className="ml-6">address of the variable <Tone color="red">(&num)</Tone></div>
                  <div className="mt-1 text-[16px] leading-tight"><Tone color="red">*</Tone>You will learn more about <Tone color="red">memory addresses</Tone> in the</div>
                  <div className="text-[16px] leading-tight">next chapter</div>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="space-y-2 text-left">
                <div className="text-[22px] leading-none underline underline-offset-4">Multiple Inputs</div>
                <p className="w-full text-[19px] leading-tight">
                  The <Tone color="red">scanf()</Tone> function allows multiple inputs.
                  <br />
                  An example with an <Tone color="red">int</Tone> and a <Tone color="red">char</Tone>:
                </p>

                <div className="relative min-h-[420px]">
                  <div className="w-[660px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page2Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page2_input1} className="absolute bottom-2 right-3" />
                    </div>
                    <div className="pt-1">
                      <LessonChip text="output" />
                      <OutputPanel
                        lines={[
                          ...Output_2,
                          waitingForPage2Input ? (
                            <TerminalInput
                              key="u2-input"
                              value={terminalValue2}
                              onChange={setTerminalValue2}
                              onSubmit={page2_submit}
                              widthClass="w-[18ch]"
                            />
                          ) : null,
                        ].filter(Boolean) as ReactNode[]}
                        minHeightClass="min-h-[118px]"
                      />
                    </div>
                  </div>

                  <div className="absolute right-0 top-0 w-[320px] text-[18px] leading-tight text-white">
                    <p>
                      In this example C will take the input
                      string and split it into an <Tone color="red">int</Tone> and a
                      <Tone color="red">char</Tone>, so if the user enters an input
                      that doesn't follow the structure
                      <Tone color="blue">"intchar"</Tone> (for example <Tone color="red">"123a"</Tone>), the
                      output could be incorrect.
                    </p>
                    <div className="pt-2">● Entering an int and multiple chars <Tone color="red">(123xyz)</Tone></div>
                    <div> will return the int and the first char.</div>
                    <div>● Entering a string that starts with a char <Tone color="red">(a234)</Tone></div>
                    <div> will return two garbage values.</div>
                    <div>● Entering an int and 2 chars <Tone color="red">(123xy)</Tone> will</div>
                    <div> return the int and the first char.</div>
                    <div>● Entering a single int <Tone color="red">(123)</Tone> will make the</div>
                    <div> console wait for a second input (the <Tone color="red">char</Tone>)</div>
                    <div className="pt-2 text-[17px]"><Tone color="red">*</Tone> For this reason, it's better to take multiple</div>
                    <div className="text-[17px]"><Tone color="red">separate</Tone> user inputs, instead of taking them all</div>
                    <div className="text-[17px]">in a single <Tone color="red">scanf()</Tone>.</div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 2 ? (
              <div className="space-y-2 text-left">
                <p className="w-full text-[19px] leading-tight">
                  You can also receive a <Tone color="red">string</Tone> from a user:
                </p>

                <div className="relative min-h-[470px]">
                  <div className="w-[500px] shrink-0 space-y-2">
                    <div>
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={page3CodeA} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={page3_input1} className="absolute bottom-2 right-3" />
                      </div>
                    </div>

                    <div className="w-full text-[18px] leading-tight">
                      <div>When using <Tone color="red">scanf()</Tone> on a string:</div>
                      <div>● you don't have to use the reference operator <Tone color="red">&</Tone>.</div>
                      <div>● You must specify the size of the string in advance. In this</div>
                      <div> example we used <Tone color="red">30</Tone>. If the user write a string larger than 30</div>
                      <div> characters, this will lead to a Segmentation fault (<Tone color="red">Error</Tone>).</div>
                      <div>● <Tone color="red">scanf()</Tone> considers space as a terminating character which</div>
                      <div> means that it will only display a single word. If you'll write 2</div>
                      <div> words, it will only display the first.</div>
                    </div>

                    <p className="w-full text-[18px] leading-tight">
                      A solution to the 1 word limit would be the function <Tone color="red">fgets()</Tone>. This
                      function can read a line of text:
                    </p>

                    <div>
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor code={page3CodeB} lineStart={1} activeLineIndex={-1} />
                        <RunButton onClick={page3_input2} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-0 top-[7.8rem] w-[485px] shrink-0">
                    <LessonChip text="output" />
                    <OutputPanel
                      lines={[
                        ...Output_3,
                        page3Mode ? (
                          <TerminalInput
                            key="u3-input"
                            value={terminalValue3}
                            onChange={setTerminalValue3}
                            onSubmit={page3_submit}
                            widthClass="w-[18ch]"
                          />
                        ) : null,
                      ].filter(Boolean) as ReactNode[]}
                      minHeightClass="min-h-[170px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">
                  Fill in the empty boxes to make the program run
                  <br />
                  correctly:
                </p>

                <div className="relative min-h-[390px]">
                  <div className="w-[475px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <UserInputExerciseEditor
                        value1={page4Value1}
                        value2={page4Value2}
                        value3={page4Value3}
                        value4={page4Value4}
                        onValue1={setPage4Value1}
                        onValue2={setPage4Value2}
                        onValue3={setPage4Value3}
                        onValue4={setPage4Value4}
                      />
                      <RunButton onClick={page4_input1} className="absolute bottom-2 right-3" />
                    </div>

                    <div className="pt-2">
                      <LessonChip text="output" />
                      <OutputPanel
                        lines={[
                          ...Output_4,
                          waitingForPage4Input ? (
                            <TerminalInput
                              key="u4-input"
                              value={terminalValue4}
                              onChange={setTerminalValue4}
                              onSubmit={page4_submit}
                              widthClass="w-[10ch]"
                            />
                          ) : null,
                        ].filter(Boolean) as ReactNode[]}
                        minHeightClass="min-h-[150px]"
                      />
                    </div>
                  </div>

                  <div className="absolute right-[170px] top-[10.2rem] w-[335px] rounded-sm bg-[#e7e7e7] px-3 py-2 text-left text-[16px] leading-tight text-[#5b5b5b] opacity-0 pointer-events-none">
                    hidden
                  </div>

                  <div className="absolute right-0 top-[10.25rem] w-[335px] rounded-sm bg-[#e7e7e7] px-3 py-2 text-left text-[16px] leading-tight text-[#5b5b5b] opacity-0" />
                </div>

                <div className="min-h-[2rem] text-[18px] leading-tight">
                  {page4Result.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="mt-[2.5rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <div className="flex items-center gap-1.5">
              {pageIndex === 3 && (
                <HintButton widthClass="w-[300px]">
                  <Tone color="red">%</Tone>, <Tone color="red">&</Tone>, <Tone color="red">%d</Tone>, num
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
