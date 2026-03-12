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
  const isLastPage = pageIndex === 1;

  const blankOutput = useMemo(() => [<EmptyLine key="blank" />], []);
  const [Output_2, setOutput_2] = useState<ReactNode[]>(blankOutput);

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
      <ScaledLessonFrame baseWidth={1090} title="Enums">
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
          An <Tone color="red">enum</Tone> is a special type that represents a group of
          <Tone color="red"> constants</Tone>. You can think of it as a user created <Tone color="red">data type</Tone>
          that works similarly to bool. While <Tone color="red">bool</Tone> can only be 0 or 1, an enum can have multiple
          <Tone color="red"> constant values</Tone>, like an extended and customizable version of bool.
        </p>

        <div className="flex items-start gap-2">
          <div className="w-[260px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>
                  <Tone color="blue">enum </Tone>Level {'{'}
                </>,
                <> LOW,</>,
                <> MEDIUM,</>,
                <> HIGH</>,
                '};',
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
          <div className="pt-8 text-[16px] leading-tight">
            * Uppercase letters
            <br /> are not required but
            <br /> are often considered
            <br /> as good practice.
          </div>
        </div>

        <p className="w-[830px] pt-2 text-[20px] leading-tight">
          To access the enum, create a variable of it, and then assign a <Tone color="red">value</Tone> to it. The
          assigned value must be one of the items inside the enum (<Tone color="red">LOW</Tone>,
          <Tone color="red"> MEDIUM</Tone>, or <Tone color="red">HIGH</Tone>).
        </p>

        <div className="w-[335px]">
          <CodeEditor
            code={[
              <>
                <Tone color="blue">enum </Tone>Level myVar;
              </>,
              <>myVar = MEDIUM;</>,
            ]}
            lineStart={8}
            activeLineIndex={-1}
          />
        </div>
      </div>
    );
  }

  return renderFrame(
    <div className="relative min-h-[560px] text-left">
      <p className="w-[690px] text-[20px] leading-tight">
        By default, the first item (<Tone color="red">LOW</Tone>) has the value of <Tone color="red">0</Tone>, the
        second has the value <Tone color="red">1</Tone>, and so on. So if you'll print the variable from our example,
        which we assigned <Tone color="red">MEDIUM</Tone> to, it will print <Tone color="red">1</Tone>.
      </p>

      <div className="pt-2">
        <div className="w-[430px]">
          <LessonChip text="Input" />
          <CodeEditor
            code={[
              <>
                <Tone color="blue">enum </Tone>Level myVar = MEDIUM;
              </>,
              <>
                printf(<Tone color="red">"%d"</Tone>, myVar);
              </>,
            ]}
            lineStart={1}
            rightSlot={<RunButton onClick={() => setOutput_2(['1'])} />}
            activeLineIndex={1}
          />
        </div>
      </div>

      <div className="absolute right-[210px] top-[11.2rem] w-[210px]">
        <LessonChip text="output" />
        <OutputPanel lines={Output_2} minHeightClass="min-h-[95px]" />
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-10 pt-7">
        <div>
          <p className="text-[20px] leading-tight">
            You can change the
            <br /> default <Tone color="red">values</Tone> on
            <br /> declaration:
          </p>
          <div className="w-[280px] pt-1">
            <CodeEditor
              code={[
                <>
                  <Tone color="blue">enum </Tone>Level {'{'}
                </>,
                <>
                  LOW = <Tone color="red">25</Tone>,
                </>,
                <>
                  MEDIUM = <Tone color="red">50</Tone>,
                </>,
                <>
                  HIGH = <Tone color="red">75</Tone>
                </>,
                '};',
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
        </div>

        <div>
          <p className="text-[20px] leading-tight">
            If you change the value of one
            <br /> specific item, the next items will
            <br /> update accordingly:
          </p>
          <div className="w-[430px] pt-1">
            <CodeEditor
              code={[
                <>
                  <Tone color="blue">enum </Tone>Level {'{'}
                </>,
                <>
                  LOW = <Tone color="red">7</Tone>,
                </>,
                <>
                  MEDIUM, <Tone color="green">//Now 8</Tone>
                </>,
                <>
                  HIGH <Tone color="green">//Now 9</Tone>
                </>,
                '};',
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
