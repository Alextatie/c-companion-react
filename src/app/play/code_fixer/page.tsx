'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import codeFixerQuestionData from '@/data/unity-code-fixer-questions.json';
import { CodeEditor, HomeButton, LessonBackButton, LessonChip, OutputPanel, RunButton } from '@/components/lesson/ui';
import { useRouter } from 'next/navigation';

type Difficulty = 'easy' | 'medium' | 'hard' | 'debug';
type Phase = 'menu' | 'difficulty' | 'round' | 'result';

type ImportedQuestion = {
  questionNumber: number;
  texts: Array<{ objectName: string; text: string }>;
};

type ParsedQuestion = {
  number: number;
  prompt: string;
  code: string;
};

const QUESTION_LIMIT = 10;
const ROUND_SECONDS = 120;
const WARNING_SECONDS = 20;
const DANGER_SECONDS = 10;

const DIFFICULTY_MAX: Record<Exclude<Difficulty, 'debug'>, number> = {
  easy: 30,
  medium: 50,
  hard: 70,
};

function stripUnityTags(value: string): string {
  return value
    .replace(/<color=[^>]*>/gi, '')
    .replace(/<\/color>/gi, '')
    .replace(/<size=[^>]*>/gi, '')
    .replace(/<\/size>/gi, '')
    .replace(/\u200b/gi, '')
    .replace(/\r/g, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function parsePrompt(question: ImportedQuestion): string {
  const preferred = question.texts.find((entry) => {
    const value = stripUnityTags(entry.text).toLowerCase();
    if (entry.objectName !== 'Text') {
      return false;
    }
    return value.includes('?') || value.includes('fix') || value.includes('fill');
  });
  if (preferred) {
    return stripUnityTags(preferred.text);
  }
  const fallback = question.texts.find((entry) => entry.objectName === 'Text');
  return fallback ? stripUnityTags(fallback.text) : `Question ${question.questionNumber}`;
}

function parseCode(question: ImportedQuestion): string {
  const codeLine = question.texts.find((entry) => {
    const text = stripUnityTags(entry.text);
    return text.includes('main()') || text.includes('printf') || text.includes(';');
  });
  return codeLine ? stripUnityTags(codeLine.text) : '';
}

function pickRandomQuestionNumbers(maxNumber: number, count: number): number[] {
  const pool = Array.from({ length: maxNumber }, (_, index) => index + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function getStars(correctCount: number): number {
  if (correctCount >= 9) {
    return 3;
  }
  if (correctCount >= 7) {
    return 2;
  }
  if (correctCount >= 5) {
    return 1;
  }
  return 0;
}

function formatTimer(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function timerColorClass(seconds: number): string {
  if (seconds <= DANGER_SECONDS) {
    return 'text-[#ff6b6b]';
  }
  if (seconds <= WARNING_SECONDS) {
    return 'text-[#f0db5a]';
  }
  return 'text-white';
}

function CodeFixerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('menu');
  const [roundQuestions, setRoundQuestions] = useState<ParsedQuestion[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [answerDraft, setAnswerDraft] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(ROUND_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [quitConfirming, setQuitConfirming] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [ranLevel, setRanLevel] = useState(false);

  const questionsByNumber = useMemo(() => {
    const source = codeFixerQuestionData as { questions: ImportedQuestion[] };
    const map = new Map<number, ParsedQuestion>();
    source.questions.forEach((question) => {
      map.set(question.questionNumber, {
        number: question.questionNumber,
        prompt: parsePrompt(question),
        code: parseCode(question),
      });
    });
    return map;
  }, []);

  const currentQuestion = roundQuestions[roundIndex];
  const debugMode = phase === 'round' && currentDifficulty === 'debug';
  const timeoutLocked = !debugMode && timedOut;

  const startRound = (difficulty: Difficulty) => {
    const questionNumbers =
      difficulty === 'debug'
        ? Array.from({ length: 70 }, (_, index) => index + 1)
        : pickRandomQuestionNumbers(DIFFICULTY_MAX[difficulty], QUESTION_LIMIT);

    const picked = questionNumbers
      .map((number) => questionsByNumber.get(number))
      .filter((question): question is ParsedQuestion => Boolean(question));

    setRoundQuestions(picked);
    setRoundIndex(0);
    setCorrectCount(0);
    setCompletedCount(0);
    setAnswerDraft('');
    setCurrentDifficulty(difficulty);
    setTimerSeconds(ROUND_SECONDS);
    setTimedOut(false);
    setSelectorOpen(false);
    setQuitConfirming(false);
    setOutputText('');
    setRanLevel(false);
    setPhase('round');
  };

  useEffect(() => {
    if (phase !== 'round' || debugMode || timedOut) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimerSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [phase, debugMode, timedOut]);

  useEffect(() => {
    if (phase === 'round' && !debugMode && timerSeconds === 0) {
      setTimedOut(true);
    }
  }, [phase, debugMode, timerSeconds]);

  const submitAndContinue = () => {
    if (!debugMode && timedOut) {
      setPhase('result');
      return;
    }

    const answered = ranLevel && answerDraft.trim().length > 0;
    const nextCorrect = correctCount + (answered ? 1 : 0);
    setCorrectCount(nextCorrect);
    setCompletedCount((prev) => prev + 1);
    setAnswerDraft('');
    setQuitConfirming(false);
    setOutputText('');
    setRanLevel(false);

    if (debugMode && roundIndex >= roundQuestions.length - 1) {
      return;
    }

    if (!debugMode && roundIndex >= roundQuestions.length - 1) {
      setPhase('result');
      return;
    }

    setRoundIndex((prev) => prev + 1);
  };

  const runCurrentLevel = () => {
    setRanLevel(true);
    if (answerDraft.trim().length === 0) {
      setOutputText('Error!');
      return;
    }
    setOutputText(answerDraft.trim());
  };

  const stars = getStars(correctCount);

  return (
    <div className="h-screen overflow-hidden px-[50px] pb-[40px] pt-[24px] text-white">
      <ScaledLessonFrame baseWidth={1040}>
        <div className="relative mx-auto w-[1040px] text-center">
          {phase === 'round' && currentQuestion ? (
            <>
              <div className={timeoutLocked ? 'pointer-events-none' : ''}>
                <HomeButton topClass="top-[6px]" leftClass="left-32" />
              </div>
              {debugMode ? (
                <div className="absolute left-44 top-[6px] z-30">
                  <button
                    type="button"
                    onClick={() => setSelectorOpen((prev) => !prev)}
                    className="inline-flex h-10 w-[110px] items-center justify-center rounded bg-white px-3 text-lg leading-none text-[#5d9d87] shadow-lg transition-colors hover:bg-[rgb(214,232,220)] focus:outline-none"
                  >
                    Selector
                  </button>
                  {selectorOpen ? (
                    <div className="absolute left-0 top-full mt-2 h-[360px] w-[260px] overflow-y-auto rounded-sm border border-white/30 bg-black/70 p-2 text-left">
                      <div className="grid grid-cols-5 gap-1">
                        {roundQuestions.map((question, index) => (
                          <button
                            key={question.number}
                            type="button"
                            onClick={() => {
                              setRoundIndex(index);
                              setAnswerDraft('');
                              setQuitConfirming(false);
                              setOutputText('');
                              setRanLevel(false);
                              setSelectorOpen(false);
                            }}
                            className={`h-9 rounded-sm text-sm text-white transition ${
                              index === roundIndex ? 'bg-[#8fd949]' : 'bg-[rgb(86,116,145)] hover:bg-[rgb(68,96,123)]'
                            }`}
                          >
                            {question.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <h1 className="mb-[17px] text-5xl font-bold text-shadow-lg">Round {roundIndex + 1}</h1>
              <section className="lesson-panel mx-auto w-[800px] rounded-2xl p-5 shadow-lg backdrop-blur-[1px]">
                <div className="mx-auto flex w-full items-start justify-start gap-[36px]">
                  <div className={`w-[500px] shrink-0 ${timeoutLocked ? 'pointer-events-none' : ''}`}>
                    <p className="mx-auto mb-4 max-w-[820px] text-[17px] leading-tight">{currentQuestion.prompt}</p>
                    <div className="w-full text-left">
                      <LessonChip text="Input" />
                      <div className="relative">
                        <CodeEditor
                          code={[...(currentQuestion.code ? currentQuestion.code.split('\n') : ['(question data loaded)']), '']}
                          lineStart={1}
                          activeLineIndex={currentQuestion.code ? currentQuestion.code.split('\n').length : 1}
                          rightSlot={
                            <input
                              type="text"
                              value={answerDraft}
                              onChange={(event) => setAnswerDraft(event.target.value)}
                              placeholder="Type your fix..."
                              className="h-8 w-[280px] rounded border border-slate-400 bg-white px-1.5 text-[17px] text-slate-900 outline-none"
                            />
                          }
                        />
                        <RunButton onClick={runCurrentLevel} className="absolute bottom-2 right-3" />
                      </div>
                    </div>
                    <div className="mt-4 w-full text-left">
                      <LessonChip text="output" />
                      <OutputPanel lines={[outputText]} minHeightClass="min-h-[170px]" />
                    </div>
                  </div>
                  <div className="flex w-[220px] shrink-0 self-stretch translate-y-2 flex-col justify-end pb-2">
                    <div className="mb-3 rounded-sm bg-black/30 py-2 text-center shadow-lg">
                      <div className={`font-mono text-[56px] leading-none ${timerColorClass(timerSeconds)}`}>
                        {debugMode ? formatTimer(ROUND_SECONDS) : formatTimer(timerSeconds)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (quitConfirming) {
                            setPhase('result');
                            return;
                          }
                          setQuitConfirming(true);
                        }}
                      disabled={timeoutLocked}
                      className={`h-[58px] w-[104px] rounded-sm leading-none text-white transition ${
                        quitConfirming
                          ? 'bg-[#d85b5b] text-[24px] hover:bg-[#e56d6d]'
                          : 'bg-[#df7d3f] text-[36px] hover:bg-[#eb8c50]'
                      } ${timeoutLocked ? 'pointer-events-none opacity-60' : ''}`}
                      >
                        {quitConfirming ? 'Confirm' : 'Quit'}
                      </button>
                      <button
                        type="button"
                        onClick={submitAndContinue}
                        className={`h-[58px] w-[104px] rounded-sm bg-[#8fd949] leading-none text-white transition hover:bg-[#9eeb54] ${
                          !debugMode && (timedOut || roundIndex === roundQuestions.length - 1) ? 'text-[24px]' : 'text-[36px]'
                        }`}
                      >
                        {!debugMode && (timedOut || roundIndex === roundQuestions.length - 1) ? 'Finish' : 'Next'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : phase === 'result' ? (
            <>
              <HomeButton topClass="top-0" />
              <h1 className="mb-3 mt-10 text-7xl font-bold text-shadow-lg">Game Finished!</h1>
              <p className="text-5xl leading-tight">
                You answered <span className="text-[#ffae5a]">{correctCount}</span> out of {completedCount} questions correctly!
              </p>
              <div className="mt-6 text-[100px] leading-none tracking-[0.25em]">
                <span className={stars >= 1 ? 'text-[#e9f7a1]' : 'text-black/40'}>{'\u2605'}</span>
                <span className={stars >= 2 ? 'text-[#e9f7a1]' : 'text-black/40'}>{'\u2605'}</span>
                <span className={stars >= 3 ? 'text-[#e9f7a1]' : 'text-black/40'}>{'\u2605'}</span>
              </div>
              <div className="mx-auto mt-4 flex w-[420px] flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPhase('difficulty')}
                  className="h-16 rounded-sm bg-[#8fd949] text-5xl text-white transition hover:bg-[#9eeb54]"
                >
                  Play again
                </button>
                <div className="mx-auto">
                  <LessonBackButton onClick={() => router.push('/play')} />
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-5 mt-[2.7rem] text-7xl font-bold text-shadow-lg">Code Fixer</h1>

              <p className="mt-3 text-[41px] leading-tight">
                You have <span className="text-[#ff6565]">2 minutes</span> to fix as many
                <br />
                <span className="text-[#ff6565]">code segments</span> as you can.
              </p>

              <p className="mt-2 text-[58px] leading-none font-semibold">Ready?</p>

              <div className="mx-auto mt-3 w-[245px]">
                {phase === 'menu' ? (
                  <button
                    type="button"
                    onClick={() => setPhase('difficulty')}
                    className="h-[95px] w-full rounded-sm bg-[rgb(143,217,73)] text-[71px] leading-none text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(158,235,84)]"
                  >
                    Play
                  </button>
                ) : (
                  <div className="space-y-[2px]">
                    <button
                      type="button"
                      onClick={() => startRound('easy')}
                      className="h-[58px] w-full rounded-none bg-[#8fd949] text-[56px] leading-none text-white transition hover:bg-[#9eeb54]"
                    >
                      Easy
                    </button>
                    <button
                      type="button"
                      onClick={() => startRound('medium')}
                      className="h-[58px] w-full rounded-none bg-[#d3b93a] text-[56px] leading-none text-white transition hover:bg-[#e1c74a]"
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => startRound('hard')}
                      className="h-[58px] w-full rounded-none bg-[#d85b5b] text-[56px] leading-none text-white transition hover:bg-[#e56d6d]"
                    >
                      Hard
                    </button>
                    <button
                      type="button"
                      onClick={() => startRound('debug')}
                      className="h-[58px] w-full rounded-none bg-[rgb(86,116,145)] text-[52px] leading-none text-white transition hover:bg-[rgb(68,96,123)]"
                    >
                      Debug
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/play"
                className="mt-6 inline-flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
              >
                <span>{'<-'}</span>
                <span className="ml-1">Back</span>
              </Link>
            </>
          )}
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default CodeFixerPage;
