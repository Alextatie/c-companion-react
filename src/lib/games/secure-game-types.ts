export type SecureGameId = 'code_fixer' | 'time_attack';
export type SecureDifficulty = 'easy' | 'medium' | 'hard';
export type SessionEndReason = 'completed' | 'quit' | 'timeout';

export type CodeFixerQuestionClient = {
  number: number;
  prompt: string;
  code: string;
  expectedOutput: string;
};

export type TimeAttackQuestionClient = {
  number: number;
  prompt: string;
  code: string;
  options: string[];
  expectedOutput: string;
  outputReveal: 'start' | 'after_choice';
};

export type StartSessionResponse =
  | {
      game: 'code_fixer';
      sessionId: string;
      roundSeconds: number;
      questions: CodeFixerQuestionClient[];
    }
  | {
      game: 'time_attack';
      sessionId: string;
      roundSeconds: number;
      questions: TimeAttackQuestionClient[];
    };
