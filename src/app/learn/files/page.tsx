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
  const isLastPage = pageIndex === 6;

  const blankOutput = useMemo(() => [<EmptyLine key="blank" />], []);
  const [Output_3, setOutput_3] = useState<ReactNode[]>(blankOutput);
  const [Output_4, setOutput_4] = useState<ReactNode[]>(blankOutput);
  const [Output_5, setOutput_5] = useState<ReactNode[]>(blankOutput);
  const [Output_6, setOutput_6] = useState<ReactNode[]>(blankOutput);

  const [quiz1Result, setQuiz1Result] = useState<ReactNode[]>([]);
  const [quiz2Result, setQuiz2Result] = useState<ReactNode[]>([]);
  const quizChoiceClassName = '!rounded-sm !border-[#94c8aa] !bg-[#69ac8a] !text-white hover:!bg-[#94c8aa]';

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

  const runPage3 = () => {
    setOutput_3(['Hello diary...']);
  };

  const runPage4 = () => {
    setOutput_4(['Hello diary...', 'Today was sunny.']);
  };

  const runPage5 = () => {
    setOutput_5(['Hello diary...']);
  };

  const runPage6Left = () => {
    setOutput_6(['Hello diary...', 'Today was sunny.']);
  };

  const runPage6Right = () => {
    setOutput_6([<Tone key="f6-err" color="red">Couldn't open the file</Tone>]);
  };

  const pickQuiz1 = (answer: number) => {
    if (answer === 3) {
      setQuiz1Result([<Tone key="q1-ok" color="green">Correct!</Tone>]);
      return;
    }
    setQuiz1Result([<Tone key="q1-bad" color="red">Wrong!</Tone>]);
  };

  const pickQuiz2 = (answer: number) => {
    if (answer === 4) {
      setQuiz2Result([<Tone key="q2-ok" color="green">Correct!</Tone>]);
      return;
    }
    setQuiz2Result([<Tone key="q2-bad" color="red">Wrong!</Tone>]);
  };

  const renderNav = () => (
    <div className="mt-[2.5rem] flex items-center justify-between">
      <LessonBackButton onClick={onBack} />
      <LessonNextButton onClick={onNextOrFinish} isLastPage={isLastPage} />
    </div>
  );

  const renderFrame = (content: ReactNode) => (
    <div className="lesson-selectable h-screen overflow-hidden px-[50px] py-[50px] text-center text-white">
      <ScaledLessonFrame baseWidth={1090} title="Files">
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
      <div className="min-h-[560px] space-y-3 text-left">
        <p className="w-[720px] text-[19px] leading-tight">
          In <Tone color="red">C</Tone> you can create, open, read, and write to files by declaring
          a <Tone color="red">pointer</Tone> of type <Tone color="red">FILE</Tone> and using the <Tone color="red">fopen()</Tone> function:
        </p>

        <div className="w-[345px]">
          <div className="text-[19px] text-[#d2ddd7]">Syntax:</div>
          <div className="rounded-sm bg-[#e5e5e5] px-2 py-1 font-mono text-[15px] leading-tight text-[#5f5f5f]">
            <div>File *fptr;</div>
            <div>fptr= fopen(filename,mode);</div>
          </div>
        </div>

        <div className="space-y-1 pt-1 text-[19px] leading-tight">
          <div>- <Tone color="red">filename</Tone> - the name of the file, for example file.txt</div>
          <div>- <Tone color="red">mode</Tone> - a single character which represents what you want to do with the file:</div>
          <div className="pl-6"><Tone color="red">w</Tone> - write to a file</div>
          <div className="pl-6"><Tone color="red">a</Tone> - append to a file</div>
          <div className="pl-6"><Tone color="red">r</Tone> - read from a file</div>
        </div>
      </div>
    );
  }

  if (pageIndex === 1) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="w-[470px] space-y-2">
          <h2 className="text-[2.6rem] leading-none underline">Create a File</h2>
          <p className="text-[19px] leading-tight">
            To create a file, you can use the <Tone color="red">w</Tone> mode inside the
            <Tone color="red"> fopen()</Tone> function. The w mode is used to write to file,
            but if the file doesn't exist, it will create one for you.
          </p>

          <div className="w-[360px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>File *fptr;</>,
                <>fptr= fopen(<Tone color="red">"filename.txt", "w"</Tone>);</>,
                <>fclose(fptr);</>,
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>

          <p className="text-[19px] leading-tight">
            The <Tone color="red">file</Tone> is created in the current working <Tone color="red">directory</Tone>
            of your program, unless you specify otherwise.
            You can specify another folder by providing an
            <Tone color="red"> absolute path</Tone>:
          </p>

          <div className="w-[470px] rounded-sm bg-[#e5e5e5] px-2 py-1 font-mono text-[15px] leading-tight text-[#ff6565]">
            <div><span className="text-[#5f5f5f]">fptr= fopen(</span>"C:\\Desktop\\files\\filename.txt", "w"<span className="text-[#5f5f5f]">);</span></div>
          </div>

          <p className="text-[19px] leading-tight">
            *Notice the <Tone color="red">fclose()</Tone> function, it will close the file
            when we are done with it. It will make sure that the
            file is saved properly, freeing it up for other
            programs to use, and cleaning up unnecessary
            memory space.
          </p>
        </div>

        <div className="absolute right-[14px] top-[2.8rem] h-[345px] w-[545px]">
          <img
            src="/lesson-images/files/1.png"
            alt="Files folder"
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  if (pageIndex === 2) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="w-[470px] space-y-2">
          <h2 className="text-[2.6rem] leading-none underline">Write To File</h2>
          <p className="text-[19px] leading-tight">
            To write to <Tone color="red">file</Tone>, we will use the <Tone color="red">w</Tone> mode again.
            We can use the <Tone color="red">fprintf()</Tone> function that takes a
            variable (in our case it's the file) and a text to
            save in that variable:
          </p>

          <div className="w-[370px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>File *fptr;</>,
                <>fptr= fopen(<Tone color="red">"filename.txt", "w"</Tone>);</>,
                <>fprintf(fptr, <Tone color="red">"Hello diary..."</Tone>);</>,
                <>fclose(fptr);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={runPage3} />}
              activeLineIndex={3}
            />
          </div>

          <p className="text-[19px] leading-tight">
            *Note that if the file already exists, this will
            overwrite the previous content, deleting it.
          </p>
        </div>

        <div className="absolute right-[160px] top-[6.8rem] h-[190px] w-[335px]">
          <img
            src="/lesson-images/files/2.png"
            alt="Notepad file"
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>

        <div className="absolute right-[160px] top-[19rem] w-[335px]">
          <LessonChip text="output" />
          <OutputPanel lines={Output_3} minHeightClass="min-h-[65px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 3) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="w-[470px] space-y-2">
          <h2 className="text-[2.6rem] leading-none underline">Append To File</h2>
          <p className="text-[19px] leading-tight">
            If you want to add content to a <Tone color="red">file</Tone> without
            deleting the old content, use the <Tone color="red">a</Tone> mode:
          </p>

          <div className="w-[370px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>File *fptr;</>,
                <>fptr= fopen(<Tone color="red">"filename.txt", "a"</Tone>);</>,
                <>fprintf(fptr, <Tone color="red">"\nToday was sunny."</Tone>);</>,
                <>fclose(fptr);</>,
              ]}
              lineStart={1}
              rightSlot={<RunButton onClick={runPage4} />}
              activeLineIndex={3}
            />
          </div>

          <p className="text-[19px] leading-tight">
            *Like with the <Tone color="red">w</Tone> mode, if the file doesn't
            exist, a new one will be created.
          </p>
        </div>

        <div className="absolute right-[160px] top-[6.8rem] h-[190px] w-[335px]">
          <img
            src="/lesson-images/files/3.png"
            alt="Appended notepad file"
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>

        <div className="absolute right-[160px] top-[19rem] w-[335px]">
          <LessonChip text="output" />
          <OutputPanel lines={Output_4} minHeightClass="min-h-[92px]" />
        </div>
      </div>
    );
  }

  if (pageIndex === 4) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="w-[470px] space-y-2">
          <h2 className="text-[2.6rem] leading-none underline">Read a File</h2>
          <p className="text-[19px] leading-tight">
            If you want to read a file, use the <Tone color="red">r</Tone> mode:
          </p>

          <div className="w-[370px]">
            <LessonChip text="Input" />
            <CodeEditor
              code={[
                <>File *fptr;</>,
                <>fptr= fopen(<Tone color="red">"filename.txt", "r"</Tone>);</>,
              ]}
              lineStart={1}
              activeLineIndex={-1}
            />
          </div>

          <p className="text-[19px] leading-tight">
            Now we will need to create a <Tone color="red">string</Tone> to store
            the text we want to read from the file
            (remember to make it big enough), and then
            use the <Tone color="red">fgets()</Tone> function to store it in ther:
          </p>

          <div className="w-[370px]">
            <CodeEditor
              code={[
                <><Tone color="blue">char </Tone>string[<Tone color="red">100</Tone>];</>,
                <>fgets(string,<Tone color="red">100</Tone>,fptr);</>,
              ]}
              lineStart={3}
              activeLineIndex={-1}
            />
          </div>

          <div className="space-y-0 text-[19px] leading-tight">
            <div>the <Tone color="red">fgets()</Tone> function takes 3 parameters:</div>
            <div>- a variable to store a text in</div>
            <div>- maximum size of the text</div>
            <div>- a pointer to a file to read from</div>
          </div>
        </div>

        <div className="absolute right-[30px] top-[3.5rem] w-[420px]">
          <LessonChip text="output" />
          <OutputPanel lines={Output_5} minHeightClass="min-h-[90px]" />
        </div>

        <div className="absolute right-[30px] top-[13.2rem] w-[420px]">
          <CodeEditor
            code={[
              <>printf(<Tone color="red">"%s"</Tone>, string);</>,
              <>fclose(fptr);</>,
            ]}
            lineStart={5}
            rightSlot={<RunButton onClick={runPage5} />}
            activeLineIndex={1}
          />
          <p className="pt-1 text-[19px] leading-tight">
            Notice that <Tone color="red">fgets()</Tone> only reads the first
            line of the file.
          </p>
        </div>
      </div>
    );
  }

  if (pageIndex === 5) {
    return renderFrame(
      <div className="relative min-h-[560px] text-left">
        <div className="grid grid-cols-[1fr_1fr] gap-10">
          <div className="space-y-2">
            <p className="text-[19px] leading-tight">
              To read every line, we can use a <Tone color="red">while</Tone> loop:
            </p>
            <div className="w-[420px]">
              <LessonChip text="Input" />
              <CodeEditor
                code={[
                  <>FILE *fptr;</>,
                  <>fptr = fopen(<Tone color="red">"filename.txt", "r"</Tone>);</>,
                  <><Tone color="blue">char </Tone>string[<Tone color="red">100</Tone>];</>,
                  <><Tone color="blue">while</Tone>(fgets(string, <Tone color="red">100</Tone>, fptr)) {'{'}</>,
                  <>  printf(<Tone color="red">"%s"</Tone>, string);</>,
                  <>{'}'}</>,
                  <>fclose(fptr);</>,
                ]}
                lineStart={1}
                rightSlot={<RunButton onClick={runPage6Left} />}
                activeLineIndex={6}
              />
            </div>
            <div className="w-[420px]">
              <LessonChip text="output" />
              <OutputPanel lines={Output_6} minHeightClass="min-h-[105px]" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[19px] leading-tight">
              If the file doesn't exist, <Tone color="red">fopen()</Tone> will return
              <Tone color="red"> NULL</Tone>, therefore, a good practice is to use
              an <Tone color="red">if</Tone> statement to test for it:
            </p>
            <div className="w-[420px]">
              <LessonChip text="Input" />
              <CodeEditor
                code={[
                  <>FILE *fptr;</>,
                  <>fptr = fopen(<Tone color="red">"filename.txt", "r"</Tone>);</>,
                  <><Tone color="blue">char </Tone>string[<Tone color="red">100</Tone>];</>,
                  <>if(fptr != NULL) {'{'}</>,
                  <>  <Tone color="blue">while</Tone>(fgets(string, <Tone color="red">100</Tone>, fptr)) {'{'}</>,
                  <>    printf(<Tone color="red">"%s"</Tone>, string);</>,
                  <>  {'}'}</>,
                  <>{'} else {'}</>,
                  <>  printf(<Tone color="red">"Couldn't open the file"</Tone>);</>,
                  <>{'}'}</>,
                  <>fclose(fptr);</>,
                ]}
                lineStart={1}
                rightSlot={<RunButton onClick={runPage6Right} />}
                activeLineIndex={10}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderFrame(
    <div className="relative min-h-[560px] text-left">
      <div className="grid grid-cols-[1fr_1fr] gap-16 pt-6">
        <div className="space-y-4">
          <p className="text-[19px] leading-tight">
            Which <Tone color="red">mode</Tone> would you use to write into a
            file, making sure to not delete what is
            already in it?
          </p>
          <ChoiceButtonGroup
            className="w-[180px] space-y-0 pt-0"
            buttonClassName={`!h-[38px] ${quizChoiceClassName}`}
            options={[
              { label: '"r"', onClick: () => pickQuiz1(1) },
              { label: '"w"', onClick: () => pickQuiz1(2) },
              { label: '"a"', onClick: () => pickQuiz1(3) },
              { label: '"e"', onClick: () => pickQuiz1(4) },
            ]}
          />
          <div className="min-h-[22px] text-[18px] leading-tight">{quiz1Result}</div>
        </div>

        <div className="space-y-4">
          <p className="text-[19px] leading-tight">
            Why do we close the file when we are done
            using it?
          </p>
          <ChoiceButtonGroup
            className="w-[250px] space-y-0 pt-0"
            buttonClassName={`!h-[38px] ${quizChoiceClassName}`}
            options={[
              { label: 'save changes', onClick: () => pickQuiz2(1) },
              { label: 'let other programs use it', onClick: () => pickQuiz2(2) },
              { label: 'clean up memory space', onClick: () => pickQuiz2(3) },
              { label: 'all of the above', onClick: () => pickQuiz2(4) },
            ]}
          />
          <div className="min-h-[22px] text-[18px] leading-tight">{quiz2Result}</div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
