export const TIME_ATTACK_QUESTION_LIMIT = 10;
export const TIME_ATTACK_ROUND_SECONDS = 90;
export const TIME_ATTACK_WARNING_SECONDS = 20;
export const TIME_ATTACK_DANGER_SECONDS = 10;

export const TIME_ATTACK_DIFFICULTY_MAX = {
  easy: 30,
  medium: 50,
  hard: 70,
} as const;

export function pickRandomQuestionNumbers(maxNumber: number, count: number): number[] {
  const pool = Array.from({ length: maxNumber }, (_, index) => index + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function getTimeAttackStars(correctCount: number): number {
  if (correctCount >= 9) {
    return 3;
  }
  if (correctCount >= 7) {
    return 2;
  }
  if (correctCount >= 4) {
    return 1;
  }
  return 0;
}

export function formatTimeAttackTimer(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function getTimeAttackTimerColorClass(seconds: number): string {
  if (seconds <= TIME_ATTACK_DANGER_SECONDS) {
    return 'text-[#ff6b6b]';
  }
  if (seconds <= TIME_ATTACK_WARNING_SECONDS) {
    return 'text-[#f0db5a]';
  }
  return 'text-white';
}

export function getTimeAttackCorrectAnswer(
  options: string[] | undefined,
  answer: number | undefined
): string {
  if (!options || options.length === 0 || !answer) {
    return '';
  }
  const answerIndex = answer - 1;
  if (answerIndex < 0 || answerIndex >= options.length) {
    return '';
  }
  return options[answerIndex] || '';
}

export function isTimeAttackSelectionCorrect(
  selectedOption: string | null,
  options: string[] | undefined,
  answer: number | undefined
): boolean {
  if (!selectedOption) {
    return false;
  }
  const correctAnswer = getTimeAttackCorrectAnswer(options, answer);
  return selectedOption.trim() === correctAnswer.trim();
}
