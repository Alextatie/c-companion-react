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

function MemoryExerciseEditor({
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
          {[1, 2, 3, 4].map((line) => (
            <div key={line} className="text-center font-mono">
              {line}
            </div>
          ))}
        </div>
        <div className="bg-white px-1 py-1 font-mono text-[17px] leading-7 text-slate-900">
          <div className={lineClass}>
            <Tone color="blue">int </Tone>
            <span>nums[</span>
            <Tone color="red">6</Tone>
            <span>] = {'{'}</span>
            <Tone color="red">1, 2, 3, 4, 5, 6</Tone>
            <span>{'}'};</span>
          </div>
          <div className={lineClass}>
            printf(<Tone color="red">"%d\n"</Tone>, <InlineInput value={value1} onChange={onValue1} widthClass="w-[2.2ch]" />
            <span>(</span>
            <InlineInput value={value2} onChange={onValue2} widthClass="w-[6ch]" />
            <span> + </span>
            <Tone color="red">3</Tone>
            <span>));</span>
          </div>
          <div className={lineClass}>
            printf(<Tone color="red">"%p\n"</Tone>, <InlineInput value={value3} onChange={onValue3} widthClass="w-[2.2ch]" />
            <span>(</span>
            <InlineInput value={value4} onChange={onValue4} widthClass="w-[6ch]" />
            <span> + </span>
            <Tone color="red">3</Tone>
            <span>));</span>
          </div>
          <div className={lineClass}>
            printf(<Tone color="red">"%p\n"</Tone>, <InlineInput value={value5} onChange={onValue5} widthClass="w-[5ch]" />
            <span>[</span>
            <InlineInput value={value6} onChange={onValue6} widthClass="w-[2ch]" />
            <span>]);</span>
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
  const isLastPage = pageIndex === 5;

  const [Output_1, setOutput_1] = useState<ReactNode[]>([<EmptyLine key="m1-empty" />]);
  const [Output_2, setOutput_2] = useState<ReactNode[]>([<EmptyLine key="m2-empty" />]);
  const [Output_3, setOutput_3] = useState<ReactNode[]>([<EmptyLine key="m3-empty" />]);
  const [Output_4, setOutput_4] = useState<ReactNode[]>([<EmptyLine key="m4-empty" />]);
  const [Output_5, setOutput_5] = useState<ReactNode[]>([<EmptyLine key="m5-empty" />]);
  const [Output_6, setOutput_6] = useState<ReactNode[]>([<EmptyLine key="m6-empty" />]);

  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');
  const [value5, setValue5] = useState('');
  const [value6, setValue6] = useState('');
  const [page6Result, setPage6Result] = useState<ReactNode[]>([]);

  const randomAddress = useMemo(() => `0x7ff${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`, []);

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

  const page1_input1 = () => setOutput_1([
    <Tone key="m1-a" color="white">My age is: 30</Tone>,
    <Tone key="m1-b" color="white">Memory Address: {randomAddress}</Tone>,
  ]);
  const page1_input2 = () => setOutput_1([
    <Tone key="m1-c" color="white">30</Tone>,
    <Tone key="m1-d" color="white">{randomAddress}</Tone>,
    <Tone key="m1-e" color="white">{randomAddress}</Tone>,
  ]);
  const page2_input1 = () => setOutput_2([
    <Tone key="m2-a" color="white">{randomAddress}</Tone>,
    <Tone key="m2-b" color="white">30</Tone>,
  ]);
  const page3_input1 = () => setOutput_3([
    <Tone key="m3-a" color="white">{randomAddress}</Tone>,
    <Tone key="m3-b" color="white">0x7ff{(parseInt(randomAddress.slice(5),16)+4).toString(16)}</Tone>,
    <Tone key="m3-c" color="white">0x7ff{(parseInt(randomAddress.slice(5),16)+8).toString(16)}</Tone>,
    <Tone key="m3-d" color="white">0x7ff{(parseInt(randomAddress.slice(5),16)+12).toString(16)}</Tone>,
  ]);
  const page4_input1 = () => setOutput_4([
    <Tone key="m4-a" color="white">{randomAddress}</Tone>,
    <Tone key="m4-b" color="white">{randomAddress}</Tone>,
  ]);
  const page4_input2 = () => setOutput_4([<Tone key="m4-c" color="white">25</Tone>]);
  const page4_input3 = () => setOutput_4([
    <Tone key="m4-d" color="white">50</Tone>,
    <Tone key="m4-e" color="white">75</Tone>,
  ]);
  const page5_input1 = () => setOutput_5([
    <Tone key="m5-a" color="white">25</Tone>,
    <Tone key="m5-b" color="white">50</Tone>,
    <Tone key="m5-c" color="white">75</Tone>,
    <Tone key="m5-d" color="white">100</Tone>,
  ]);
  const page5_input2 = () => setOutput_5([
    <Tone key="m5-e" color="white">500</Tone>,
    <Tone key="m5-f" color="white">333</Tone>,
  ]);

  const page6_input1 = () => {
    const ok = value1 === '*' && value2 === 'nums' && (value3 === '&' || value3 === '*') && value4 === 'nums' && value5 === '&nums' && value6 === '3';
    if (ok || ((value1 === '*' && value2 === 'nums' && value3.trim() === '') && value4 === 'nums' && value5 === '&nums' && value6 === '3')) {
      setPage6Result([<Tone key="m6-correct" color="green">Correct!</Tone>]);
    } else {
      setPage6Result([<Tone key="m6-wrong" color="red">Wrong!</Tone>]);
    }
    setOutput_6([
      <Tone key="m6-a" color="white">4</Tone>,
      <Tone key="m6-b" color="white">{randomAddress}</Tone>,
      <Tone key="m6-c" color="white">{randomAddress}</Tone>,
    ]);
  };

  const page1CodeA = [
    <><Tone color="blue">int </Tone><span>age = </span><Tone color="red">30</Tone><span>;</span></>,
    <><span>printf(</span><Tone color="red">"My age is: %d\n"</Tone><span>, age);</span></>,
    <><span>printf(</span><Tone color="red">"Memory Address: %p"</Tone><span>, &age);</span></>,
  ];
  const page1CodeB = [
    <><Tone color="blue">int </Tone><span>age = </span><Tone color="red">30</Tone><span>;</span></>,
    <><Tone color="blue">int*</Tone><span> ptr = &age;</span><span>;</span></>,
    <><span>printf(</span><Tone color="red">"%d\n"</Tone><span>, age);</span></>,
    <><span>printf(</span><Tone color="red">"%p\n"</Tone><span>, &age);</span></>,
    <><span>printf(</span><Tone color="red">"%p\n"</Tone><span>, ptr);</span></>,
  ];
  const page2Code = [
    <><Tone color="blue">int </Tone><span>age = </span><Tone color="red">30</Tone><span>;</span></>,
    <><Tone color="blue">int*</Tone><span> ptr = &age;</span><span>;</span></>,
    <><span>printf(</span><Tone color="red">"%p\n"</Tone><span>, ptr);</span></>,
    <><span>printf(</span><Tone color="red">"%d\n"</Tone><span>, *ptr);</span></>,
  ];
  const page3Code = [
    <><Tone color="blue">int </Tone><span>nums[</span><Tone color="red">4</Tone><span>] = {'{'}</span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
    <><Tone color="blue">for </Tone><span>(</span><Tone color="blue">int </Tone><span>i = </span><Tone color="red">0</Tone><span>; i {'<'} </span><Tone color="red">4</Tone><span>; i++) {'{'}</span></>,
    <><span>  printf(</span><Tone color="red">"%p\n"</Tone><span>, &nums[i]);</span></>,
    '}',
  ];
  const page4CodeA = [
    <><Tone color="blue">int </Tone><span>nums[</span><Tone color="red">4</Tone><span>] = {'{'}</span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
    <><span>printf(</span><Tone color="red">"%p\n"</Tone><span>, nums);</span></>,
    <><span>printf(</span><Tone color="red">"%p\n"</Tone><span>, &nums[</span><Tone color="red">0</Tone><span>]);</span></>,
  ];
  const page4CodeB = [
    <><Tone color="blue">int </Tone><span>nums[</span><Tone color="red">4</Tone><span>] = {'{'}</span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
    <><span>printf(</span><Tone color="red">"%d"</Tone><span>, *nums);</span></>,
    ' ',
  ];
  const page4CodeC = [
    <><Tone color="blue">int </Tone><span>nums[</span><Tone color="red">4</Tone><span>] = {'{'}</span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
    <><span>printf(</span><Tone color="red">"%d\n"</Tone><span>, *(nums + </span><Tone color="red">1</Tone><span>));</span></>,
    <><span>printf(</span><Tone color="red">"%d"</Tone><span>, *(nums + </span><Tone color="red">2</Tone><span>));</span></>,
  ];
  const page5CodeA = [
    <><Tone color="blue">int </Tone><span>nums[</span><Tone color="red">4</Tone><span>] = {'{'}</span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
    <><Tone color="blue">for </Tone><span>(</span><Tone color="blue">int </Tone><span>i = </span><Tone color="red">0</Tone><span>; i {'<'} </span><Tone color="red">4</Tone><span>; i++) {'{'}</span></>,
    <><span>  printf(</span><Tone color="red">"%d\n"</Tone><span>, *(nums + i));</span></>,
    '}',
  ];
  const page5CodeB = [
    <><Tone color="blue">int </Tone><span>nums[</span><Tone color="red">4</Tone><span>] = {'{'}</span><Tone color="red">25, 50, 75, 100</Tone><span>{'}'};</span></>,
    <><span>*nums = </span><Tone color="red">500</Tone><span>;</span></>,
    <><span>*(nums + </span><Tone color="red">1</Tone><span>) = </span><Tone color="red">333</Tone><span>;</span></>,
    <><span>printf(</span><Tone color="red">"%d"</Tone><span>, *nums);</span></>,
    <><span>printf(</span><Tone color="red">"%d"</Tone><span>, *(nums + </span><Tone color="red">1</Tone><span>));</span></>,
  ];

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="Memory">
        <div className="relative w-[1090px] max-w-none">
          <HomeButton />
          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            {pageIndex === 0 ? (
              <div className="space-y-3 text-left">
                <div className="text-[22px] underline underline-offset-4">Memory Address</div>
                <p className="w-full text-[18px] leading-tight">
                  When a <Tone color="red">variable</Tone> is created in C, a <Tone color="red">memory address</Tone> is assigned to it. It's the location
                  of where the variable is stored on the computer. When we assign a <Tone color="red">value</Tone> to the
                  variable, this value is stored in that <Tone color="red">address</Tone>. To access the address, we use the
                  reference operator <Tone color="red">&</Tone>, and the format specifier <Tone color="red">%p</Tone>.
                </p>
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[420px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page1CodeA} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page1_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                  <div className="w-[320px] shrink-0 pt-[1.4rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_1} minHeightClass="min-h-[90px]" />
                  </div>
                </div>
                <div className="text-[16px] leading-tight"><Tone color="white">*The address is in a hexadecimal form</Tone></div>
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[420px] text-[18px] leading-tight">
                    The variable <Tone color="red">&age</Tone> is also called a <Tone color="red">pointer</Tone>. A
                    pointer is a variable that stores the <Tone color="red">memory</Tone>
                    <Tone color="red">address</Tone> of another variable as it's value.
                    <br />
                    A <Tone color="red">pointer</Tone> variable points to the <Tone color="red">data type</Tone> (<Tone color="blue">int</Tone> in
                    our example) of the variable that's held in that
                    memory address, and is created with the <Tone color="red">*</Tone>
                    operator and the <Tone color="red">address</Tone> of the variable you are
                    working with is assigned to the pointer.
                  </div>
                  <div className="w-[420px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page1CodeB} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page1_input2} className="absolute bottom-2 right-3" />
                    </div>
                    <div className="pt-2 text-[16px] leading-tight text-white">
                      Note that the
                      variable <Tone color="red">ptr</Tone> is storing the value of
                      <Tone color="red">&age</Tone> and not <Tone color="red">age</Tone>,
                      meaning it stores the memory
                      address of <Tone color="red">age</Tone> and not it's value.
                    </div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 1 ? (
              <div className="space-y-3 text-left">
                <div className="text-[22px] underline underline-offset-4">Dereference</div>
                <p className="w-full text-[18px] leading-tight">
                  We can do the opposite of the last example, access the
                  <Tone color="red">value</Tone> of the variable that the <Tone color="red">pointer</Tone> points to by using
                  the <Tone color="red">*</Tone> operator (the <Tone color="red">dereference</Tone> operator):
                </p>
                <div className="flex items-start gap-8">
                  <div className="w-[300px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page2Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page2_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                  <div className="w-[300px] shrink-0 pt-[1.3rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_2} minHeightClass="min-h-[90px]" />
                  </div>
                </div>
                <div className="text-[18px] leading-tight">
                  Note that the <Tone color="red">*</Tone> sign does two different things:
                  <br />
                  ● When used in declaration (<Tone color="blue">int* ptr</Tone>), it creats a point variable.
                  <br />
                  ● When <Tone color="red">not</Tone> used in declaration, it acts as a dereference operator.
                </div>
                <div className="text-[22px] underline underline-offset-4">A note on pointers</div>
                <p className="w-full text-[18px] leading-tight">
                  <Tone color="red">Pointers</Tone> are one of the things that make <Tone color="red">C</Tone> stand out from other programming languages, like <Tone color="red">Python</Tone>
                  and <Tone color="red">Java</Tone>. They allow us to manipulate the data in the computer's memory. This can reduce the code
                  and improve the performance.
                  <br />
                  But be careful; pointers must be handled with care, since it is possible to damage data stored in
                  other memory addresses.
                </p>
              </div>
            ) : pageIndex === 2 ? (
              <div className="space-y-3 text-left">
                <div className="text-[22px] underline underline-offset-4">Pointers & Arrays</div>
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[335px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page3Code} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page3_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                  <div className="w-[330px] shrink-0 pt-[1.3rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_3} minHeightClass="min-h-[135px]" />
                  </div>
                </div>
                <p className="w-[390px] text-[18px] leading-tight">
                  When printing the <Tone color="red">memory address</Tone> of each
                  array element, notice that each address is
                  different from the previous by exactly <Tone color="red">4</Tone>. That's
                  because we have an array of <Tone color="blue">int</Tone>'s, and the
                  size of an int is 4 bytes.
                  <br />
                  <br />
                  From this example you can see that the
                  compiler reserves <Tone color="red">4 bytes</Tone> of memory for each
                  array element, and <Tone color="red">16 bytes</Tone> for the entire
                  array.
                </p>
              </div>
            ) : pageIndex === 3 ? (
              <div className="space-y-3 text-left">
                <div className="text-[22px] underline underline-offset-4">Pointers & Arrays</div>
                <p className="w-full text-[18px] leading-tight">
                  In <Tone color="red">C</Tone>, the <Tone color="red">name of an array</Tone> is actually a <Tone color="red">pointer</Tone>
                  to the <Tone color="red">first element</Tone> of the array.
                </p>
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[390px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page4CodeA} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page4_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                  <div className="w-[390px] shrink-0 pt-[1rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_4} minHeightClass="min-h-[90px]" />
                  </div>
                </div>
                <p className="w-full text-[18px] leading-tight">As you can see, the <Tone color="red">name</Tone> of the array, and the <Tone color="red">first element</Tone> of the array, have the same memory address.</p>
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[390px] shrink-0">
                    <p className="text-[18px] leading-tight">Now that we know that, we can use the <Tone color="red">*</Tone> operator to access the <Tone color="red">first element</Tone> of the array:</p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page4CodeB} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page4_input2} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                  <div className="w-[390px] shrink-0">
                    <p className="text-[18px] leading-tight">To access the rest of the elements, we can <Tone color="red">increment</Tone> the <Tone color="red">pointer</Tone>:</p>
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page4CodeC} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page4_input3} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                </div>
              </div>
            ) : pageIndex === 4 ? (
              <div className="space-y-3 text-left">
                <div className="text-[22px] underline underline-offset-4">Pointers & Arrays</div>
                <p className="w-full text-[18px] leading-tight">
                  We can of course also <Tone color="red">loop</Tone> through an array,
                  <br />
                  using this method:
                </p>
                <div className="flex items-start justify-between gap-8">
                  <div className="w-[390px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <CodeEditor code={page5CodeA} lineStart={1} activeLineIndex={-1} />
                      <RunButton onClick={page5_input1} className="absolute bottom-2 right-3" />
                    </div>
                  </div>
                  <div className="w-[350px] shrink-0 pt-[1rem]">
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_5} minHeightClass="min-h-[95px]" />
                  </div>
                </div>
                <p className="w-full text-[18px] leading-tight">And change the array's elements <Tone color="red">values</Tone>:</p>
                <div className="w-[390px] shrink-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor code={page5CodeB} lineStart={1} activeLineIndex={-1} />
                    <RunButton onClick={page5_input2} className="absolute bottom-2 right-3" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <p className="w-full text-[19px] leading-tight">Complete the following code to make it fit the expected output bellow:</p>
                <div className="relative min-h-[430px]">
                  <div className="w-[390px] shrink-0">
                    <LessonChip text="Input" />
                    <div className="relative">
                      <MemoryExerciseEditor
                        value1={value1}
                        value2={value2}
                        value3={value3}
                        value4={value4}
                        value5={value5}
                        value6={value6}
                        onValue1={setValue1}
                        onValue2={setValue2}
                        onValue3={setValue3}
                        onValue4={setValue4}
                        onValue5={setValue5}
                        onValue6={setValue6}
                      />
                      <RunButton onClick={page6_input1} className="absolute bottom-2 right-3" />
                    </div>
                    <div className="pt-2">
                      <LessonChip text="output" />
                      <OutputPanel lines={Output_6} minHeightClass="min-h-[105px]" />
                    </div>
                  </div>
                </div>
                <div className="min-h-[2rem] text-[18px] leading-tight">
                  {page6Result.map((line, index) => <div key={index}>{line}</div>)}
                </div>
              </div>
            )}
          </section>
          <div className="mt-[2.5rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <div className="flex items-center gap-1.5">
              {pageIndex === 5 && (
                <HintButton widthClass="w-[340px]">
                  printf(<Tone color="red">"%d\n"</Tone>, *(nums + 3));
                  <br />
                  printf(<Tone color="red">"%p\n"</Tone>, (nums + 3));
                  <br />
                  printf(<Tone color="red">"%p\n"</Tone>, &nums[3]);
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
