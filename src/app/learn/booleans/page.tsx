'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';
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
import { auth } from '@/app/firebase/config';
import { markLessonCompleted } from '@/lib/lesson-progress';

function LessonPage() {
  const router = useRouter();
  const [Output_1, setOutput_1] = useState<ReactNode[]>([<EmptyLine key="o1-empty" />]);
  const [page1Info, setPage1Info] = useState<ReactNode[]>([]);

  const onBack = () => {
    router.push('/learn');
  };

  const onFinish = async () => {
    const user = auth.currentUser;
    if (user && !user.isAnonymous) {
      try {
        await markLessonCompleted(user.uid, 'booleans');
      } catch (error) {
        console.error('Failed to mark lesson completed: booleans', error);
      }
    }
    router.push('/learn');
  };

  const page1Code = useMemo(
    () => [
      '#include <stdio.h>',
      '#include <stdbool.h>',
      <EmptyLine key="bool-empty" />,
      <>
        <Tone color="blue">int </Tone>
        <Tone color="dark">main() {'{'}</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">bool </Tone>
        <span>x = </span>
        <Tone color="red">true</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        {'  '}
        <Tone color="blue">bool </Tone>
        <span>y = </span>
        <Tone color="red">false</Tone>
        <Tone color="dark">;</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"%d\n%d"</Tone>, x, y);
      </>,
      <>
        {'  '}
        <Tone color="blue">return </Tone>
        <Tone color="red">0</Tone>
        <Tone color="dark">;</Tone>
      </>,
      '}',
    ],
    []
  );

  const page1_input1 = () => {
    setOutput_1([
      <Tone key="b1-line1" color="white">1</Tone>,
      <Tone key="b1-line2" color="white">0</Tone>,
    ]);
    setPage1Info([
      <span key="b1-info-1">
        Notice that we use <Tone color="red">%d</Tone> for the data type <Tone color="red">bool</Tone> since it's
        value is returned as an integer,
      </span>,
      <span key="b1-info-2">
        <Tone color="red">1</Tone> for True, and <Tone color="red">0</Tone> for False.
      </span>,
      <span key="b1-info-3">
        In <Tone color="red">C</Tone>, any <Tone color="red">nonzero</Tone> value, whether it's a number,
        character, or string, evaluates to true when assigned to a bool.
      </span>,
    ]);
  };

  return (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1000} title="Booleans">
        <div className="relative w-[1000px] max-w-none">
          <HomeButton />

          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
            <div className="space-y-3 text-left">
              <p className="w-full text-[19px] leading-tight">
                A boolean is a binary value, which can be very useful
                <br />
                in programming. It can be used for:
              </p>

              <div className="w-full text-[19px] leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3232]">•</span>
                  <span>True / False</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3232]">•</span>
                  <span>On / Off</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3232]">•</span>
                  <span>1 / 0</span>
                </div>
              </div>

              <p className="w-full text-[19px] leading-tight">
                In C, we have <Tone color="red">bool</Tone> data type, it can either be true or
                <br />
                false. You must import <Tone color="red">&lt;stdbool.h&gt;</Tone> to use it.
              </p>

              <div className="flex items-start justify-between gap-8">
                <div className="w-[430px] shrink-0">
                  <LessonChip text="Input" />
                  <div className="relative">
                    <CodeEditor code={page1Code} lineStart={1} />
                    <RunButton onClick={page1_input1} className="absolute bottom-2 right-3" />
                  </div>
                </div>

                <div className="w-[380px] shrink-0 space-y-3 pt-0.5">
                  <div>
                    <LessonChip text="output" />
                    <OutputPanel lines={Output_1} minHeightClass="min-h-[131px]" />
                  </div>

                  <div className="min-h-[132px] space-y-1 text-[14px] leading-tight text-white">
                    {page1Info.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-[2.5rem] flex items-center justify-between">
            <LessonBackButton onClick={onBack} />
            <LessonNextButton onClick={onFinish} isLastPage={true} />
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default LessonPage;

