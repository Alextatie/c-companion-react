export const CODE_FIXER_QUESTION_LIMIT = 10;
export const CODE_FIXER_ROUND_SECONDS = 120;
export const CODE_FIXER_WARNING_SECONDS = 20;
export const CODE_FIXER_DANGER_SECONDS = 10;

export const CODE_FIXER_DIFFICULTY_MAX = {
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

export function getCodeFixerStars(correctCount: number): number {
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

export function formatCodeFixerTimer(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function getCodeFixerTimerColorClass(seconds: number): string {
  if (seconds <= CODE_FIXER_DANGER_SECONDS) {
    return 'text-[#ff6b6b]';
  }
  if (seconds <= CODE_FIXER_WARNING_SECONDS) {
    return 'text-[#f0db5a]';
  }
  return 'text-white';
}

export type CodeFixerRule = {
  type: string;
  description?: string;
  field?: string;
  accepted?: string[];
  allOf?: Array<{ field: string; accepted: string[] }>;
  prefix?: string;
  min?: number;
  max?: number;
  primary?: { field: string; accepted: string[] };
  secondaryMustBeEmpty?: string;
};

export type CodeFixerInputValues = Record<string, string>;

function getFieldValue(field: string, values: CodeFixerInputValues): string {
  return (values[field] || '').trim();
}

function isEmptyValue(value: string): boolean {
  return value.trim().length === 0;
}

export function validateCodeFixerInput(
  validator: CodeFixerRule | undefined,
  values: CodeFixerInputValues
): boolean {
  if (!validator) {
    return false;
  }

  if (validator.type === 'exact_any') {
    const value = getFieldValue(validator.field || 'input_a', values);
    const accepted = validator.accepted || [];
    return accepted.includes(value);
  }

  if (validator.type === 'comment_input') {
    const value = getFieldValue(validator.field || 'input_a', values);
    const trimmed = value.trimStart();
    return trimmed.startsWith('//') || (trimmed.startsWith('/*') && value.endsWith('*/'));
  }

  if (validator.type === 'truthy_or_quoted') {
    const value = getFieldValue(validator.field || 'input_a', values);
    if (value === 'true') {
      return true;
    }
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed !== 0) {
      return true;
    }
    return (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    );
  }

  if (validator.type === 'two_field_pair' || validator.type === 'three_field_exact') {
    const conditions = validator.allOf || [];
    return conditions.every((condition) =>
      condition.accepted.includes(getFieldValue(condition.field, values))
    );
  }

  if (validator.type === 'prefix_int_range') {
    const value = getFieldValue(validator.field || 'input_a', values);
    const prefix = validator.prefix || '';
    if (!value.startsWith(prefix)) {
      return false;
    }
    const numberPart = value.slice(prefix.length);
    const parsed = Number.parseInt(numberPart, 10);
    if (Number.isNaN(parsed)) {
      return false;
    }
    return (
      parsed >= (validator.min ?? Number.MIN_SAFE_INTEGER) &&
      parsed <= (validator.max ?? Number.MAX_SAFE_INTEGER)
    );
  }

  if (validator.type === 'exact_any_plus_empty') {
    const primary = validator.primary;
    if (!primary) {
      return false;
    }
    const primaryValue = getFieldValue(primary.field, values);
    const primaryOk = primary.accepted.includes(primaryValue);
    const secondaryField = validator.secondaryMustBeEmpty || 'input_b';
    const secondaryOk = isEmptyValue(getFieldValue(secondaryField, values));
    return primaryOk && secondaryOk;
  }

  return false;
}

export function isCodeFixerOutputCorrect(
  expectedOutput: string | undefined,
  outputDraft: string
): boolean {
  const expected = (expectedOutput || '').trim();
  const actual = outputDraft.trim();
  return expected.length > 0 && actual === expected;
}

function getLongestAcceptedValue(values: string[] | undefined): string | null {
  if (!values || values.length === 0) {
    return null;
  }

  return values.reduce((longest, current) =>
    current.length > longest.length ? current : longest
  );
}

export function getCodeFixerExpectedAnswerSample(
  validator: CodeFixerRule | undefined,
  expectedOutput?: string,
  field = 'input_a'
): string | null {
  const trimmedOutput = (expectedOutput || '').trim();
  if (trimmedOutput.length > 0) {
    return trimmedOutput;
  }

  if (!validator) {
    return null;
  }

  if (validator.type === 'exact_any') {
    const validatorField = validator.field || 'input_a';
    return validatorField === field ? getLongestAcceptedValue(validator.accepted) : null;
  }

  if (validator.type === 'exact_any_plus_empty') {
    return validator.primary?.field === field ? getLongestAcceptedValue(validator.primary.accepted) : null;
  }

  if (validator.type === 'two_field_pair' || validator.type === 'three_field_exact') {
    const condition = (validator.allOf || []).find((candidate) => candidate.field === field);
    return getLongestAcceptedValue(condition?.accepted);
  }

  return null;
}

export function getCodeFixerInputWidthPx({
  validator,
  expectedOutput,
  inline,
  field = 'input_a',
}: {
  validator?: CodeFixerRule;
  expectedOutput?: string;
  inline: boolean;
  field?: string;
}): number {
  const fallbackWidth = inline ? 92 : 280;

  const sample = getCodeFixerExpectedAnswerSample(validator, expectedOutput, field);

  if (!sample) {
    return fallbackWidth;
  }

  const perCharacterWidth = 10;
  const horizontalPadding = inline ? 20 : 28;
  const minWidth = inline ? 24 : 120;
  const maxWidth = inline ? 220 : 320;
  const measuredWidth = sample.length * perCharacterWidth + horizontalPadding;

  return Math.max(minWidth, Math.min(maxWidth, measuredWidth));
}
