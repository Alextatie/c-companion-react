'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import { useGlobalLoading } from './providers/loading-provider';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import { EmptyLine, Tone } from '@/components/lesson/text';
import { CodeEditor, LessonChip, OutputPanel, RunButton } from '@/components/lesson/ui';
import { renderHighlightedCodeLineWithOptions } from '@/components/lesson/code-highlighting';
import { formatCodeFixerTimer, getCodeFixerInputWidthPx, type CodeFixerRule } from '@/lib/games/code-fixer-logic';
import cursorPng from '@/data/cursor-filled.png';

const LESSON_RUN_START_EVENT = 'lesson-run-start';
const LESSON_RUN_COMPLETE_EVENT = 'lesson-run-complete';
const SHOWCASE_FADE_MS = 500;
const SHOWCASE_STATES = [
  {
    kind: 'lesson',
  },
  {
    kind: 'game',
  },
] as const;
const SHOWCASE_DURATIONS_MS: Record<(typeof SHOWCASE_STATES)[number]['kind'], number> = {
  lesson: 10000,
  game: 12000,
};
const CODE_FIXER_INPUT_FIELD_TOKEN_REGEX = /\[\[(input(?:_[a-d])?)\]\]/g;
const CODE_FIXER_ROUND_8_PROMPT = 'Fix the following code to achieve the right output as seen bellow:';
const CODE_FIXER_ROUND_8_CODE = 'int main() {\n  int x = 5;\n  printf("[[input]]", x);\n  return 0;\n}';
const CODE_FIXER_ROUND_8_VALIDATOR: CodeFixerRule = {
  type: 'exact_any',
  field: 'input_a',
  accepted: ['%d'],
};

function renderCodeFixerPromptText(prompt: string): ReactNode {
  const parts = prompt.split(/(output|comment|error|operator|function)/g);
  return parts.map((part, index) =>
    part === 'output' || part === 'comment' || part === 'error' || part === 'operator' || part === 'function' ? (
      <span key={`welcome-game-prompt-${index}`} className="text-[#ff6565]">
        {part}
      </span>
    ) : (
      <span key={`welcome-game-prompt-${index}`}>{part}</span>
    )
  );
}

function renderCodeFixerGameLine(line: string, lineKey: string): ReactNode {
  return renderHighlightedCodeLineWithOptions(line, lineKey, {
    highlightQuestionMarks: false,
    questionMarkClassName: '',
    questionMarkStyle: { color: '#c2c2c2' },
  });
}

function renderInlineCodeFixerSegment(segment: string, lineKey: string): ReactNode {
  if (segment.length === 0) {
    return null;
  }

  const nodes: ReactNode[] = [];
  let workingSegment = segment;

  if (workingSegment.endsWith('"')) {
    const withoutTrailingQuote = workingSegment.slice(0, -1);
    if (withoutTrailingQuote.length > 0) {
      nodes.push(
        <span key={`${lineKey}-body`}>
          {renderCodeFixerGameLine(withoutTrailingQuote, `${lineKey}-body-content`)}
        </span>
      );
    }
    nodes.push(
      <span key={`${lineKey}-quote-end`} className="text-[#ff6565]">
        "
      </span>
    );
    return <>{nodes}</>;
  }

  if (workingSegment.startsWith('"')) {
    nodes.push(
      <span key={`${lineKey}-quote-start`} className="text-[#ff6565]">
        "
      </span>
    );
    workingSegment = workingSegment.slice(1);
    if (workingSegment.length > 0) {
      nodes.push(
        <span key={`${lineKey}-body`}>
          {renderCodeFixerGameLine(workingSegment, `${lineKey}-body-content`)}
        </span>
      );
    }
    return <>{nodes}</>;
  }

  return renderCodeFixerGameLine(workingSegment, lineKey);
}

