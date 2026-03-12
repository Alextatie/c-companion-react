'use client';

import { ReactNode, useMemo, useState } from 'react';
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

function InlineInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-8 rounded border border-slate-400 bg-white px-1 text-[16px] text-slate-900 ${className}`}
    />
  );
}

function FunctionsExerciseEditor({
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((line) => (
            <div key={line} className="text-center font-mono">
              {line}
            </div>
          ))}
        </div>
        <div className="bg-white px-1 py-1 font-mono text-[17px] leading-7 text-slate-900">
          <div className={lineClass}>
            <InlineInput value={value1} onChange={onValue1} className="w-[3.2ch]" />
            <span> multiply(</span>
            <Tone color="blue">int </Tone>
            <span>a, </span>
            <Tone color="blue">int </Tone>
            <span>b);</span>
          </div>
          <EmptyLine />
          <div className={lineClass}><Tone color="blue">int </Tone><span>main() {'{'}</span></div>
          <div className={lineClass}><Tone color="blue">int </Tone><span>num1 = </span><Tone color="red">3</Tone><span>, num2 = </span><Tone color="red">4</Tone><span>;</span></div>
          <div className={lineClass}><Tone color="blue">int </Tone><span>result = </span><InlineInput value={value2} onChange={onValue2} className="w-[8ch]" /><span>(num1, num2);</span></div>
          <div className={lineClass}>printf(<Tone color="red">"%d * %d = %d\n"</Tone>, num1, num2, result);</div>
          <div className={lineClass}><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></div>
          <div className={lineClass}>{'}'}</div>
          <EmptyLine />
          <div className={lineClass}><InlineInput value={value3} onChange={onValue3} className="w-[3.2ch]" /><span> multiply(</span><Tone color="blue">int </Tone><span>a, </span><Tone color="blue">int </Tone><span>b) {'{'}</span></div>
          <div className={lineClass}><Tone color="blue">return </Tone><InlineInput value={value4} onChange={onValue4} className="w-[4.6ch]" /><span>;</span></div>
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
  const isLastPage = pageIndex === 11;

  const blankOutput = useMemo(() => [<EmptyLine key="blank" />], []);
  const [pageOutput, setPageOutput] = useState<Record<number, ReactNode[]>>({
    0: blankOutput,
    1: blankOutput,
    2: blankOutput,
    3: blankOutput,
    4: blankOutput,
    5: blankOutput,
    6: blankOutput,
    7: blankOutput,
    8: blankOutput,
    9: blankOutput,
    10: blankOutput,
    11: ['3 * 4 = 12'],
  });
  const [pageMessage, setPageMessage] = useState<Record<number, ReactNode[]>>({});
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');

  const setOutput = (page: number, lines: ReactNode[]) => {
    setPageOutput((prev) => ({ ...prev, [page]: lines }));
  };

  const setMessage = (page: number, lines: ReactNode[]) => {
    setPageMessage((prev) => ({ ...prev, [page]: lines }));
  };

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

  const renderNav = () => (
    <div className="mt-[2.5rem] flex items-center justify-between">
      <LessonBackButton onClick={onBack} />
      <div className="flex items-center gap-1.5">
        {pageIndex === 11 && (
          <HintButton widthClass="w-[315px]">
            <span><Tone color="blue">int</Tone>, multiply, <Tone color="blue">int</Tone>, a*b</span>
            <div>&nbsp;</div>
          </HintButton>
        )}
        <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
      </div>
    </div>
  );

  const renderFrame = (content: ReactNode) => (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame
        baseWidth={1090}
        title="Functions"
      >
        <div className="relative w-[1090px] max-w-none">
          <HomeButton />
          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">{content}</section>
          {renderNav()}
        </div>
      </ScaledLessonFrame>
    </div>
  );

  const runExercise = () => {
    const a = value1.replace(/ /g, '');
    const b = value2.replace(/ /g, '');
    const c = value3.replace(/ /g, '');
    const d = value4.replace(/ /g, '');

    if (a === 'int' && b === 'multiply' && c === 'int' && (d === 'a*b' || d === 'a*b' || d === 'a*b')) {
      setMessage(11, [<Tone key="ok" color="green">Correct!</Tone>]);
      return;
    }

    if (a === 'int' && b === 'multiply' && c === 'int' && (d === 'a * b' || d === 'b * a' || d === 'b*a')) {
      setMessage(11, [<Tone key="ok2" color="green">Correct!</Tone>]);
      return;
    }

    setMessage(11, [<Tone key="wrong" color="red">Wrong!</Tone>]);
  };
  if (pageIndex === 0) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[520px]">
          <p className="text-[22px] leading-tight">A <Tone color="red">function</Tone> is a block of code which only runs when it's called.</p>
          <h2 className="text-[3rem] leading-none underline">Creating your own function</h2>
          <div className="w-[290px]">
            <CodeEditor code={[<><Tone color="blue">type </Tone><span>name() {'{'}</span></>, <><Tone color="green">// code to be executed</Tone></>, <span>{'}'}</span>]} lineStart={1} activeLineIndex={-1} />
          </div>
          <h2 className="text-[3rem] leading-none underline">Calling your function</h2>
          <p className="text-[22px] leading-tight">Creating a function does not execute it automatically.</p>
        </div>
        <div className="absolute right-[120px] top-[6rem] w-[342px] space-y-2">
          <LessonChip text="Input" />
          <CodeEditor code={[
            <><Tone color="blue">void </Tone><span>myFunc() {'{'}</span></>,
            <>printf(<Tone color="red">"I'm inside a function!"</Tone>);</>,
            <span>{'}'}</span>,
            <EmptyLine key="f0-empty" />,
            <><Tone color="blue">int </Tone><span>main() {'{'}</span></>,
            <>myFunc();</>,
            <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>,
            <span>{'}'}</span>,
          ]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(0, ["I'm inside a function!"])} />} activeLineIndex={6} />
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[0]} minHeightClass="min-h-[88px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 1) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <p className="pb-4 text-[22px] leading-tight">You can put almost whatever you want inside a function.</p>
        <div className="w-[392px]">
          <LessonChip text="Input" />
          <CodeEditor code={[
            <><Tone color="blue">void </Tone><span>calculate() {'{'}</span></>,
            <><Tone color="blue">int </Tone><span>x = </span><Tone color="red">3</Tone><span>, y = </span><Tone color="red">2</Tone><span>;</span></>,
            <><Tone color="blue">int </Tone><span>multi = x * y;</span></>,
            <>printf(<Tone color="red">"The result is: %d\n"</Tone>, multi);</>,
            <span>{'}'}</span>,
            <EmptyLine key="f1-empty" />,
            <><Tone color="blue">int </Tone><span>main() {'{'}</span></>,
            <>calculate();</>,
            <>printf(<Tone color="red">"This was printed in the main\n"</Tone>);</>,
            <><Tone color="blue">int </Tone><span>useless_var = </span><Tone color="red">10</Tone><span>;</span></>,
            <>calculate();</>,
            <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>,
            <span>{'}'}</span>,
          ]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(1, ['The result is: 6', 'This was printed in the main', 'The result is: 6'])} />} activeLineIndex={11} />
        </div>
        <div className="absolute right-[188px] top-[11rem] w-[340px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[1]} minHeightClass="min-h-[132px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 2) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="pr-[520px]">
          <h2 className="text-[3rem] leading-none underline">Parameters and Arguments</h2>
          <p className="text-[22px] leading-tight">Information can be passed to functions as <Tone color="red">parameters</Tone>.</p>
          <div className="w-[392px] pt-3">
            <LessonChip text="Input" />
            <CodeEditor code={[
              <><Tone color="blue">void </Tone><span>greeting(</span><Tone color="blue">char </Tone><span>name[]) {'{'}</span></>,
              <>printf(<Tone color="red">"Hello %s\n"</Tone>, name);</>,
              <span>{'}'}</span>,
              <EmptyLine key="f2-empty" />,
              <><Tone color="blue">int </Tone><span>main() {'{'}</span></>,
              <>greeting(<Tone color="red">"Alex"</Tone>);</>,
              <>greeting(<Tone color="red">"Bob"</Tone>);</>,
              <>greeting(<Tone color="red">"Moshe"</Tone>);</>,
              <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>,
              <span>{'}'}</span>,
            ]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(2, ['Hello Alex', 'Hello Bob', 'Hello Moshe'])} />} activeLineIndex={8} />
          </div>
        </div>
        <div className="absolute right-[150px] top-[6rem] w-[340px] space-y-2">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[2]} minHeightClass="min-h-[134px]" />
          <p className="text-[20px] leading-tight">When a parameter is passed to a function, it's called an argument.</p>
        </div>
      </div>
    );
  }

  if (pageIndex === 3) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="pr-[520px]">
          <h2 className="text-[3rem] leading-none underline">Multiple Parameters</h2>
          <LessonChip text="Input" />
          <div className="w-[535px] pt-3">
            <CodeEditor code={[
              <><Tone color="blue">void </Tone><span>info(</span><Tone color="blue">char </Tone><span>name[], </span><Tone color="blue">int </Tone><span>age) {'{'}</span></>,
              <>printf(<Tone color="red">"Hello %s, you are %d years old.\n"</Tone>, name, age);</>,
              <span>{'}'}</span>,
              <EmptyLine key="f3-empty" />,
              <><Tone color="blue">int </Tone><span>main() {'{'}</span></>,
              <>greeting(<Tone color="red">"Jenny"</Tone>, <Tone color="red">52</Tone>);</>,
              <>greeting(<Tone color="red">"Bill"</Tone>, <Tone color="red">24</Tone>);</>,
              <>greeting(<Tone color="red">"Biden"</Tone>, <Tone color="red">37</Tone>);</>,
              <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>,
              <span>{'}'}</span>,
            ]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(3, ['Hello Jenny, you are 52 years old.', 'Hello Bill, you are 24 years old.', 'Hello Biden, you are 37 years old.'])} />} activeLineIndex={8} />
          </div>
        </div>
        <div className="absolute right-[42px] top-[10.4rem] w-[442px] space-y-2">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[3]} minHeightClass="min-h-[135px]" />
          <p className="text-[20px] leading-tight">When working with multiple parameters, the function call must contain the same number of parameters as in the declaration.</p>
        </div>
      </div>
    );
  }

  if (pageIndex === 4) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="pr-[540px]">
          <h2 className="text-[3rem] leading-none underline">Arrays as Parameters</h2>
          <LessonChip text="Input" />
          <div className="w-[470px] pt-3">
            <CodeEditor code={[
              <><Tone color="blue">void </Tone><span>print_array(</span><Tone color="blue">int </Tone><span>nums[]) {'{'}</span></>,
              <><Tone color="blue">for </Tone><span>(</span><Tone color="blue">int </Tone><span>i = </span><Tone color="red">0</Tone><span>; i &lt; </span><Tone color="red">5</Tone><span>; i++) {'{'}</span></>,
              <>printf(<Tone color="red">"%d\n"</Tone>, nums[i]);</>,
              <span>{'}'}</span>,
              <span>{'}'}</span>,
              <EmptyLine key="f4-empty" />,
              <><Tone color="blue">int </Tone><span>main() {'{'}</span></>,
              <><Tone color="blue">int </Tone><span>my_numbers[</span><Tone color="red">5</Tone><span>] = {'{'} </span><Tone color="red">8,13,0,33,7</Tone><span>{'}'};</span></>,
              <>print_array(my_numbers)</>,
              <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>,
              <span>{'}'}</span>,
            ]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(4, ['8', '13', '0', '33', '7'])} />} activeLineIndex={9} />
          </div>
        </div>
        <div className="absolute right-[150px] top-[7rem] w-[340px] space-y-2">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[4]} minHeightClass="min-h-[154px]" />
          <p className="text-[20px] leading-tight">When passing an array, you use only the array name in the function call.</p>
        </div>
      </div>
    );
  }
  if (pageIndex === 5) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-4">
          <h2 className="text-[3rem] leading-none underline">Return Values</h2>
          <div className="flex items-start justify-between gap-10">
            <div className="w-[430px] space-y-3">
              <div className="w-[430px]"><CodeEditor code={[<><Tone color="blue">int </Tone><span>calculate(</span><Tone color="blue">int </Tone><span>x, </span><Tone color="blue">int </Tone><span>y) {'{'}</span></>, <><Tone color="blue">return </Tone><span>x + y;</span></>, <span>{'}'}</span>]} lineStart={1} activeLineIndex={-1} /></div>
              <div className="w-[430px]"><CodeEditor code={[<><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>printf(<Tone color="red">"The result is: %d\n"</Tone>, calculate(</>, <Tone color="red" key="c35">3, 5</Tone>, <span key="close1">));</span>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>]} lineStart={5} rightSlot={<RunButton onClick={() => setOutput(5, ['The result is: 8'])} />} activeLineIndex={3} /></div>
            </div>
            <div className="w-[430px] space-y-3 pt-[9.55rem]">
              <div className="w-[430px]"><CodeEditor code={[<><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <><Tone color="blue">int </Tone><span>result1 = calculate(</span><Tone color="red">3, 5</Tone><span>);</span></>, <><Tone color="blue">int </Tone><span>result2 = calculate(</span><Tone color="red">10, 20</Tone><span>);</span></>, <>printf(<Tone color="red">"Result 1 is: %d\n"</Tone>, result1);</>, <>printf(<Tone color="red">"Result 2 is: %d\n"</Tone>, result2);</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>]} lineStart={5} rightSlot={<RunButton onClick={() => setOutput(5, ['Result 1 is: 8', 'Result 2 is: 30'])} />} activeLineIndex={4} /></div>
            </div>
          </div>
          <div className="absolute right-[160px] top-[7rem] w-[420px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[5]} minHeightClass="min-h-[92px]" /></div>
        </div>
      </div>
    );
  }

  if (pageIndex === 6) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[3rem] leading-none underline">Scope</h2>
        <div className="flex items-start justify-between gap-12 pt-4 pr-[420px]">
          <div className="w-[250px]">
            <LessonChip text="Input" />
            <CodeEditor code={[<><Tone color="blue">void </Tone><span>func() {'{'}</span></>, <><Tone color="blue">int </Tone><span>x = </span><Tone color="red">5</Tone><span>;</span></>, <>printf(<Tone color="red">"%d"</Tone>, x);</>, <span>{'}'}</span>, <EmptyLine key="f6-empty" />, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>func();</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(6, ['5'])} />} activeLineIndex={7} />
          </div>
          <div className="w-[250px]">
            <LessonChip text="Input" />
            <CodeEditor code={[<><Tone color="blue">void </Tone><span>func() {'{'}</span></>, <><Tone color="blue">int </Tone><span>x = </span><Tone color="red">5</Tone><span>;</span></>, <span>{'}'}</span>, <EmptyLine key="f6-empty-b" />, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>func();</>, <>printf(<Tone color="red">"%d"</Tone>, x);</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(6, [<Tone key="e68" color="red">Error!</Tone>])} />} activeLineIndex={7} />
          </div>
        </div>
        <div className="absolute right-[120px] top-[9rem] w-[330px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[6]} minHeightClass="min-h-[84px]" /></div>
      </div>
    );
  }

  if (pageIndex === 7) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="flex items-start justify-between gap-12 pr-[420px]">
          <div className="w-[260px] space-y-3">
            <h2 className="text-[2.7rem] leading-none underline">global scope</h2>
            <LessonChip text="Input" />
            <CodeEditor code={[<><Tone color="blue">int </Tone><span>x = </span><Tone color="red">5</Tone><span>;</span></>, <EmptyLine key="f7-empty-a" />, <><Tone color="blue">void </Tone><span>func() {'{'}</span></>, <>printf(<Tone color="red">"%d"</Tone>, x);</>, <span>{'}'}</span>, <EmptyLine key="f7-empty-b" />, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>func();</>, <>printf(<Tone color="red">"%d"</Tone>, x);</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(7, ['5', '5'])} />} activeLineIndex={9} />
          </div>
          <div className="w-[260px] space-y-3">
            <h2 className="text-[2.7rem] leading-none underline">Naming</h2>
            <LessonChip text="Input" />
            <CodeEditor code={[<><Tone color="blue">int </Tone><span>x = </span><Tone color="red">5</Tone><span>;</span></>, <EmptyLine key="f7-empty-c" />, <><Tone color="blue">void </Tone><span>func() {'{'}</span></>, <><Tone color="blue">int </Tone><span>x = </span><Tone color="red">9</Tone><span>;</span></>, <>printf(<Tone color="red">"%d"</Tone>, x);</>, <span>{'}'}</span>, <EmptyLine key="f7-empty-d" />, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>func();</>, <>printf(<Tone color="red">"%d"</Tone>, x);</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(7, ['9', '5'])} />} activeLineIndex={10} />
          </div>
        </div>
        <div className="absolute right-[120px] top-[9rem] w-[330px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[7]} minHeightClass="min-h-[84px]" /></div>
      </div>
    );
  }

  if (pageIndex === 8) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[3rem] leading-none underline">Declaration and Definition</h2>
        <div className="flex items-start justify-between gap-12 pr-[350px] pt-4">
          <div className="w-[260px] space-y-3">
            <LessonChip text="Input" />
            <CodeEditor code={[<><Tone color="green">// function declaration</Tone></>, <><Tone color="blue">void </Tone><span>func();</span></>, <EmptyLine key="f8-empty-a" />, <><Tone color="green">// main</Tone></>, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>func();</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>, <EmptyLine key="f8-empty-b" />, <><Tone color="green">// function definition</Tone></>, <><Tone color="blue">void </Tone><span>func() {'{'}</span></>, <>printf(<Tone color="red">"I'm a function!"</Tone>);</>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(8, ["I'm a function!"])} />} activeLineIndex={11} />
          </div>
          <div className="w-[295px] space-y-3">
            <LessonChip text="Input" />
            <CodeEditor code={[<><Tone color="green">// function declaration</Tone></>, <><Tone color="blue">int </Tone><span>func(</span><Tone color="blue">int </Tone><span>x, </span><Tone color="blue">int </Tone><span>y);</span></>, <EmptyLine key="f8-empty-c" />, <><Tone color="green">// main</Tone></>, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <><Tone color="blue">int </Tone><span>result = func(</span><Tone color="red">7, 2</Tone><span>);</span></>, <>printf(<Tone color="red">"Result: %d"</Tone>, result);</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>, <EmptyLine key="f8-empty-d" />, <><Tone color="green">// function definition</Tone></>, <><Tone color="blue">int </Tone><span>func(</span><Tone color="blue">int </Tone><span>x, </span><Tone color="blue">int </Tone><span>y) {'{'}</span></>, <><Tone color="blue">return </Tone><span>x + y;</span></>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(8, ['Result: 9'])} />} activeLineIndex={12} />
          </div>
        </div>
        <div className="absolute right-[70px] top-[9rem] w-[260px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[8]} minHeightClass="min-h-[84px]" /></div>
      </div>
    );
  }

  if (pageIndex === 9) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[3rem] leading-none underline">Functions Calling Other Functions</h2>
        <div className="w-[300px] pt-4">
          <LessonChip text="Input" />
          <CodeEditor code={[<><Tone color="green">// declare both functions</Tone></>, <><Tone color="blue">void </Tone><span>func_a();</span></>, <><Tone color="blue">void </Tone><span>func_b();</span></>, <EmptyLine key="f9-empty-a" />, <><Tone color="green">// main</Tone></>, <><Tone color="blue">int </Tone><span>main() {'{'}</span></>, <>func_a();</>, <><Tone color="blue">return </Tone><Tone color="red">0</Tone><span>;</span></>, <span>{'}'}</span>, <EmptyLine key="f9-empty-b" />, <><Tone color="green">// first definition</Tone></>, <><Tone color="blue">void </Tone><span>func_a() {'{'}</span></>, <>printf(<Tone color="red">"First function!\n"</Tone>);</>, <>func_b();</>, <span>{'}'}</span>, <EmptyLine key="f9-empty-c" />, <><Tone color="green">// second definition</Tone></>, <><Tone color="blue">void </Tone><span>func_b() {'{'}</span></>, <>printf(<Tone color="red">"Second function!\n"</Tone>);</>, <span>{'}'}</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(9, ['First function!', 'Second function!'])} />} activeLineIndex={18} />
        </div>
        <div className="absolute left-[380px] top-[16.5rem] w-[310px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[9]} minHeightClass="min-h-[84px]" /></div>
      </div>
    );
  }

  if (pageIndex === 10) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[3rem] leading-none underline">Math functions</h2>
        <p className="text-[22px] leading-tight">There is a list of math functions available through the math.h header.</p>
        <div className="grid grid-cols-[1fr_1fr] gap-x-20 gap-y-8 pt-4 pr-[360px]">
          <div className="w-[300px] space-y-2"><CodeEditor code={[<>printf(<Tone color="red">"%f"</Tone>, sqrt(</>, <Tone color="red" key="sq1">16</Tone>, <span key="sq1c">));</span>, <>printf(<Tone color="red">"%f"</Tone>, sqrt(</>, <Tone color="red" key="sq2">25</Tone>, <span key="sq2c">));</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(10, ['4.000000', '5.000000'])} />} activeLineIndex={3} /></div>
          <div className="w-[300px] space-y-2"><CodeEditor code={[<>printf(<Tone color="red">"%f"</Tone>, pow(</>, <Tone color="red" key="pw1">5, 3</Tone>, <span key="pw1c">));</span>, <>printf(<Tone color="red">"%f"</Tone>, pow(</>, <Tone color="red" key="pw2">2, 8</Tone>, <span key="pw2c">));</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(10, ['125.000000', '256.000000'])} />} activeLineIndex={3} /></div>
          <div className="w-[300px] space-y-2"><CodeEditor code={[<>printf(<Tone color="red">"%f"</Tone>, ceil(</>, <Tone color="red" key="ce1">3.3</Tone>, <span key="ce1c">));</span>, <>printf(<Tone color="red">"%f"</Tone>, floor(</>, <Tone color="red" key="ce2">3.3</Tone>, <span key="ce2c">));</span>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(10, ['4.000000', '3.000000'])} />} activeLineIndex={3} /></div>
        </div>
        <div className="absolute right-[100px] top-[19rem] w-[286px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[10]} minHeightClass="min-h-[84px]" /></div>
      </div>
    );
  }

  return renderFrame(
    <div className="relative min-h-[560px] text-left">
      <p className="pb-5 text-[24px] leading-tight">Fill in the blanks in the following code segment to make it work with the expected output:</p>
      <div className="pr-[520px]">
        <LessonChip text="input" />
        <div className="w-[470px]"><FunctionsExerciseEditor value1={value1} value2={value2} value3={value3} value4={value4} onValue1={setValue1} onValue2={setValue2} onValue3={setValue3} onValue4={setValue4} /></div>
      </div>
      <div className="absolute right-[122px] top-[4.5rem] w-[266px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[11]} minHeightClass="min-h-[84px]" /></div>
      <div className="absolute right-[120px] top-[15.8rem] w-[340px] text-[18px] leading-tight">{pageMessage[11]}</div>
      <div className="absolute right-[120px] bottom-[3.2rem] w-[335px] rounded-sm border border-white/35 bg-white/80 px-4 py-2 text-[18px] leading-tight text-[#2d2d2d]"><div className="underline">Solution:</div><div><Tone color="blue">int</Tone>, multiply, <Tone color="blue">int</Tone>, a*b</div></div>
      <div className="absolute left-[395px] top-[17rem]"><RunButton onClick={runExercise} /></div>
    </div>
  );
}

export default LessonPage;
