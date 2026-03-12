'use client';

import { ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { EmptyLine, Tone } from '@/components/lesson/text';
import {
  ChoiceButtonGroup,
  CodeEditor,
  HomeButton,
  LessonBackButton,
  LessonChip,
  LessonNextButton,
  OutputPanel,
  RunButton,
} from '@/components/lesson/ui';

function LessonPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === 10;

  const blankOutput = useMemo(() => [<EmptyLine key="blank" />], []);
  const [pageOutput, setPageOutput] = useState<Record<number, ReactNode[]>>({
    0: blankOutput,
    1: blankOutput,
    3: blankOutput,
    4: blankOutput,
    5: blankOutput,
    6: blankOutput,
    7: blankOutput,
  });
  const [page11Result, setPage11Result] = useState<ReactNode[]>([]);

  const page11ChoiceClassName =
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

  const setOutput = (page: number, lines: ReactNode[]) => {
    setPageOutput((prev) => ({ ...prev, [page]: lines }));
  };

  const randomHex = useMemo(
    () => Math.floor(0x100000 + Math.random() * 0xefffff).toString(16),
    []
  );

  const renderNav = () => (
    <div className="mt-[2.5rem] flex items-center justify-between">
      <LessonBackButton onClick={onBack} />
      <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
    </div>
  );

  const renderFrame = (content: ReactNode) => (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="Memory Management">
        <div className="relative w-[1090px] max-w-none">
          <HomeButton />
          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">{content}</section>
          {renderNav()}
        </div>
      </ScaledLessonFrame>
    </div>
  );

  if (pageIndex === 0) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <p className="w-[650px] text-[19px] leading-tight">
          When creating variables, <Tone color="red">C</Tone> will automatically reserve space for
          that variable. As we know, an <Tone color="red">int</Tone> is <Tone color="red">4 bytes</Tone> for example. You can
          use the <Tone color="red">sizeof</Tone> operator to find the size of any type:
        </p>

        <div className="w-[470px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>myInt;</>,
              <><Tone color="blue">float </Tone>myFloat;</>,
              <><Tone color="blue">double </Tone>myDouble;</>,
              <><Tone color="blue">char </Tone>myChar;</>,
              <>printf(<Tone color="red">"%lu\n"</Tone>, sizeof(myInt));</>,
              <>printf(<Tone color="red">"%lu\n"</Tone>, sizeof(myFloat));</>,
              <>printf(<Tone color="red">"%lu\n"</Tone>, sizeof(myDouble));</>,
              <>printf(<Tone color="red">"%lu\n"</Tone>, sizeof(myChar));</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(0, ['4', '4', '8', '1'])} />}
            activeLineIndex={7}
          />
        </div>

        <div className="absolute right-[145px] top-[5rem] w-[322px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[0]} minHeightClass="min-h-[164px]" />
        </div>

        <p className="w-[820px] pt-2 text-[19px] leading-tight">
          Why is <Tone color="red">memory management</Tone> important? A program that occupies
          too much unnecessary memory can result in <Tone color="red">poor performance</Tone>. In
          C you have to manage memory yourself, it's a complicated but also
          a powerful tool. When memory is properly managed it can <Tone color="red">optimize</Tone>
          <Tone color="red"> the performance</Tone> of the program.
        </p>
      </div>
    );
  }

  if (pageIndex === 1) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <p className="text-[19px] leading-tight">
          The process of reserving memory is called <Tone color="red">allocation</Tone>.
          <br />
          C has two memory types: <Tone color="red">Static memory</Tone>, and <Tone color="red">dynamic memory</Tone>.
        </p>

        <h2 className="pt-1 text-[2.6rem] leading-none underline">Static Memory</h2>
        <p className="w-[610px] text-[19px] leading-tight">
          Static memory is allocated <Tone color="red">before</Tone> the program runs. C
          automatically <Tone color="red">allocates</Tone> memory for every variable when the
          program is compiled. It's also referred to as <Tone color="red">compile time</Tone>
          <Tone color="red"> memory allocation</Tone>. For example:
        </p>

        <div className="w-[465px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>students[<Tone color="red">50</Tone>];</>,
              <>printf(<Tone color="red">"%lu"</Tone>, sizeof(students));</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(1, ['200'])} />}
            activeLineIndex={1}
          />
        </div>

        <div className="absolute right-[210px] top-[11.4rem] w-[175px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[1]} minHeightClass="min-h-[44px]" />
        </div>

        <p className="w-[700px] pt-1 text-[19px] leading-tight">
          C will allocate <Tone color="red">200 bytes</Tone> (50 * 4) of memory for our students array
          when the program will compile. So what's the problem?
          What if the semester starts and only 35 students attend? We have
          wasted <Tone color="red">60 bytes</Tone> (15 * 4) of memory space. The program will still
          run, but if it contains many similar memory wastes, it will run
          slower.
        </p>
      </div>
    );
  }

  if (pageIndex === 2) {
    return renderFrame(
      <div className="min-h-[560px] space-y-2 text-left">
        <h2 className="text-[2.6rem] leading-none underline">Dynamic Memory</h2>
        <p className="w-[700px] text-[19px] leading-tight">
          Dynamic memory is allocated <Tone color="red">after</Tone> the program starts running.
          It's also referred to as <Tone color="red">runtime memory allocation</Tone>.
          Unlike static memory that gets allocated automatically, with
          dynamic memory you have <Tone color="red">full control</Tone> over how much memory
          is being used. Dynamic memory does not belong to a variable, it
          can only be accessed with <Tone color="red">pointers</Tone>.
          <br />
          To allocate dynamic memory include the <Tone color="red">&lt;stdlib.h&gt;</Tone> header, and
          then use the <Tone color="red">malloc()</Tone> or <Tone color="red">calloc()</Tone> functions.
        </p>

        <div className="w-[320px]">
          <div className="text-[19px] text-[#d2ddd7]">Syntax:</div>
          <div className="rounded-sm bg-[#e5e5e5] px-2 py-1 font-mono text-[15px] leading-tight text-[#5f5f5f]">
            <div><Tone color="blue">int </Tone>*ptr1 = malloc(size)</div>
            <div><Tone color="blue">int </Tone>*ptr2 = calloc(amount, size)</div>
          </div>
        </div>

        <div className="space-y-0 text-[19px] leading-tight">
          <div>- <Tone color="red">malloc</Tone> has 1 element, size, how much memory you want to allocate</div>
          <div>- <Tone color="red">calloc</Tone> has size, but also amount, amount of items to allocate</div>
          <div>The data in the memory allocated by <Tone color="red">malloc()</Tone> is unpredictable, make</div>
          <div>sure to write something into the memory before reading it.</div>
          <div><Tone color="red">calloc()</Tone> on the other hand, writes zeros into all of the allocated memory</div>
          <div>by default. However it's slightly less efficient than <Tone color="red">malloc()</Tone>.</div>
        </div>
      </div>
    );
  }

  if (pageIndex === 3) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <p className="w-[700px] text-[19px] leading-tight">
          The best way to allocate the right amount of memory for a <Tone color="red">data type</Tone> is to
          use the <Tone color="red">sizeof</Tone> operator:
        </p>

        <div className="w-[330px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr1, *ptr2;</>,
              <>ptr1 = malloc(sizeof(*ptr1));</>,
              <>ptr2 = calloc(<Tone color="red">1</Tone>, sizeof(*ptr2));</>,
            ]}
            lineStart={1}
            activeLineIndex={-1}
          />
        </div>

        <p className="w-[760px] pt-1 text-[19px] leading-tight">
          <Tone color="red">sizeof(*ptr1)</Tone> measures the size of the <Tone color="red">data</Tone> at the address. If you measure
          <Tone color="red">sizeof(ptr1)</Tone> instead, it will measure the size of the pointer itself (usually 8 bytes).
          <Tone color="red">sizeof</Tone> cannot measure how much dynamic memory is allocated. When measuring
          dynamic memory, it only tells you the size of the data type of the memory.
        </p>

        <p className="pt-1 text-[19px] leading-tight">Let's use <Tone color="red">dynamic memory</Tone> to improve the students example:</p>

        <div className="w-[530px]">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*students;</>,
              <><Tone color="blue">int </Tone>numStudents = <Tone color="red">35</Tone>;</>,
              <>students = calloc(numStudents, sizeof(*students));</>,
              <>printf(<Tone color="red">"%d"</Tone>, numStudents * sizeof(*students));</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(3, ['140'])} />}
            activeLineIndex={3}
          />
        </div>

        <div className="absolute right-[85px] top-[15.2rem] w-[220px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[3]} minHeightClass="min-h-[82px]" />
        </div>

        <h3 className="pt-1 text-[2.1rem] leading-none underline">Stack Memory</h3>
        <p className="w-[740px] text-[19px] leading-tight">
          Stack memory is a type of dynamic memory that's reserved for variables declared
          inside <Tone color="red">functions</Tone>. When a function is <Tone color="red">called</Tone>, stack memory is allocated for the variables
          in the function. When the function <Tone color="red">returns</Tone>, the stack memory is freed.
        </p>
      </div>
    );
  }

  if (pageIndex === 4) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[2.6rem] leading-none underline">Access Dynamic Memory</h2>
        <p className="w-[520px] text-[19px] leading-tight">
          Dynamic memory behaves like an <Tone color="red">array</Tone>, to access an element in it,
          use it's <Tone color="red">index</Tone> numbers:
        </p>

        <div className="w-[470px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr;</>,
              <>ptr = calloc(<Tone color="red">3</Tone>, sizeof(*ptr));</>,
              <>ptr[<Tone color="red">0</Tone>] = <Tone color="red">2</Tone>;</>,
              <>ptr[<Tone color="red">1</Tone>] = <Tone color="red">4</Tone>;</>,
              <>printf(<Tone color="red">"%d %d %d"</Tone>, ptr[<Tone color="red">0</Tone>], ptr[<Tone color="red">1</Tone>], ptr[<Tone color="red">2</Tone>]);</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(4, ['2 4 0'])} />}
            activeLineIndex={4}
          />
        </div>

        <div className="absolute right-[140px] top-[4.9rem] w-[290px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[4]} minHeightClass="min-h-[117px]" />
        </div>

        <p className="pt-1 text-[19px] leading-tight">
          Or as with <Tone color="red">arrays</Tone>, by <Tone color="red">dereferencing</Tone> the pointer to access the first
          element:
        </p>

        <div className="w-[470px]">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr = <Tone color="red">6</Tone>;</>,
              <>*(ptr + <Tone color="red">1</Tone>) = <Tone color="red">8</Tone>;</>,
              <>printf(<Tone color="red">"%d %d %d"</Tone>, ptr[<Tone color="red">0</Tone>], ptr[<Tone color="red">1</Tone>], ptr[<Tone color="red">2</Tone>]);</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(4, ['6 8 0'])} />}
            activeLineIndex={2}
          />
        </div>

        <p className="w-[700px] text-[19px] leading-tight">
          Like we've seen in the <Tone color="red">pointer</Tone> chapter, you can access the following
          indexes by <Tone color="red">incrementing</Tone> the pointer.
        </p>
      </div>
    );
  }

  if (pageIndex === 5) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[2.6rem] leading-none underline">About Data types</h2>
        <p className="w-[760px] text-[19px] leading-tight">
          Dynamic memory doesn't have it's own <Tone color="red">data type</Tone>, it's just a
          sequence of bytes. The data in the memory can be <Tone color="red">interpreted</Tone> as a
          type based on the data type of the <Tone color="red">pointer</Tone>. For example:
        </p>

        <div className="w-[640px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr1 = malloc(<Tone color="red">4</Tone>);</>,
              <><Tone color="blue">char </Tone>*ptr2 = (<Tone color="blue">char</Tone>*) ptr1;</>,
              <>ptr1[<Tone color="red">0</Tone>] = <Tone color="red">1684234849</Tone>;</>,
              <>printf(<Tone color="red">"%d = (%c, %c, %c, %c)"</Tone>, *ptr1, ptr2[<Tone color="red">0</Tone>], ptr2[<Tone color="red">1</Tone>], ptr2[<Tone color="red">2</Tone>], ptr2[<Tone color="red">3</Tone>]);</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(5, ['1684234849 = (a, b, c, d)'])} />}
            activeLineIndex={3}
          />
        </div>

        <h3 className="pt-1 text-[2rem] leading-none underline">Explanation:</h3>
        <div className="w-[600px] text-[19px] leading-tight">
          <div>- We <Tone color="red">allocate</Tone> 4 bytes and assign the address to ptr1 which is <Tone color="red">int*</Tone>.</div>
          <div>- We <Tone color="red">cast</Tone> ptr1 to a <Tone color="red">char*</Tone> and assign the address to ptr2.</div>
          <div>- Both pointers point to the <Tone color="red">same</Tone> address, but ptr1 treats it as an <Tone color="red">int</Tone></div>
          <div>{'  '}and ptr2 treats it as a <Tone color="red">char</Tone>.</div>
          <div>Why do we get (a, b, c, d)?</div>
          <div>An int is <Tone color="red">4 bytes</Tone> and a char is <Tone color="red">1 byte</Tone>. Our int <Tone color="red">1684234849</Tone> in hexadecimal</div>
          <div>translates to <Tone color="red">64636261</Tone>, which splits into 4 separate bytes, <Tone color="red">64</Tone>, <Tone color="red">63</Tone>, <Tone color="red">62</Tone>, and <Tone color="red">61</Tone>.</div>
          <div>which are the <Tone color="red">ASCII</Tone> values of <Tone color="red">a</Tone>, <Tone color="red">b</Tone>, <Tone color="red">c</Tone>, and <Tone color="red">d</Tone>.</div>
        </div>

        <div className="absolute right-[70px] top-[16.4rem] w-[320px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[5]} minHeightClass="min-h-[95px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 6) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[2.6rem] leading-none underline">Reallocate Memory</h2>
        <p className="w-[740px] text-[19px] leading-tight">
          If the amount of memory that you reserved isn't enough, you can <Tone color="red">reallocate</Tone> it to make it
          larger. This reserves a different amount of <Tone color="red">memory</Tone> while keeping the same <Tone color="red">data</Tone>. To do
          it, use the <Tone color="red">realloc()</Tone> function:
        </p>

        <div className="w-[330px]">
          <div className="text-[19px] text-[#d2ddd7]">Syntax:</div>
          <div className="rounded-sm bg-[#e5e5e5] px-2 py-1 font-mono text-[15px] leading-tight text-[#5f5f5f]">
            <div><Tone color="blue">int </Tone>*ptr2 = realloc(ptr1, size);</div>
          </div>
        </div>

        <div className="space-y-0 text-[19px] leading-tight">
          <div>- <Tone color="red">ptr</Tone> - the pointer to the memory that is being resized.</div>
          <div>- <Tone color="red">size</Tone> - the new size.</div>
          <div>The function will try to return the same <Tone color="red">memory address</Tone>, but if it cannot resize</div>
          <div>the memory at the current address, it will <Tone color="red">allocate</Tone> a different address and</div>
          <div>return it instead.</div>
          <div>When this happens, the memory at the original address is no longer reserved</div>
          <div>and it's not safe to use, so it's good practice to assign the <Tone color="red">new pointer</Tone> to the</div>
          <div><Tone color="red">previous variable</Tone> so that the old pointer cannot be used accidently.</div>
        </div>

        <div className="w-[580px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr1, *ptr2, size;</>,
              <>size = <Tone color="red">4</Tone> * sizeof(*ptr1);</>,
              <>ptr1 = malloc(size);</>,
              <>printf(<Tone color="red">"%d bytes allocated at address %p \n"</Tone>, size, ptr1);</>,
              <>size = <Tone color="red">6</Tone> * sizeof(*ptr1);</>,
              <>ptr2 = realloc(ptr1, size);</>,
              <>printf(<Tone color="red">"%d bytes reallocated at address %p \n"</Tone>, size, ptr2);</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(6, ['16 bytes allocated at address 0x' + randomHex, '24 bytes reallocated at address 0x' + randomHex])} />}
            activeLineIndex={6}
          />
        </div>

        <div className="absolute right-[0px] top-[15.8rem] w-[390px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[6]} minHeightClass="min-h-[115px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 7) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <h2 className="text-[2.6rem] leading-none underline">Error Checking</h2>
        <p className="w-[640px] text-[19px] leading-tight">
          <Tone color="red">realloc()</Tone> returns <Tone color="red">NULL</Tone> when it's not able to allocate memory. So to
          make a safe code it's smart to add an <Tone color="red">if</Tone> statement to check for it:
        </p>

        <div className="w-[580px] pt-1">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr1, *ptr2;</>,
              <>ptr1 = malloc(<Tone color="red">4</Tone>);</>,
              <>ptr2 = realloc(ptr1, <Tone color="red">8</Tone>);</>,
              <><Tone color="blue">if </Tone>(ptr2 == <Tone color="red">NULL</Tone>) {'{'}</>,
              <>  printf(<Tone color="red">"Failed. Unable to resize memory.\n"</Tone>);</>,
              <>{'} '}<Tone color="blue">else </Tone>{'{'}</>,
              <>  printf(<Tone color="red">"8 bytes reallocated at address %p\n"</Tone>, ptr2);</>,
              <>  ptr1 = ptr2; <Tone color="green">//Updating ptr1 to point to the new memory</Tone></>,
              <>  free(ptr1); <Tone color="green">//Freeing unused memory</Tone></>,
              <>{'}'}</>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput(7, ['8 bytes reallocated at address 0x' + randomHex])} />}
            activeLineIndex={9}
          />
        </div>

        <div className="absolute right-[0px] top-[5.8rem] w-[390px]">
          <LessonChip text="output" />
          <OutputPanel lines={pageOutput[7]} minHeightClass="min-h-[118px]" />
        </div>

        <p className="pt-1 text-[19px] leading-tight">It's also important to <Tone color="red">free</Tone> memory when you are done using it.</p>
      </div>
    );
  }

  if (pageIndex === 8) {
    return renderFrame(
      <div className="min-h-[560px] space-y-2 text-left">
        <h2 className="text-[2.6rem] leading-none underline">Freeing Memory</h2>
        <p className="w-[760px] text-[19px] leading-tight">
          When you no longer need a block of memory, you should <Tone color="red">free</Tone> it, also
          referred to as <Tone color="red">deallocation</Tone>. Dynamic memory stays reserved until it is
          deallocated or until the program ends.
          Once the memory is deallocated, it can be used by other programs or
          allocated to another part of your program.
          <br />
          To deallocate memory, use the <Tone color="red">free()</Tone> function:
        </p>

        <div className="w-[390px]">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <><Tone color="blue">int </Tone>*ptr;</>,
              <>ptr1 = malloc(sizeof(ptr));</>,
              <EmptyLine key="m18-e1" />,
              <>free(ptr);</>,
              <>ptr = <Tone color="red">NULL</Tone>;</>,
            ]}
            lineStart={1}
            activeLineIndex={-1}
          />
        </div>

        <p className="w-[700px] text-[19px] leading-tight">
          It's good practice to set a pointer to <Tone color="red">NULL</Tone> after freeing it's memory
          so you cannot accidentally use it again.
        </p>
      </div>
    );
  }

  if (pageIndex === 9) {
    return renderFrame(
      <div className="min-h-[560px] space-y-2 text-left">
        <h2 className="text-[2.6rem] leading-none underline">Memory Leaks</h2>
        <p className="w-[920px] text-[19px] leading-tight">
          A <Tone color="red">memory leak</Tone> happens when a dynamic memory is allocated but never freed. When
          this happens in a loop or in a function, it could take a lot of memory and cause your
          computer to slow down.
          <br />
          There is a risk for a memory leak if a <Tone color="red">pointer</Tone> to a dynamic memory is lost before the
          memory can be <Tone color="red">freed</Tone>. It's important to keep track of pointers to prevent this.
          <br />
          Here are some examples for possible memory leaks:
        </p>

        <div className="grid grid-cols-[1fr_1fr_1fr] gap-8 pt-1">
          <div className="space-y-1">
            <div className="w-[320px]"><LessonChip text="Input" /><CodeEditor code={[
              <><Tone color="blue">int </Tone>x = <Tone color="red">5</Tone>;</>,
              <><Tone color="blue">int </Tone>*ptr;</>,
              <>ptr = calloc(<Tone color="red">2</Tone>, sizeof(*ptr));</>,
              <>ptr = &x;</>,
            ]} lineStart={1} activeLineIndex={-1} /></div>
            <p className="text-[19px] leading-tight">After the pointer is <Tone color="red">changed</Tone> to<br />point at x, the memory allocated<br />by <Tone color="red">calloc()</Tone> can no longer be<br />accessed</p>
          </div>

          <div className="space-y-1">
            <div className="w-[320px]"><LessonChip text="Input" /><CodeEditor code={[
              <><Tone color="blue">void </Tone>myFunction() {'{'}</>,
              <><Tone color="blue">int </Tone>*ptr;</>,
              <>ptr = malloc(sizeof(*ptr));</>,
              <>{'}'}</>,
            ]} lineStart={1} activeLineIndex={-1} /></div>
            <p className="text-[19px] leading-tight">The memory that was allocated<br />inside of the <Tone color="red">function</Tone> remains<br />allocated after the function ends<br />but it cannot be accessed<br />anymore</p>
          </div>

          <div className="space-y-1">
            <div className="w-[320px]"><LessonChip text="Input" /><CodeEditor code={[
              <><Tone color="blue">int </Tone>* ptr;</>,
              <>ptr = malloc(sizeof(*ptr));</>,
              <>ptr = realloc(ptr, <Tone color="red">2</Tone> * sizeof(*ptr));</>,
              <EmptyLine key="m18-e2" />,
            ]} lineStart={1} activeLineIndex={-1} /></div>
            <p className="text-[19px] leading-tight">If <Tone color="red">realloc()</Tone> is unable to reallocate<br />memory it will return a pointer to<br /><Tone color="red">NULL</Tone> and the original memory<br />will remain reserved</p>
          </div>
        </div>
      </div>
    );
  }

  return renderFrame(
    <div className="min-h-[560px] text-center">
      <p className="pt-8 text-[32px] leading-tight">What pratice is important when managing memory in C?</p>
      <div className="mx-auto w-[360px] pt-5">
        <ChoiceButtonGroup
          className="w-full space-y-0 pt-0"
          buttonClassName={`!h-[50px] !text-[18px] ${page11ChoiceClassName}`}
          options={[
            { label: 'Checking for errors\n(Null return)', onClick: () => setPage11Result([<Tone key="m18-q1w" color="red">Wrong!</Tone>]) },
            { label: 'Preventing memory leaks\n(freeing memory)', onClick: () => setPage11Result([<Tone key="m18-q2w" color="red">Wrong!</Tone>]) },
            { label: 'Setting the pointer to NULL\n(after deallocation)', onClick: () => setPage11Result([<Tone key="m18-q3w" color="red">Wrong!</Tone>]) },
            { label: 'All of the above', onClick: () => setPage11Result([<Tone key="m18-q4c" color="green">Correct!</Tone>]) },
          ]}
        />
      </div>
      <div className="pt-3 text-[32px] leading-none">{page11Result}</div>
    </div>
  );
}

export default LessonPage;
