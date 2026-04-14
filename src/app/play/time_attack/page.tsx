'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';
import timeAttackLevelsData from '@/data/game-time-attack-levels.json';
import { ChoiceButton, CodeEditor, HomeButton, LessonBackButton, LessonChip, OutputPanel } from '@/components/lesson/ui';
import { renderHighlightedCodeLineWithOptions } from '@/components/lesson/code-highlighting';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  TIME_ATTACK_DIFFICULTY_MAX,
  TIME_ATTACK_QUESTION_LIMIT,
  getTimeAttackCorrectAnswer,
  isTimeAttackSelectionCorrect,
  TIME_ATTACK_ROUND_SECONDS,
  formatTimeAttackTimer,
  getTimeAttackStars,
  getTimeAttackTimerColorClass,
  pickRandomQuestionNumbers,
} from '@/lib/games/time-attack-logic';
import { auth, db } from '@/app/firebase/config';
import { submitGameStats } from '@/lib/leaderboards';
import { ADVANCED_LESSON_FIELDS, BEGINNER_LESSON_FIELDS, INTERMEDIATE_LESSON_FIELDS } from '@/lib/lesson-progress';

type Difficulty = 'easy' | 'medium' | 'hard' | 'debug';
type Phase = 'menu' | 'difficulty' | 'round' | 'result';
const DEBUG_UI_ENABLED =
  process.env.NEXT_PUBLIC_DEBUG_UI === 'true'
  || (process.env.NEXT_PUBLIC_DEBUG_UI == null && process.env.NODE_ENV !== 'production');

type ParsedQuestion = {
  number: number;
  prompt: string;
  code: string;
  options: string[];
  answer?: number;
  expectedOutput: string;
  outputReveal?: 'start' | 'after_choice';
};

function renderPromptText(prompt: string) {
  const highlightedParts = [
    'output',
    'function',
    'data type',
    'printf()',
    'scanf()',
    'condition',
    'loop',
    'bool',
    'strcat',
    'strcpy',
    'recursion',
    'HARD',
    'edit',
    'print()',
  ];
  const parts = prompt.split(/(output|function|data type|printf\(\)|scanf\(\)|condition|loop|bool|strcat|strcpy|recursion|HARD|edit|print\(\))/g);
  return parts.map((part, index) =>
    highlightedParts.includes(part) ? (
      <span key={`prompt-${index}`} className="text-[#ff6565]">
        {part}
      </span>
    ) : (
      <span key={`prompt-${index}`}>{part}</span>
    )
  );
}

function renderOutputLine(line: string, key: string) {
  if (line.trim().toLowerCase() === 'error') {
    return (
      <span key={key} className="text-[#ff6565]">
        {line}
      </span>
    );
  }
  return line;
}

function TimeAttackPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [canStartFromLessons, setCanStartFromLessons] = useState(false);
  const [mediumUnlocked, setMediumUnlocked] = useState(false);
  const [hardUnlocked, setHardUnlocked] = useState(false);
  const [phase, setPhase] = useState<Phase>('menu');
  const [roundQuestions, setRoundQuestions] = useState<ParsedQuestion[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealedOutput, setRevealedOutput] = useState('');
  const [answerResultText, setAnswerResultText] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(TIME_ATTACK_ROUND_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [quitConfirming, setQuitConfirming] = useState(false);
  const [revealedStars, setRevealedStars] = useState(0);
  const [roundSessionId, setRoundSessionId] = useState(0);
  const [submittedSessionId, setSubmittedSessionId] = useState<number | null>(null);
  const [bestTimeEligible, setBestTimeEligible] = useState(false);
  const [roundStartedAtMs, setRoundStartedAtMs] = useState<number | null>(null);
  const [roundFinishedAtMs, setRoundFinishedAtMs] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.isAnonymous) {
      setCanStartFromLessons(true);
      setMediumUnlocked(false);
      setHardUnlocked(false);
      return;
    }

    let cancelled = false;
    getDoc(doc(db, 'stats', user.uid))
      .then((snap) => {
        if (cancelled || !snap.exists()) {
          setCanStartFromLessons(false);
          setMediumUnlocked(false);
          setHardUnlocked(false);
          return;
        }
        const data = snap.data() as Record<string, unknown>;
        const completedBeginner = BEGINNER_LESSON_FIELDS.every((field) => data[field] === true);
        const completedIntermediate = INTERMEDIATE_LESSON_FIELDS.every((field) => data[field] === true);
        const completedAdvanced = ADVANCED_LESSON_FIELDS.every((field) => data[field] === true);
        setCanStartFromLessons(completedBeginner);
        setMediumUnlocked(completedIntermediate);
        setHardUnlocked(completedAdvanced);
      })
      .catch(() => {
        if (!cancelled) {
          setCanStartFromLessons(false);
          setMediumUnlocked(false);
          setHardUnlocked(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const questionsByNumber = useMemo(() => {
    const source = timeAttackLevelsData as { levels: ParsedQuestion[] };
    const map = new Map<number, ParsedQuestion>();
    source.levels.forEach((question) => {
      map.set(question.number, question);
    });
    return map;
  }, []);
  const isGuestUser = !user || user.isAnonymous;

  const currentQuestion = roundQuestions[roundIndex];
  const debugMode = DEBUG_UI_ENABLED && phase === 'round' && currentDifficulty === 'debug';
  const timeoutLocked = !debugMode && timedOut;
  const attemptLocked = selectedOption !== null;

  const getInitialOutputForQuestion = (question?: ParsedQuestion | null) => {
    if (!question) {
      return '';
    }
    return question.outputReveal === 'start' ? question.expectedOutput || '' : '';
  };

  const startRound = (difficulty: Difficulty) => {
    const questionNumbers =
      difficulty === 'debug'
        ? Array.from({ length: 70 }, (_, index) => index + 1)
        : pickRandomQuestionNumbers(
            TIME_ATTACK_DIFFICULTY_MAX[difficulty as Exclude<Difficulty, 'debug'>],
            TIME_ATTACK_QUESTION_LIMIT
          );

    const picked = questionNumbers
      .map((number) => questionsByNumber.get(number))
      .filter((question): question is ParsedQuestion => Boolean(question));

    setRoundQuestions(picked);
    setRoundIndex(0);
    setCorrectCount(0);
    setCompletedCount(0);
    setSelectedOption(null);
    setRevealedOutput(getInitialOutputForQuestion(picked[0]));
    setAnswerResultText('');
    setCurrentDifficulty(difficulty);
    setTimerSeconds(TIME_ATTACK_ROUND_SECONDS);
    setTimedOut(false);
    setSelectorOpen(false);
    setQuitConfirming(false);
    setBestTimeEligible(false);
    setRoundFinishedAtMs(null);
    setRoundStartedAtMs(Date.now());
    setSubmittedSessionId(null);
    setRoundSessionId((prev) => prev + 1);
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

  useEffect(() => {
    if (phase !== 'round') {
      return;
    }
    if (!currentQuestion) {
      return;
    }
    if (selectedOption !== null) {
      return;
    }
    setRevealedOutput(getInitialOutputForQuestion(currentQuestion));
  }, [phase, currentQuestion, selectedOption]);

  const stars = getTimeAttackStars(correctCount);
  const isGamePhase = phase === 'round';
  const isResultPhase = phase === 'result';
  const frameBaseWidth = isGamePhase ? 1040 : isResultPhase ? 760 : 640;

  useEffect(() => {
    if (phase !== 'result') {
      setRevealedStars(0);
      return;
    }

    setRevealedStars(0);

    if (stars <= 0) {
      return;
    }

    let revealed = 0;
    let intervalId: number | null = null;

    const startTimeout = window.setTimeout(() => {
      revealed = 1;
      setRevealedStars(1);

      if (stars <= 1) {
        return;
      }

      intervalId = window.setInterval(() => {
        revealed += 1;
        setRevealedStars(revealed);

        if (revealed >= stars && intervalId !== null) {
          window.clearInterval(intervalId);
        }
      }, 500);
    }, 2000);

    return () => {
      window.clearTimeout(startTimeout);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [phase, stars]);

  const submitAndContinue = () => {
    if (!debugMode && timedOut) {
      setBestTimeEligible(false);
      setPhase('result');
      return;
    }

    const answered = selectedOption !== null;
    if (answered) {
      const isCorrect = answerResultText === 'Correct!';
      const nextCorrect = correctCount + (isCorrect ? 1 : 0);
      setCorrectCount(nextCorrect);
      setCompletedCount((prev) => prev + 1);
    }
    setSelectedOption(null);
    const nextQuestion = roundQuestions[roundIndex + 1];
    setRevealedOutput(getInitialOutputForQuestion(nextQuestion));
    setAnswerResultText('');
    setQuitConfirming(false);

    if (debugMode && roundIndex >= roundQuestions.length - 1) {
      return;
    }

    if (!debugMode && roundIndex >= roundQuestions.length - 1) {
      setBestTimeEligible(true);
      setRoundFinishedAtMs(Date.now());
      setPhase('result');
      return;
    }

    setRoundIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (phase !== 'result' || debugMode || !user || user.isAnonymous) {
      return;
    }
    if (submittedSessionId === roundSessionId) {
      return;
    }

    const elapsedMs =
      roundStartedAtMs !== null
        ? Math.max(0, (roundFinishedAtMs ?? Date.now()) - roundStartedAtMs)
        : Math.max(0, (TIME_ATTACK_ROUND_SECONDS - timerSeconds) * 1000);

    submitGameStats({
      uid: user.uid,
      game: 'time_attack',
      starsEarned: stars,
      completionTimeMs: bestTimeEligible && stars === 3 ? elapsedMs : null,
    })
      .catch((error) => {
        console.error('Failed to submit Quiz Rush stats', error);
      })
      .finally(() => {
        setSubmittedSessionId(roundSessionId);
      });
  }, [
    phase,
    debugMode,
    user,
    submittedSessionId,
    roundSessionId,
    timerSeconds,
    stars,
    bestTimeEligible,
    roundStartedAtMs,
    roundFinishedAtMs,
  ]);

  return (
    <div
      className={`relative h-screen overflow-hidden pb-[40px] pt-[24px] text-white ${
        isGamePhase || isResultPhase ? 'px-[50px]' : 'px-[12px]'
      }`}
    >
      <ScaledLessonFrame baseWidth={frameBaseWidth}>
        <div className="relative mx-auto text-center" style={{ width: `${frameBaseWidth}px` }}>
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
                              setSelectedOption(null);
                              setRevealedOutput('');
                              setAnswerResultText('');
                              setQuitConfirming(false);
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
                <p className="mb-4 w-full text-left text-[17px] leading-tight">{renderPromptText(currentQuestion.prompt)}</p>
                <div className="mx-auto flex w-full items-start justify-start gap-[36px] text-left">
                  <div className="w-[500px] shrink-0">
                    <div className="w-full">
                      <LessonChip text="Input" />
                        <CodeEditor
                            code={
                              currentQuestion.code
                              ? currentQuestion.code.split('\n').map((line, idx) =>
                                  renderHighlightedCodeLineWithOptions(line, `ta-${currentQuestion.number}-${idx}`, {
                                    highlightQuestionMarks: false,
                                    questionMarkClassName: '',
                                    questionMarkStyle: { color: '#c2c2c2' },
                                  })
                                )
                              : ['(question data loaded)']
                            }
                        lineStart={1}
                        activeLineIndex={0}
                      />
                    </div>
                    <div className="mt-4 w-full">
                      <LessonChip text="output" />
                      <div className="relative">
                        <OutputPanel
                          lines={
                            revealedOutput
                              ? revealedOutput
                                  .split('\n')
                                  .map((line, index) => renderOutputLine(line, `ta-output-${index}`))
                              : ['']
                          }
                          minHeightClass="min-h-[170px]"
                        />
                        {answerResultText ? (
                          <div
                            className={`pointer-events-none absolute bottom-2 right-3 text-[20px] leading-none ${
                              answerResultText === 'Correct!' ? 'text-[#34d356]' : 'text-[#ff6565]'
                            }`}
                          >
                            {answerResultText}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-[220px] shrink-0 self-stretch translate-y-2 flex-col justify-end pb-2">
                    <div className={`mb-3 flex flex-col gap-1 ${timeoutLocked ? 'pointer-events-none' : ''}`}>
                      {(currentQuestion.options.length > 0 ? currentQuestion.options : ['Option 1', 'Option 2', 'Option 3', 'Option 4']).map((option) => (
                        <ChoiceButton
                          key={option}
                          onClick={() => {
                            if (attemptLocked) {
                              return;
                            }
                            if (!currentQuestion) {
                              return;
                            }

                            setSelectedOption(option);
                            const localCorrect = isTimeAttackSelectionCorrect(option, currentQuestion.options, currentQuestion.answer);
                            const localReveal = (currentQuestion.expectedOutput || '').trim()
                              || getTimeAttackCorrectAnswer(currentQuestion.options, currentQuestion.answer);
                            setRevealedOutput(localReveal);
                            setAnswerResultText(localCorrect ? 'Correct!' : 'Wrong!');
                          }}
                          disabled={attemptLocked}
                          className={`h-[40px] !rounded-sm !border-[#94c8aa] !bg-[#69ac8a] !px-2 !text-[18px] !leading-none !text-white !whitespace-nowrap overflow-hidden text-ellipsis hover:!bg-[#94c8aa] ${
                            selectedOption === option ? '!bg-[#94c8aa]' : ''
                          }`}
                        >
                          {option}
                        </ChoiceButton>
                      ))}
                    </div>
                    <div className="mb-3 rounded-sm bg-black/30 py-2 text-center shadow-lg">
                      <div className={`font-mono text-[56px] leading-none ${getTimeAttackTimerColorClass(timerSeconds)}`}>
                        {debugMode ? formatTimeAttackTimer(TIME_ATTACK_ROUND_SECONDS) : formatTimeAttackTimer(timerSeconds)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (quitConfirming) {
                            setBestTimeEligible(false);
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
            <div className="mx-auto flex w-full flex-col items-center">
              <h1 className="mb-3 mt-20 text-5xl font-bold text-shadow-lg">Game Finished!</h1>
              <p className="mx-auto text-center text-4xl leading-tight">
                You answered <span className="text-[#ffae5a]">{correctCount}</span> out of {completedCount}
                <br>
                </br>questions correctly!
              </p>
              <div className="mx-auto mt-1 inline-flex items-center justify-center gap-3 text-[100px] leading-none">
                <span className={revealedStars >= 1 ? '' : 'text-black/40'} style={revealedStars >= 1 ? { color: '#f0c64a' } : undefined}>{'\u2605'}</span>
                <span className={revealedStars >= 2 ? '' : 'text-black/40'} style={revealedStars >= 2 ? { color: '#f0c64a' } : undefined}>{'\u2605'}</span>
                <span className={revealedStars >= 3 ? '' : 'text-black/40'} style={revealedStars >= 3 ? { color: '#f0c64a' } : undefined}>{'\u2605'}</span>
              </div>
              <div className="mx-auto mt-5 flex w-[255px] flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPhase('difficulty')}
                  className="h-16 rounded-sm bg-[#8fd949] text-4xl text-white transition hover:bg-[#9eeb54]"
                >
                  Play again
                </button>
                <div className="mx-auto">
                  <LessonBackButton onClick={() => router.push('/play')} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mb-1 mt-[2.7rem] text-[58px] font-bold text-shadow-lg">Quiz Rush</h1>

              <section
                className="lesson-panel mx-auto rounded-2xl shadow-lg backdrop-blur-[1px]"
                style={{ width: '600px', height: '260px' }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center text-center">
                  <p className="text-[24px] leading-tight">
                    You have <span className="text-[#ff6565]">90 seconds</span> to answer as many
                    <br />
                    <span className="text-[#ff6565]">multiple choice</span> questions as you can.
                  </p>

                  <p className="mt-2 leading-none font-semibold" style={{ fontSize: '34px' }}>
                    {phase === 'menu' ? 'Ready?' : 'Difficulty:'}
                  </p>

                  <div className="mx-auto mt-3">
                    {phase === 'menu' ? (
                      <div className="group relative inline-flex">
                        <button
                          type="button"
                          onClick={() => {
                            if (!canStartFromLessons) {
                              return;
                            }
                            setPhase('difficulty');
                          }}
                          disabled={!canStartFromLessons}
                          className={`w-full rounded-sm leading-none text-white text-shadow-lg shadow-lg transition ${
                            canStartFromLessons ? '' : 'cursor-default opacity-25'
                          }`}
                          style={{
                            backgroundColor: 'rgb(86,116,145)',
                            height: '80px',
                            width: '160px',
                            fontSize: '54px',
                          }}
                          onMouseEnter={(event) => {
                            if (!canStartFromLessons) {
                              return;
                            }
                            event.currentTarget.style.backgroundColor = 'rgb(68,96,123)';
                          }}
                          onMouseLeave={(event) => {
                            if (!canStartFromLessons) {
                              return;
                            }
                            event.currentTarget.style.backgroundColor = 'rgb(86,116,145)';
                          }}
                        >
                          Play
                        </button>
                        {!canStartFromLessons ? (
                          <div className="pointer-events-none absolute left-full top-1/2 ml-3 w-[180px] -translate-y-1/2 px-2 py-1 text-center text-sm leading-tight text-white !opacity-100 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)] invisible group-hover:visible" style={{ opacity: 1 }}>
                            <span className="opacity-100 text-white">Complete all </span><span className="opacity-100 text-[#8fd949]">beginner</span><span className="opacity-100 text-white"> lessons to unlock</span>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mx-auto flex w-[300px] items-center justify-between">
                        <button
                          type="button"
                          onClick={() => startRound('easy')}
                          aria-label="Easy"
                          className="rounded-full bg-[#8fd949] transition hover:bg-[#9eeb54]"
                          style={{ height: '80px', width: '80px' }}
                        />
                        <div className="group relative inline-flex">
                          <button
                            type="button"
                            onClick={() => startRound('medium')}
                            aria-label="Medium"
                            disabled={!mediumUnlocked}
                            className={`rounded-full transition ${mediumUnlocked ? 'bg-[#d3b93a] hover:bg-[#e1c74a]' : 'cursor-default bg-[#d3b93a] opacity-25'}`}
                            style={{ height: '80px', width: '80px' }}
                          />
                          {!mediumUnlocked ? (
                            <div className="pointer-events-none absolute left-full top-1/2 ml-3 w-[190px] -translate-y-1/2 px-2 py-1 text-center text-sm leading-tight text-white font-semibold rounded-md bg-black/10 invisible group-hover:visible" style={{ opacity: 1 }}>
                              {isGuestUser ? (
                                <span className="opacity-100 text-white">Login to unlock</span>
                              ) : (
                                <>
                                  <span className="opacity-110 text-white">Complete all </span><span className="opacity-100 text-[#d3b93a]">intermediate</span><span className="opacity-110 text-white"> lessons to unlock</span>
                                </>
                              )}
                            </div>
                          ) : null}
                        </div>
                        <div className="group relative inline-flex">
                          <button
                            type="button"
                            onClick={() => startRound('hard')}
                            aria-label="Hard"
                            disabled={!hardUnlocked}
                            className={`rounded-full transition ${hardUnlocked ? 'bg-[#d85b5b] hover:bg-[#e56d6d]' : 'cursor-default bg-[#d85b5b] opacity-25'}`}
                            style={{ height: '80px', width: '80px' }}
                          />
                          {!hardUnlocked ? (
                            <div className="pointer-events-none absolute left-full top-1/2 ml-3 w-[180px] -translate-y-1/2 px-2 py-1 text-center text-sm leading-tight text-white font-semibold rounded-md bg-black/10 invisible group-hover:visible" style={{ opacity: 1 }}>
                              {isGuestUser ? (
                                <span className="opacity-100 text-white">Login to unlock</span>
                              ) : (
                                <>
                                  <span className="opacity-100 text-white">Complete all </span><span className="opacity-100 text-[#d85b5b]">advanced</span><span className="opacity-100 text-white"> lessons to unlock</span>
                                </>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="relative mx-auto mt-6 w-[220px]">
                <Link
                  href="/play"
                  className="mx-auto inline-flex items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
                >
                  <span>{'<-'}</span>
                  <span className="ml-1">Back</span>
                </Link>
                {DEBUG_UI_ENABLED ? (
                  <button
                    type="button"
                    onClick={() => startRound('debug')}
                    aria-label="Start debug mode"
                    className="absolute inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(86,116,145)] text-[24px] leading-none text-white shadow-[0_2px_6px_rgba(0,0,0,0.55)] transition hover:bg-[rgb(68,96,123)]"
                    style={{ left: '167px', top: '3px' }}
                  >
                    O
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </ScaledLessonFrame>
    </div>
  );
}

export default TimeAttackPage;
