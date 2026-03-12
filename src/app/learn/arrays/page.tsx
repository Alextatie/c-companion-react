'use client';

import { ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { EmptyLine, Tone } from '@/components/lesson/text';
import {
  ChoiceButtonGroup,
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

function ArraysExerciseEditor({
  limit,
  expression,
  onLimit,
  onExpression,
}: {
  limit: string;
  expression: string;
  onLimit: (value: string) => void;
  onExpression: (value: string) => void;
}) {
  const lineClass = 'flex items-center whitespace-pre font-mono text-[17px] leading-7 text-slate-900';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-[#3c4455] shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className="select-none bg-[#3c4455] py-1 text-[17px] leading-7 text-[#c2c7d1]">
          {[1, 2, 3, 4, 5, 6].map((line) => (
            <div key={line} className="text-center font-mono">
              {line}
            </div>
          ))}
        </div>
        <div className="bg-white px-1 py-1 font-mono text-[17px] leading-7 text-slate-900">
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>arr[] = {'{'} </span>
            <Tone color="red">1, 2, 3, 4, 5</Tone>
            <span>{'}'};</span>
          </div>
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>sum = </span>
            <Tone color="red">0</Tone>
            <span>;</span>
          </div>
          <div className={lineClass}>
            <Tone color="blue">for </Tone>
            <span>(int i = </span>
            <Tone color="red">0</Tone>
            <span>; i &lt; </span>
            <InlineInput value={limit} onChange={onLimit} className="w-[2.8ch]" />
            <span>; i++) {'{'}</span>
          </div>
          <div className={lineClass}>
            <span>  sum += </span>
            <InlineInput value={expression} onChange={onExpression} className="w-[8ch]" />
            <span>;</span>
          </div>
          <div className={lineClass}>{'}'}</div>
          <div className={lineClass}>
            <span>printf(</span>
            <Tone color="red">"The sum is: %d\n"</Tone>
            <span>, sum);</span>
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
  const isLastPage = pageIndex === 13;

  const blankOutput = useMemo(() => [<EmptyLine key="blank" />], []);
  const [pageOutput, setPageOutput] = useState<Record<number, ReactNode[]>>({
    0: blankOutput,
    1: blankOutput,
    2: blankOutput,
    3: blankOutput,
    4: blankOutput,
    5: blankOutput,
    7: blankOutput,
    8: blankOutput,
    9: blankOutput,
    10: blankOutput,
    11: blankOutput,
    12: blankOutput,
    13: blankOutput,
  });
  const [pageMessage, setPageMessage] = useState<Record<number, ReactNode[]>>({});
  const [page6Answer, setPage6Answer] = useState('');
  const [page14Limit, setPage14Limit] = useState('');
  const [page14Expression, setPage14Expression] = useState('');

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
        {pageIndex === 5 && <HintButton widthClass="w-[238px]">300<div>&nbsp;</div></HintButton>}
        {pageIndex === 13 && <HintButton widthClass="w-[285px]">{page14Hint.slice(1)}</HintButton>}
        <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
      </div>
    </div>
  );

  const renderFrame = (content: ReactNode) => (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame
        baseWidth={1090}
        title="Arrays"
      >
        <div className="relative w-[1090px] max-w-none">
          <HomeButton />
          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">{content}</section>
          {renderNav()}
        </div>
      </ScaledLessonFrame>
    </div>
  );

  const page14ChoiceClassName = '!rounded-sm !border-[#94c8aa] !bg-[#69ac8a] !text-white hover:!bg-[#94c8aa]';
  const page14Hint = [
    <div key="q1" className="underline">Question 1:</div>,
    <div key="q1v"><Tone color="red">5</Tone>, arr[i]</div>,
    <div key="q2" className="pt-2 underline">Question 2:</div>,
    <div key="q2v">C</div>,
  ];

  const runPage6 = () => {
    if (page6Answer.replace(/ /g, '') === '300') {
      setOutput(5, ['300']);
      setMessage(5, [
        <span key="ok"><Tone color="green">Correct!</Tone><br />75(the third element) * 4(size of int) = 300</span>,
      ]);
      return;
    }

    setOutput(5, [page6Answer || <Tone key="err" color="red">Error!</Tone>]);
    setMessage(5, [<Tone key="wrong" color="red">Wrong!</Tone>]);
  };

  const runPage14Sum = () => {
    const a = page14Limit.replace(/ /g, '');
    const b = page14Expression.replace(/ /g, '');

    if (a === '5' && b === 'arr[i]') {
      setOutput(13, ['The sum is: 15']);
      setMessage(13, [
        <span key="p14-ok"><Tone color="green">Correct!</Tone><br />We add the current element to the sum in every stage.</span>,
      ]);
      return;
    }

    if (/^\d+$/.test(a) && /^-?\d+(?:\.\d+)?$/.test(b)) {
      setOutput(13, [`The sum is: ${Number(a) * Number(b)}`]);
    } else if (/^\d+$/.test(a) && /^arr\[[0-4]\]$/.test(b)) {
      const idx = Number(b.slice(4, 5));
      setOutput(13, [`The sum is: ${Number(a) * (idx + 1)}`]);
    } else if (b === 'sum') {
      setOutput(13, ['The sum is: 0']);
    } else {
      setOutput(13, [<Tone key="p14-err" color="red">Error!</Tone>]);
    }

    setMessage(13, [<Tone key="p14-wrong" color="red">Wrong!</Tone>]);
  };

  const runPage14Choice = (answer: number) => {
    switch (answer) {
      case 1:
        setOutput(13, ['Odd elements:', '2', '4']);
        setMessage(13, [<Tone key="a1" color="red">Wrong!</Tone>]);
        break;
      case 2:
        setOutput(13, ['Odd elements:', '3', '4', '5']);
        setMessage(13, [<Tone key="a2" color="red">Wrong!</Tone>]);
        break;
      case 3:
        setOutput(13, ['Odd elements:', '1', '3', '5']);
        setMessage(13, [
          <span key="a3"><Tone color="green">Correct!</Tone><br />The i's that divide by 2 without a reminder are 0, 2, and 4.</span>,
        ]);
        break;
      case 4:
        setOutput(13, ['Odd elements:', '1', '2']);
        setMessage(13, [<Tone key="a4" color="red">Wrong!</Tone>]);
        break;
      default:
        break;
    }
  };
  if (pageIndex === 0) {
    return renderFrame(
      <div className="relative min-h-[560px] space-y-3 text-left">
        <p className="text-[22px] leading-tight">Arrays are used to store multiple values in a single variable. The values must be of the same <Tone color="red">data type</Tone>.</p>
        <div>
          <p className="text-[18px]">syntax:</p>
          <div className="w-[470px]">
            <CodeEditor code={[<><Tone color="blue">data type </Tone><span>name[] = {'{'} </span><Tone color="red">var1, var2, var3, var4</Tone><span>, ...{'}'};</span></>]} lineStart={1} activeLineIndex={-1} />
          </div>
        </div>
        <div>
          <p className="text-[22px]">For example:</p>
          <LessonChip text="Input" />
          <div className="w-[482px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>myNumbers[] = {'{'} </span><Tone color="red">13, 52, 8, 1011</Tone><span>{'}'};</span></>,
                <>printf(<Tone color="red">"%d"</Tone>, myNumbers);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(0, blankOutput)} />}
              activeLineIndex={1}
            />
          </div>
        </div>
        <div className="absolute right-0 top-[3.7rem] w-[470px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[0]} minHeightClass="min-h-[167px]" />
        </div>
        <p className="text-[22px] leading-tight">When trying to print an array using <Tone color="red">%d</Tone> in this manner, you won't get the array, instead, you'll get the <Tone color="red">memory address</Tone> of the array.</p>
        <p className="pt-4 text-[22px]">Printing the array itself is a little bit more complicated.</p>
      </div>
    );
  }

  if (pageIndex === 1) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[540px]">
          <h2 className="text-[3.15rem] leading-none underline">Accessing an element</h2>
          <p className="text-[22px] leading-tight">To access an array element, refer to its <Tone color="red">index number</Tone>. Array indexes start with <Tone color="red">0</Tone>.</p>
          <LessonChip text="Input" />
          <div className="w-[486px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>myNumbers[] = {'{'} </span><Tone color="red">13, 52, 8, 1011</Tone><span>{'}'};</span></>,
                <>printf(<Tone color="red">"%d"</Tone>, myNumbers[<Tone color="red">2</Tone>]);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => {
                setOutput(1, ['8']);
                setMessage(1, [<span key="m1">Index <Tone color="red">2</Tone> is the 3rd number in our array.</span>]);
              }} />}
              activeLineIndex={1}
            />
          </div>
          <h2 className="pt-2 text-[3.15rem] leading-none underline">Changing an element</h2>
          <p className="text-[22px] leading-tight">To change an array element, refer to it's <Tone color="red">index number</Tone>.</p>
          <LessonChip text="Input" />
          <div className="w-[486px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>myNumbers[] = {'{'} </span><Tone color="red">13, 52, 8, 1011</Tone><span>{'}'};</span></>,
                <>myNumbers[<Tone color="red">2</Tone>] = <Tone color="red">77</Tone>;</>,
                <>printf(<Tone color="red">"%d"</Tone>, myNumbers[<Tone color="red">2</Tone>]);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => {
                setOutput(1, ['77']);
                setMessage(1, [<span key="m2">Index <Tone color="red">2</Tone> changed from 8 to 77.</span>]);
              }} />}
              activeLineIndex={2}
            />
          </div>
        </div>
        <div className="absolute right-0 top-[9.8rem] w-[472px] space-y-2">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[1]} minHeightClass="min-h-[171px]" />
          <div className="min-h-[52px] text-[18px] leading-tight">{pageMessage[1]}</div>
        </div>
      </div>
    );
  }

  if (pageIndex === 2) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[515px]">
          <h2 className="text-[3.15rem] leading-none underline">Looping Through Arrays</h2>
          <p className="text-[22px] leading-tight">You can loop through the elements of the array, using a <Tone color="red">for</Tone> loop.</p>
          <LessonChip text="Input" />
          <div className="w-[441px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>myNumbers[] = {'{'} </span><Tone color="red">13, 52, 8, 1011</Tone><span>{'}'};</span></>,
                <><Tone color="blue">int </Tone><span>i;</span></>,
                <EmptyLine key="a3-empty" />,
                <><Tone color="blue">for </Tone><span>(i = </span><Tone color="red">0</Tone><span>; i &lt; </span><Tone color="red">4</Tone><span>; i++) {'{'}</span></>,
                <>printf(<Tone color="red">"%d "</Tone>, myNumbers[i]);</>,
                <span>{'}'}</span>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(2, ['13 52 8 1011'])} />}
              activeLineIndex={4}
            />
          </div>
        </div>
        <div className="absolute right-[36px] top-[10.5rem] w-[328px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[2]} minHeightClass="min-h-[166px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 3) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-2 pr-[490px]">
          <h2 className="text-[3rem] leading-none underline">Setting Array Size</h2>
          <p className="text-[22px] leading-tight">An alternative way to create an <Tone color="red">array</Tone> is to specify it's size on declaration, and then add elements to it later.</p>
          <LessonChip text="Input" />
          <div className="w-[364px]">
            <CodeEditor
              code={[
                <><Tone color="green">// Declaration with size</Tone></>,
                <><Tone color="blue">int </Tone><span>myNumbers[</span><Tone color="red">4</Tone><span>];</span></>,
                <EmptyLine key="a4-empty" />,
                <><Tone color="green">// Adding elements</Tone></>,
                <>myNumbers[<Tone color="red">0</Tone>] = <Tone color="red">7</Tone>;</>,
                <>myNumbers[<Tone color="red">1</Tone>] = <Tone color="red">100</Tone>;</>,
                <>myNumbers[<Tone color="red">2</Tone>] = <Tone color="red">24</Tone>;</>,
                <>myNumbers[<Tone color="red">3</Tone>] = <Tone color="red">26</Tone>;</>,
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
          <h2 className="pt-1 text-[3rem] leading-none underline">Array size</h2>
          <div className="w-[402px]">
            <CodeEditor
              code={[<>printf(<Tone color="red">"%lu"</Tone>, sizeof(myNumbers));</>]}
              lineStart={9}
              rightSlot={<RunButton onClick={() => {
                setOutput(3, ['16']);
                setMessage(3, [<span key="p4">Why is the number <Tone color="red">16</Tone> and not <Tone color="red">4</Tone>? sizeof() returns the size in bytes.</span>]);
              }} />}
              activeLineIndex={0}
            />
          </div>
        </div>
        <div className="absolute right-[82px] top-[11.4rem] w-[336px] space-y-2">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[3]} minHeightClass="min-h-[167px]" />
          <div className="min-h-[60px] text-[18px] leading-tight">{pageMessage[3]}</div>
        </div>
      </div>
    );
  }

  if (pageIndex === 4) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-4 pr-[480px]">
          <p className="text-[22px] leading-tight">Divide the size of the array by the size of one element to get the number of elements.</p>
          <LessonChip text="Input" />
          <div className="w-[540px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>myNumbers[] = {'{'} </span><Tone color="red">13, 52, 8, 1011</Tone><span>{'}'};</span></>,
                <><Tone color="blue">int </Tone><span>size = sizeof(myNumbers) / sizeof(myNumbers[</span><Tone color="red">0</Tone><span>]);</span></>,
                <>printf(<Tone color="red">"%d"</Tone>, size);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(4, ['4'])} />}
              activeLineIndex={2}
            />
          </div>
          <div className="w-[540px]">
            <CodeEditor
              code={[
                <><Tone color="blue">for </Tone><span>(i = </span><Tone color="red">0</Tone><span>; i &lt; size; i++) {'{'}</span></>,
                <>printf(<Tone color="red">"%d "</Tone>, myNumbers[i]);</>,
                <span>{'}'}</span>,
              ]}
              lineStart={4}
              rightSlot={<RunButton onClick={() => setOutput(4, ['13 52 8 1011'])} />}
              activeLineIndex={1}
            />
          </div>
        </div>
        <div className="absolute right-[84px] top-[13.2rem] w-[336px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[4]} minHeightClass="min-h-[168px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 5) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <p className="pb-5 text-[24px] leading-tight">What will the output be?</p>
        <div className="space-y-4 pr-[560px]">
          <LessonChip text="Input" />
          <div className="w-[522px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>myNumbers[] = {'{'} </span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
                <>printf(<Tone color="red">"%d"</Tone>, myNumbers[<Tone color="red">2</Tone>] * sizeof(myNumbers[<Tone color="red">3</Tone>]));</>,
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
          <div className="flex items-start gap-4 pt-4">
            <div className="w-[292px]">
              <LessonChip text="output" />
              <OutputPanel lines={pageOutput[5]} minHeightClass="min-h-[145px]" />
            </div>
            <div className="flex items-start gap-3 pt-1">
              <InlineInput value={page6Answer} onChange={setPage6Answer} className="w-[56px]" />
              <button type="button" onClick={runPage6} className="rounded-sm bg-[#8fd949] px-3 py-0.5 text-xl leading-none text-white transition hover:bg-[#9ddf50]">Answer</button>
            </div>
          </div>
          <div className="min-h-[44px] text-[18px] leading-tight">{pageMessage[5]}</div>
        </div>
      </div>
    );
  }

  if (pageIndex === 6) {
    return renderFrame(
      <div className="min-h-[560px] space-y-3 text-left">
        <h2 className="text-[3rem] leading-none underline">Multidimensional Arrays</h2>
        <p className="text-[22px] leading-tight">A <Tone color="red">multidimensional array</Tone> is basically an array of arrays.</p>
        <LessonChip text="Input" />
        <div className="w-[358px]">
          <CodeEditor code={[<><Tone color="blue">int </Tone><span>matrix[</span><Tone color="red">2</Tone><span>][</span><Tone color="red">3</Tone><span>] = {'{'} {'{'} </span><Tone color="red">1,3,7</Tone><span>{'}'}, {'{'} </span><Tone color="red">4,0,5</Tone><span>{'}'} {'}'};</span></>]} lineStart={1} activeLineIndex={-1} />
        </div>
        <div className="w-[375px] pt-2">
          <LessonTable className="w-full" columnsClassName="grid-cols-[95px_95px_95px]" headers={[<span key="c0">Column 0</span>, <span key="c1">Column1</span>, <span key="c2">Column 2</span>]} rows={[["1", "3", "7"], ["4", "0", "5"]]} cellClassName="text-center text-[14px]" />
        </div>
      </div>
    );
  }
  if (pageIndex === 7) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-4 pr-[530px]">
          <h2 className="text-[3rem] leading-none underline">Accessing and changing elements</h2>
          <LessonChip text="Input" />
          <div className="w-[452px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>matrix[2][3] = {'{'} {'{'} </span><Tone color="red">1,3,7</Tone><span>{'}'}, {'{'} </span><Tone color="red">4,0,5</Tone><span>{'}'} {'}'};</span></>,
                <>printf(<Tone color="red">"%d"</Tone>, matrix[<Tone color="red">0</Tone>][<Tone color="red">2</Tone>]);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(7, ['7'])} />}
              activeLineIndex={1}
            />
          </div>
          <div className="w-[452px]">
            <CodeEditor
              code={[
                <>matrix[<Tone color="red">1</Tone>][<Tone color="red">1</Tone>] = <Tone color="red">9</Tone>;</>,
                <>printf(<Tone color="red">"%d"</Tone>, matrix[<Tone color="red">1</Tone>][<Tone color="red">1</Tone>]);</>,
              ]}
              lineStart={3}
              rightSlot={<RunButton onClick={() => setOutput(7, ['9'])} />}
              activeLineIndex={1}
            />
          </div>
        </div>
        <div className="absolute right-[80px] top-[10.7rem] w-[334px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[7]} minHeightClass="min-h-[169px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 8) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[560px]">
          <h2 className="text-[3rem] leading-none underline">Looping Through a Multidimensional Array</h2>
          <LessonChip text="Input" />
          <div className="w-[361px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>matrix[2][3] = {'{'} {'{'} </span><Tone color="red">1,3,7</Tone><span>{'}'}, {'{'} </span><Tone color="red">4,0,5</Tone><span>{'}'} {'}'};</span></>,
                <EmptyLine key="a9-empty" />,
                <><Tone color="blue">int </Tone><span>i, j;</span></>,
                <><Tone color="blue">for </Tone><span>(i = </span><Tone color="red">0</Tone><span>; i &lt;= </span><Tone color="red">2</Tone><span>; i++) {'{'}</span></>,
                <>{'  '}<Tone color="blue">for </Tone><span>(j = </span><Tone color="red">0</Tone><span>; j &lt;= </span><Tone color="red">3</Tone><span>; j++) {'{'}</span></>,
                <>{'    '}printf(<Tone color="red">"%d "</Tone>, matrix[i][j]);</>,
                <span>{'  }'}</span>,
                <>{'  '}printf(<Tone color="red">"\n"</Tone>);</>,
                <span>{'}'}</span>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(8, ['1 3 7', '4 0 5'])} />}
              activeLineIndex={8}
            />
          </div>
        </div>
        <div className="absolute right-[154px] top-[9.3rem] w-[336px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[8]} minHeightClass="min-h-[170px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 9) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[420px]">
          <h2 className="text-[3rem] leading-none underline">Strings</h2>
          <p className="text-[22px] leading-tight">In C a string is not a data type, but an array of chars.</p>
          <LessonChip text="Input" />
          <div className="w-[348px]">
            <CodeEditor code={[<><Tone color="blue">char </Tone><span>greeting[] = </span><Tone color="red">"Hello World!"</Tone><span>;</span></>]} lineStart={1} activeLineIndex={-1} />
          </div>
          <div className="w-[347px]">
            <CodeEditor code={[<>printf(<Tone color="red">"%s"</Tone>, greeting);</>]} lineStart={2} rightSlot={<RunButton onClick={() => setOutput(9, ['Hello World!'])} />} activeLineIndex={0} />
          </div>
          <div className="w-[347px]">
            <CodeEditor
              code={[
                <>greeting[<Tone color="red">3</Tone>] = <Tone color="red">'x'</Tone>;</>,
                <>printf(<Tone color="red">"%s"</Tone>, greeting);</>,
              ]}
              lineStart={3}
              rightSlot={<RunButton onClick={() => setOutput(9, ['Helxo World!'])} />}
              activeLineIndex={1}
            />
          </div>
        </div>
        <div className="absolute right-0 top-[18.6rem] w-[335px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[9]} minHeightClass="min-h-[179px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 10) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[420px]">
          <h2 className="text-[3rem] leading-none underline">Looping Through Strings</h2>
          <LessonChip text="Input" />
          <div className="w-[489px]">
            <CodeEditor
              code={[
                <><Tone color="blue">char </Tone><span>greeting[] = </span><Tone color="red">"Hello!"</Tone><span>;</span></>,
                <><Tone color="blue">int </Tone><span>length = sizeof(greeting) / sizeof(greeting[</span><Tone color="red">0</Tone><span>]);</span></>,
                <EmptyLine key="p11-empty" />,
                <><Tone color="blue">for </Tone><span>(i = </span><Tone color="red">0</Tone><span>; i &lt; length; ++i) {'{'}</span></>,
                <>printf(<Tone color="red">"%c "</Tone>, greeting[i]);</>,
                <span>{'}'}</span>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(10, ['H e l l o !'])} />}
              activeLineIndex={4}
            />
          </div>
          <div className="w-[598px]">
            <CodeEditor
              code={[
                <><Tone color="blue">char </Tone><span>greeting[] = {'{'} </span><Tone color="red">'H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd', '!', '\0'</Tone><span>{'}'};</span></>,
                <>printf(<Tone color="red">"%s"</Tone>, greeting);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(10, ['Hello World!'])} />}
              activeLineIndex={1}
            />
          </div>
        </div>
        <div className="absolute right-[2px] top-[8.7rem] w-[344px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[10]} minHeightClass="min-h-[191px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 11) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-3 pr-[430px]">
          <h2 className="text-[3rem] leading-none underline">Special characters</h2>
          <LessonChip text="Input" />
          <div className="w-[550px]">
            <CodeEditor
              code={[
                <><Tone color="blue">char </Tone><span>text[] = </span><Tone color="red">"He said "awesome" during the meeting."</Tone><span>;</span></>,
                <>printf(<Tone color="red">"%s"</Tone>, text);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(11, [<Tone key="err12" color="red">Error!</Tone>])} />}
              activeLineIndex={1}
            />
          </div>
          <div className="w-[550px]">
            <CodeEditor
              code={[
                <><Tone color="blue">char </Tone><span>x[] = </span><Tone color="red">"He said \"awesome\" during the meeting."</Tone><span>;</span></>,
                <><Tone color="blue">char </Tone><span>y[] = </span><Tone color="red">"It's okay."</Tone><span>;</span></>,
                <><Tone color="blue">char </Tone><span>z[] = </span><Tone color="red">"The character \\ is called a backslash."</Tone><span>;</span></>,
                <>printf(<Tone color="red">"%s\n%s\n%s"</Tone>, x, y, z);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput(11, ['He said "awesome" during the meeting.', "It's okay.", 'The character \\ is called a backslash.'])} />}
              activeLineIndex={3}
            />
          </div>
        </div>
        <div className="absolute right-[35px] top-[8rem] w-[346px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[11]} minHeightClass="min-h-[162px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 12) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="space-y-4">
          <h2 className="text-[3rem] leading-none underline">String Functions</h2>
          <p className="text-[22px] leading-tight">C has many useful string functions. To use them, include &lt;string.h&gt;.</p>
          <div className="w-[282px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <span key="inc">#include &lt;string.h&gt;</span>,
                <EmptyLine key="a13-empty-2" />,
                <><Tone color="blue">char </Tone><span>x[] = </span><Tone color="red">"ABCDEFGH"</Tone><span>;</span></>,
                <><Tone color="blue">char </Tone><span>y[] = </span><Tone color="red">"Hello!"</Tone><span>;</span></>,
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-6">
            <div className="w-[250px]"><CodeEditor code={[<>printf(<Tone color="red">"%d"</Tone>, strlen(x));</>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(12, ['8'])} />} activeLineIndex={0} /></div>
            <div className="w-[250px]"><CodeEditor code={[<>strcat(x,y);</>, <>printf(<Tone color="red">"%s"</Tone>, x);</>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(12, ['ABCDEFGHHello!'])} />} activeLineIndex={1} /></div>
            <div className="w-[250px]"><CodeEditor code={[<>strcpy(y,x);</>, <>printf(<Tone color="red">"%s"</Tone>, y);</>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(12, ['ABCDEFGH'])} />} activeLineIndex={1} /></div>
            <div className="w-[270px]"><CodeEditor code={[<>printf(<Tone color="red">"%d"</Tone>, strcmp(x,y));</>]} lineStart={1} rightSlot={<RunButton onClick={() => setOutput(12, ['-7'])} />} activeLineIndex={0} /></div>
          </div>
        </div>
        <div className="absolute right-[55px] top-[6.8rem] w-[278px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[12]} minHeightClass="min-h-[101px]" />
        </div>
      </div>
    );
  }

  return renderFrame(
    <div className="relative min-h-[560px] text-left">
      <div className="space-y-4 pr-[520px]">
        <p className="text-[24px] leading-tight">Make the following code print the sum of the elements of the array:</p>
        <LessonChip text="Input" />
        <div className="w-[470px]"><ArraysExerciseEditor limit={page14Limit} expression={page14Expression} onLimit={setPage14Limit} onExpression={setPage14Expression} /></div>
        <p className="pt-1 text-[24px] leading-tight">What would the if condition need to be in order for the code to print the odd elements of the array?</p>
        <LessonChip text="Input" />
        <div className="flex items-start gap-[25px]">
          <div className="w-[470px]">
            <CodeEditor
              code={[
                <><Tone color="blue">int </Tone><span>arr[] = {'{'} </span><Tone color="red">1, 2, 3, 4, 5</Tone><span>{'}'};</span></>,
                <><Tone color="blue">int </Tone><span>sum = </span><Tone color="red">0</Tone><span>;</span></>,
                <>printf(<Tone color="red">"Odd elements: \n"</Tone>);</>,
                <><Tone color="blue">for </Tone><span>(int i = </span><Tone color="red">0</Tone><span>; i &lt; </span><Tone color="red">5</Tone><span>; i++) {'{'}</span></>,
                <span>if (?????) {'{'}</span>,
                <>{'  '}printf(<Tone color="red">"%d\n"</Tone>, arr[i]);</>,
                <span>{'}'}</span>,
                <span>{'}'}</span>,
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
          <ChoiceButtonGroup className="w-[85px] shrink-0 space-y-1 pt-[6.1rem]" buttonClassName={page14ChoiceClassName} options={[
            { label: 'i % 2 != 0', onClick: () => runPage14Choice(1) },
            { label: 'i / 2 != 0', onClick: () => runPage14Choice(2) },
            { label: 'i % 2 == 0', onClick: () => runPage14Choice(3) },
            { label: 'i / 2 == 0', onClick: () => runPage14Choice(4) },
          ]} />
        </div>
      </div>
      <div className="absolute left-[397px] top-[10.35rem]"><RunButton onClick={runPage14Sum} /></div>
      <div className="absolute right-[120px] top-[4.5rem] w-[326px]"><LessonChip text="output" /><OutputPanel lines={pageOutput[13]} minHeightClass="min-h-[176px]" /></div>
      <div className="absolute right-[118px] top-[14.6rem] min-h-[52px] w-[330px] text-[18px] leading-tight">{pageMessage[13]}</div>
      <div className="absolute right-[122px] bottom-[3.2rem] w-[335px] rounded-sm border border-white/35 bg-white/80 px-4 py-2 text-[18px] leading-tight text-[#2d2d2d]">{page14Hint}</div>
    </div>
  );
}

export default LessonPage;