const LandingPage = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const { setLoading } = useGlobalLoading();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [showcaseVisible, setShowcaseVisible] = useState(true);
  const [lessonOutput1, setLessonOutput1] = useState<ReactNode[]>([<EmptyLine key="welcome-o1-empty" />]);
  const [previewCursorVisible, setPreviewCursorVisible] = useState(false);
  const [previewCursorAtRun, setPreviewCursorAtRun] = useState(false);
  const [previewRunPressed, setPreviewRunPressed] = useState(false);
  const [gameCursorVisible, setGameCursorVisible] = useState(false);
  const [gameCursorTarget, setGameCursorTarget] = useState<'timer' | 'input' | 'run'>('timer');
  const [gameInputValue, setGameInputValue] = useState('');
  const [gameInputFocused, setGameInputFocused] = useState(false);
  const [gameTimerSeconds, setGameTimerSeconds] = useState(115);
  const [gameRunPressed, setGameRunPressed] = useState(false);
  const [gameResultVisible, setGameResultVisible] = useState(false);

  const page1CodeA = useMemo(
    () => [
      '#include <stdio.h>',
      <EmptyLine />,
      <>
        <Tone color="blue">int </Tone>
        <Tone color="dark">main() {'{'}</Tone>
      </>,
      <>
        {'  '}printf(<Tone color="red">"Hello World!"</Tone>
        <Tone color="dark">);</Tone>
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

  const page1CodeB = useMemo(
    () => [
      <>
        <Tone color="blue">int </Tone>
        <Tone color="dark">main() {'{'}</Tone>
      </>,
      '  printf(Hello World!);',
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

  const codeFixerInlineInputWidthPx = useMemo(
    () =>
      getCodeFixerInputWidthPx({
        validator: CODE_FIXER_ROUND_8_VALIDATOR,
        inline: true,
      }),
    []
  );

  const codeFixerRound8RenderedCodeLines = useMemo(() => {
    const renderPreviewInputField = (field: string) => (
      <input
        key={`welcome-game-input-${field}`}
        type="text"
        value={field === 'input_a' ? gameInputValue : ''}
        readOnly
        tabIndex={-1}
        placeholder=""
        className={`h-7 rounded border border-slate-400 bg-white px-1.5 font-mono text-[17px] text-slate-900 outline-none cursor-default ${
          gameInputFocused ? 'ring-2 ring-[#8fd949]' : ''
        }`}
        style={{ width: `${codeFixerInlineInputWidthPx}px` }}
      />
    );

    return CODE_FIXER_ROUND_8_CODE.split('\n').map((line, index) => {
      if (!line.includes('[[')) {
        return renderCodeFixerGameLine(line, `welcome-game-${index}`);
      }

      const segments: ReactNode[] = [];
      let lastIndex = 0;
      let tokenIndex = 0;

      for (const match of line.matchAll(CODE_FIXER_INPUT_FIELD_TOKEN_REGEX)) {
        const field = match[1] === 'input' ? 'input_a' : match[1];
        const tokenStart = match.index ?? 0;

        if (tokenStart > lastIndex) {
          segments.push(
            <span key={`welcome-game-text-${index}-${tokenIndex}`}>
              {renderInlineCodeFixerSegment(
                line.slice(lastIndex, tokenStart),
                `welcome-game-seg-${index}-${tokenIndex}`
              )}
            </span>
          );
        }

        segments.push(
          <span key={`welcome-game-input-wrap-${index}-${field}`} className="inline-flex items-center">
            {renderPreviewInputField(field)}
          </span>
        );

        lastIndex = tokenStart + match[0].length;
        tokenIndex += 1;
      }

      if (lastIndex < line.length) {
        segments.push(
          <span key={`welcome-game-tail-${index}`}>
            {renderInlineCodeFixerSegment(line.slice(lastIndex), `welcome-game-tail-${index}`)}
          </span>
        );
      }

      return <>{segments}</>;
    });
  }, [codeFixerInlineInputWidthPx, gameInputFocused, gameInputValue]);

  const page1Input1 = () => setLessonOutput1([<Tone key="welcome-o1-correct" color="white">Hello World!</Tone>]);
  const page1Input2 = () => setLessonOutput1([<Tone key="welcome-o1-wrong" color="red">Error!</Tone>]);
  const currentShowcase = SHOWCASE_STATES[showcaseIndex];

  useEffect(() => {
    if (SHOWCASE_STATES.length <= 1) {
      return;
    }

    let fadeTimer: ReturnType<typeof setTimeout> | null = null;
    const rotationTimer = setTimeout(() => {
      setShowcaseVisible(false);
      fadeTimer = setTimeout(() => {
        setShowcaseIndex((prev) => (prev + 1) % SHOWCASE_STATES.length);
        setShowcaseVisible(true);
      }, SHOWCASE_FADE_MS);
    }, SHOWCASE_DURATIONS_MS[currentShowcase.kind]);

    return () => {
      clearTimeout(rotationTimer);
      if (fadeTimer !== null) {
        clearTimeout(fadeTimer);
      }
    };
  }, [currentShowcase.kind]);

  useEffect(() => {
    setLoading('landing-auth-state', loading);
    return () => setLoading('landing-auth-state', false);
  }, [loading, setLoading]);

  useEffect(() => {
    if (!loading && user) {
      setIsRedirecting(true);
      router.replace('/Home');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (currentShowcase.kind !== 'lesson') {
      setPreviewCursorVisible(false);
      setPreviewCursorAtRun(false);
      setPreviewRunPressed(false);
      setLessonOutput1([<EmptyLine key="welcome-o1-empty" />]);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    setLessonOutput1([<EmptyLine key="welcome-o1-empty" />]);
    setPreviewCursorVisible(true);
    setPreviewCursorAtRun(false);
    setPreviewRunPressed(false);

    timers.push(
      setTimeout(() => {
        setPreviewCursorAtRun(true);
      }, 3000)
    );

    timers.push(
      setTimeout(() => {
        setPreviewRunPressed(true);
      }, 4600)
    );

    timers.push(
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent(LESSON_RUN_START_EVENT));
      }, 4675)
    );

    timers.push(
      setTimeout(() => {
        page1Input1();
        document.dispatchEvent(new CustomEvent(LESSON_RUN_COMPLETE_EVENT));
        setPreviewRunPressed(false);
      }, 5450)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [currentShowcase.kind]);

  useEffect(() => {
    if (currentShowcase.kind !== 'game') {
      setGameCursorVisible(false);
      setGameCursorTarget('timer');
      setGameInputValue('');
      setGameInputFocused(false);
      setGameTimerSeconds(115);
      setGameRunPressed(false);
      setGameResultVisible(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    setGameCursorVisible(true);
    setGameCursorTarget('timer');
    setGameInputValue('');
    setGameInputFocused(false);
    setGameTimerSeconds(115);
    setGameRunPressed(false);
    setGameResultVisible(false);

    for (let index = 0; index < 12; index += 1) {
      timers.push(
        setTimeout(() => {
          setGameTimerSeconds(114 - index);
        }, 1000 * (index + 1))
      );
    }

    timers.push(
      setTimeout(() => {
        setGameCursorTarget('input');
      }, 3000)
    );

    timers.push(
      setTimeout(() => {
        setGameInputFocused(true);
      }, 4400)
    );

    timers.push(
      setTimeout(() => {
        setGameInputValue('%');
      }, 4600)
    );

    timers.push(
      setTimeout(() => {
        setGameInputValue('%d');
      }, 4920)
    );

    timers.push(
      setTimeout(() => {
        setGameInputFocused(false);
        setGameCursorTarget('run');
      }, 5700)
    );

    timers.push(
      setTimeout(() => {
        setGameRunPressed(true);
      }, 7200)
    );

    timers.push(
      setTimeout(() => {
        setGameResultVisible(true);
      }, 7300)
    );

    timers.push(
      setTimeout(() => {
        setGameRunPressed(false);
      }, 7750)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [currentShowcase.kind]);

  if (loading || user || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ScaledLessonFrame baseWidth={1720}>
        <div className="relative h-screen">
          <section className="absolute right-[800px] top-[100px] flex w-[830px] justify-end">
            <div className="w-[830px] rounded bg-transparent p-8 text-center text-white backdrop-blur-[1px]">
              <h1 className="text-5xl font-bold leading-tight text-shadow-lg">Welcome to C-companion!</h1>
              <p className="mt-2 text-xl text-shadow-lg">
                Learn C with interactive lessons,<br />practice fun challenges,track your progress,<br />and compete on
                the leaderboards!
              </p>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="inline-flex w-auto rounded-full bg-[linear-gradient(135deg,rgb(106,233,110),rgb(67,177,150))] px-4 py-2 text-xl text-white text-shadow-lg shadow-lg transition hover:brightness-[1.15]"
                >
                  Play-&gt;
                </button>
              </div>
            </div>
          </section>
          <section className="absolute bottom-[10px] left-[950px] flex w-[830px] justify-start opacity-85">
            <div className="h-[467px] w-[830px] overflow-hidden rounded bg-transparent">
              <div className={`pointer-events-none h-full select-none transition-opacity duration-500 ${showcaseVisible ? 'opacity-100' : 'opacity-0'}`}>
                {currentShowcase.kind === 'lesson' ? (
                  <div className="h-full overflow-hidden">
                    <div className="origin-top-left scale-[0.6]">
                      <div className="w-[1030px] max-w-none px-[50px] py-[50px] text-center text-white">
                        <div className="relative w-[1030px] max-w-none">
                          <h2 className="mb-8 text-center text-5xl font-bold text-shadow-lg">Lessons</h2>
                          <section className="lesson-panel w-full rounded-2xl p-8 shadow-lg backdrop-blur-[1px]">
                            <div className="space-y-3 text-left">
                              <p className="text-xl leading-relaxed">
                                <>
                                  To print a value or a message to the output screen,
                                  <br />
                                  you can use the <Tone color="red">print()</Tone> function.
                                </>
                              </p>

                              <div className="flex items-start justify-between gap-8">
                                <div className="w-[410px] shrink-0 space-y-0">
                                  <LessonChip text="Input" />
                                  <div className="relative">
                                    <CodeEditor code={page1CodeA} lineStart={1} />
                                    <RunButton
                                      onClick={page1Input1}
                                      className={`absolute bottom-2 right-3 transition duration-150 ${
                                        previewRunPressed ? 'scale-[0.94] brightness-90' : ''
                                      }`}
                                    />
                                  </div>
                                </div>

                                <div className="w-[410px] shrink-0 space-y-0">
                                  <LessonChip text="output" />
                                  <OutputPanel lines={lessonOutput1} minHeightClass="min-h-[178px]" />
                                </div>
                              </div>

                              <p className="text-xl leading-relaxed">
                                <>
                                  When working with text, it must be wrapped inside
                                  <br />
                                  double quoatation marks <Tone color="red">""</Tone>.
                                </>
                              </p>

                              <div className="w-[410px] shrink-0">
                                <div className="space-y-0">
                                  <LessonChip text="Input" />
                                  <div className="relative">
                                    <CodeEditor code={page1CodeB} lineStart={3} />
                                    <RunButton onClick={page1Input2} className="absolute bottom-2 right-3" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                          <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div
                              className={`absolute transition-[transform,opacity] duration-[1600ms] ease-in-out ${
                                previewCursorVisible ? 'opacity-100' : 'opacity-0'
                              }`}
                              style={{
                                transform: previewCursorAtRun
                                  ? 'translate(400px, 370px)'
                                  : 'translate(650px, 500px)',
                              }}
                            >
                              <Image
                                src={cursorPng}
                                alt=""
                                aria-hidden="true"
                                className="h-8 w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-hidden">
                    <div className="origin-top-left translate-x-[-60px] -translate-y-[10px] scale-[0.78]">
                      <div className="w-[1030px] max-w-none px-[50px] py-[50px] text-center text-white">
                        <h2 className="mb-5 text-4xl font-bold text-center text-shadow-lg">Challenges</h2>
                        <section className="lesson-panel relative mx-auto w-[800px] rounded-2xl p-5 shadow-lg backdrop-blur-[1px]">
                          <p className="mb-4 w-full text-left text-[17px] leading-tight">
                            {renderCodeFixerPromptText(CODE_FIXER_ROUND_8_PROMPT)}
                          </p>
                          <div className="mx-auto flex w-full items-start justify-start gap-[36px]">
                            <div className="w-[500px] shrink-0">
                              <div className="w-full text-left">
                                <LessonChip text="Input" />
                                <div className="relative">
                                  <CodeEditor
                                    code={codeFixerRound8RenderedCodeLines}
                                    lineStart={1}
                                    activeLineIndex={999}
                                  />
                                  <button
                                    type="button"
                                    className={`absolute bottom-2 right-3 rounded-sm bg-[#8fd949] px-3 py-0.5 text-xl leading-none text-white transition duration-150 ${
                                      gameRunPressed ? 'scale-[0.94] brightness-90' : ''
                                    }`}
                                  >
                                    Run
                                  </button>
                                </div>
                              </div>
                              <div className="mt-4 w-full text-left">
                                <LessonChip text="output" />
                                <div className="relative">
                                  <OutputPanel lines={['5']} minHeightClass="min-h-[170px]" />
                                  {gameResultVisible ? (
                                    <div className="pointer-events-none absolute bottom-3 right-3 text-[20px] leading-none text-[#34d356]">
                                      Correct!
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="flex w-[220px] shrink-0 self-stretch translate-y-2 flex-col justify-end pb-2">
                              <div className="mb-3 rounded-sm bg-black/30 py-2 text-center shadow-lg">
                                <div className="font-mono text-[56px] leading-none text-white">
                                  {formatCodeFixerTimer(gameTimerSeconds)}
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  className="h-[58px] w-[104px] rounded-sm bg-[#df7d3f] text-[36px] leading-none text-white"
                                >
                                  Quit
                                </button>
                                <button
                                  type="button"
                                  className="h-[58px] w-[104px] rounded-sm bg-[#8fd949] text-[36px] leading-none text-white"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div
                              className={`absolute transition-[transform,opacity] duration-[1400ms] ease-in-out ${
                                gameCursorVisible ? 'opacity-100' : 'opacity-0'
                              }`}
                              style={{
                                transform:
                                  gameCursorTarget === 'run'
                                    ? 'translate(490px, 210px)'
                                    : gameCursorTarget === 'input'
                                    ? 'translate(160px, 155px)'
                                    : 'translate(662px, 256px)',
                              }}
                            >
                              <Image
                                src={cursorPng}
                                alt=""
                                aria-hidden="true"
                                className="h-8 w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </ScaledLessonFrame>
    </div>
  );
};

export default LandingPage;
