'use client';

import { ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { EmptyLine, Tone } from '@/components/lesson/text';
import {
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
  const isLastPage = pageIndex === 3;

  const blankOutput = useMemo(() => [<EmptyLine key="blank" />], []);
  const [Output_2, setOutput_2] = useState<ReactNode[]>(blankOutput);
  const [Output_3, setOutput_3] = useState<ReactNode[]>(blankOutput);
  const [Output_4, setOutput_4] = useState<ReactNode[]>(blankOutput);

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
      <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
    </div>
  );

  const renderFrame = (content: ReactNode) => (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="Structures">
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
      <div className="min-h-[560px] space-y-2 text-left">
        <p className="w-full text-[20px] leading-none opacity-0">.</p>
        <p className="w-[640px] text-[20px] leading-tight">
          Structurs (commonly refered to as <Tone color="red">structs</Tone>), are a way to group several related
          <Tone color="red"> variables</Tone> into one place. Each variable in the struct is known as a
          <Tone color="red"> member</Tone>.
        </p>
        <p className="w-[640px] text-[20px] leading-tight">
          Unlike <Tone color="red">arrays</Tone>, structs can contain different <Tone color="red">data types</Tone>.
        </p>

        <p className="w-[640px] pt-2 text-[20px] leading-tight">
          You can create a struct by using the <Tone color="red">struct</Tone> keyword and declare each of its members
          inside the curly braces:
        </p>

        <div className="w-[355px]">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <>
                struct myStruct {'{'} <Tone color="green">// Declaration</Tone>
              </>,
              <>
                <Tone color="blue">int </Tone>num; <Tone color="green">// Member 1</Tone>
              </>,
              <>
                <Tone color="blue">char </Tone>letter; <Tone color="green">// Member 2</Tone>
              </>,
              <>
                {'};'} <Tone color="green">// Ending with a semicolon</Tone>
              </>,
            ]}
            lineStart={1}
            activeLineIndex={-1}
          />
        </div>

        <p className="w-[640px] pt-2 text-[20px] leading-tight">
          To <span className="font-semibold">access the struct you must create a variable of it:</span>
        </p>

        <div className="w-[355px]">
          <CodeEditor
            code={[
              <>
                <Tone color="blue">int </Tone>main() {'{'}
              </>,
              <>struct myStruct s1;</>,
              <>
                <Tone color="blue">return </Tone>
                <Tone color="red">0</Tone>;
              </>,
              '}',
            ]}
            lineStart={6}
            activeLineIndex={-1}
          />
        </div>
      </div>
    );
  }

  if (pageIndex === 1) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="grid grid-cols-[1fr_1fr] gap-12">
          <div className="space-y-2">
            <p className="text-[20px] leading-tight">
              To access the <Tone color="red">members</Tone> of the <Tone color="red">struct</Tone>, use the
              <Tone color="blue"> .</Tone> syntax:
            </p>
            <div className="w-[420px]">
              <LessonChip text="Input" />
              <CodeEditor
                code={[
                  <>struct myStruct {'{'}</>,
                  <>
                    <Tone color="blue">int </Tone>num;
                  </>,
                  <>
                    <Tone color="blue">char </Tone>letter;
                  </>,
                  '};',
                  <EmptyLine key="s2-0" />,
                  <>
                    <Tone color="blue">int </Tone>main() {'{'}
                  </>,
                  <>struct myStruct s1;</>,
                  <>
                    s1.num = <Tone color="red">5</Tone>;
                  </>,
                  <>
                    s1.letter = <Tone color="red">'a'</Tone>;
                  </>,
                  <>
                    printf(<Tone color="red">"My number: %d\n"</Tone>, s1.num);
                  </>,
                  <>
                    printf(<Tone color="red">"My letter: %c\n"</Tone>, s1.letter);
                  </>,
                  <>
                    <Tone color="blue">return </Tone>
                    <Tone color="red">0</Tone>;
                  </>,
                  '}',
                ]}
                lineStart={1}
                rightSlot={<RunButton onClick={() => setOutput_2(['My number: 5', 'My letter: a'])} />}
                activeLineIndex={12}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[19px] leading-tight">
              You can create <Tone color="red">multiple</Tone> struct <Tone color="red">variables</Tone> with
              different values, using the same struct "templete":
            </p>
            <div className="w-[420px]">
              <LessonChip text="Input" />
              <CodeEditor
                code={[
                  <>
                    <Tone color="blue">int </Tone>main() {'{'}
                  </>,
                  <>struct myStruct s1;</>,
                  <>struct myStruct s2;</>,
                  <>s1.num = <Tone color="red">5</Tone>;</>,
                  <>
                    s1.letter = <Tone color="red">'a'</Tone>;
                  </>,
                  <>s2.num = <Tone color="red">33</Tone>;</>,
                  <>
                    s2.letter = <Tone color="red">'R'</Tone>;
                  </>,
                  <>
                    <Tone color="blue">return </Tone>
                    <Tone color="red">0</Tone>;
                  </>,
                  '}',
                ]}
                lineStart={6}
                activeLineIndex={-1}
              />
            </div>
            <div className="w-[420px] pt-4">
              <LessonChip text="output" />
              <OutputPanel lines={Output_2} minHeightClass="min-h-[95px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageIndex === 2) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="grid grid-cols-[1fr_1fr] gap-12">
          <div className="space-y-2">
            <p className="text-[20px] leading-tight">
              Let's try to create a <Tone color="red">struct</Tone> that contains a string:
            </p>
            <div className="w-[420px]">
              <LessonChip text="Input" />
              <CodeEditor
                code={[
                  <>struct myStruct {'{'}</>,
                  <>
                    <Tone color="blue">int </Tone>num;
                  </>,
                  <>
                    <Tone color="blue">char </Tone>letter;
                  </>,
                  <>
                    <Tone color="blue">char </Tone>string[<Tone color="red">30</Tone>];
                  </>,
                  '};',
                  <EmptyLine key="s3-0" />,
                  <>
                    <Tone color="blue">int </Tone>main() {'{'}
                  </>,
                  <>struct myStruct s1;</>,
                  <>
                    s1.string = <Tone color="red">"Cool Text"</Tone>;
                  </>,
                  <>
                    printf(<Tone color="red">"My string: %s"</Tone>, s1.string);
                  </>,
                  <>
                    <Tone color="blue">return </Tone>
                    <Tone color="red">0</Tone>;
                  </>,
                  '}',
                ]}
                lineStart={1}
                rightSlot={<RunButton onClick={() => setOutput_3([<Tone key="s3-err" color="red">Error!</Tone>])} />}
                activeLineIndex={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[19px] leading-tight">
              As you can see, this will cause an <Tone color="red">error</Tone>. You can't assign a value to an
              <Tone color="red"> array</Tone> like this in C. The solution - use the <Tone color="red">strcpy()</Tone>
              function. Remember to include the string <Tone color="red">library</Tone> if you're using this function,
              <Tone color="red"> &lt;string.h&gt;</Tone>.
            </p>
            <div className="w-[420px]">
              <LessonChip text="Input" />
              <CodeEditor
                code={[
                  <>
                    <Tone color="blue">int </Tone>main() {'{'}
                  </>,
                  <>struct myStruct s1;</>,
                  <>
                    strcpy(s1.string, <Tone color="red">"Cool Text"</Tone>);
                  </>,
                  <>
                    printf(<Tone color="red">"My string: %s"</Tone>, s1.string);
                  </>,
                  <>
                    <Tone color="blue">return </Tone>
                    <Tone color="red">0</Tone>;
                  </>,
                  '}',
                ]}
                lineStart={6}
                rightSlot={<RunButton onClick={() => setOutput_3(['My string: Cool Text'])} />}
                activeLineIndex={4}
              />
            </div>
            <div className="w-[420px] pt-4">
              <LessonChip text="output" />
              <OutputPanel lines={Output_3} minHeightClass="min-h-[95px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderFrame(
    <div className="relative min-h-[560px] text-left">
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-10">
        <div className="space-y-2">
          <h2 className="text-[3rem] leading-none underline">Simpler Syntax</h2>
          <p className="text-[19px] leading-tight">
            You can assign values to <Tone color="red">members</Tone> of a <Tone color="red">struct</Tone> variable at
            declaration, in a single line:
          </p>
          <div className="w-[510px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>struct myStruct {'{'}</>,
                <>
                  <Tone color="blue">int </Tone>num;
                </>,
                <>
                  <Tone color="blue">char </Tone>letter;
                </>,
                <>
                  <Tone color="blue">char </Tone>string[<Tone color="red">30</Tone>];
                </>,
                  '};',
                <EmptyLine key="s4-0" />,
                <>
                  <Tone color="blue">int </Tone>main() {'{'}
                </>,
                <>
                  struct myStruct s1 = {'{'} <Tone color="red">5</Tone>, <Tone color="red">'a'</Tone>,{' '}
                  <Tone color="red">"Cool Text"</Tone> {'}'};
                </>,
                <>
                  printf(<Tone color="red">"%d\n%c\n%s"</Tone>, s1.num, s1.letter,s1.string);
                </>,
                <>
                  <Tone color="blue">return </Tone>
                  <Tone color="red">0</Tone>;
                </>,
                '}',
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={() => setOutput_4(['5', 'a', 'Cool Text'])} />}
              activeLineIndex={10}
            />
          </div>
          <p className="text-[19px] leading-tight">
            Notice how you don't need to use <Tone color="red">strcpy()</Tone> when using this method.
          </p>
        </div>

        <div className="space-y-2 pt-9">
          <p className="text-[19px] leading-tight">
            You can also <Tone color="red">copy</Tone> structs by assigning one struct to another:
          </p>
          <div className="w-[420px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>
                  struct myStruct s1 = {'{'}<Tone color="red">5</Tone>, <Tone color="red">'a'</Tone>,{' '}
                  <Tone color="red">"Cool Text"</Tone>{'}'};
                </>,
                <>struct myStruct s2;</>,
                <>s2 = s1;</>,
              ]}
              lineStart={8}
              activeLineIndex={-1}
            />
          </div>
          <div className="w-[420px] pt-7">
            <LessonChip text="output" />
            <OutputPanel lines={Output_4} minHeightClass="min-h-[170px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
