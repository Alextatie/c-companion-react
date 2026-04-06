import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type LessonDefinition = {
  slug: string;
  field: string;
  difficulty: LessonDifficulty;
};

export const LESSON_DEFINITIONS: LessonDefinition[] = [
  { slug: 'basics', field: 'lesson_basics', difficulty: 'beginner' },
  { slug: 'output', field: 'lesson_output', difficulty: 'beginner' },
  { slug: 'comments', field: 'lesson_comments', difficulty: 'beginner' },
  { slug: 'variables', field: 'lesson_variables', difficulty: 'beginner' },
  { slug: 'booleans', field: 'lesson_booleans', difficulty: 'beginner' },
  { slug: 'operators', field: 'lesson_operators', difficulty: 'beginner' },
  { slug: 'if-else', field: 'lesson_if_else', difficulty: 'intermediate' },
  { slug: 'switch-case', field: 'lesson_switch_case', difficulty: 'intermediate' },
  { slug: 'loops', field: 'lesson_loops', difficulty: 'intermediate' },
  { slug: 'arrays', field: 'lesson_arrays', difficulty: 'intermediate' },
  { slug: 'user-input', field: 'lesson_user_input', difficulty: 'intermediate' },
  { slug: 'memory', field: 'lesson_memory', difficulty: 'intermediate' },
  { slug: 'functions', field: 'lesson_functions', difficulty: 'advanced' },
  { slug: 'recursion', field: 'lesson_recursion', difficulty: 'advanced' },
  { slug: 'structs', field: 'lesson_structs', difficulty: 'advanced' },
  { slug: 'enums', field: 'lesson_enums', difficulty: 'advanced' },
  { slug: 'files', field: 'lesson_files', difficulty: 'advanced' },
  { slug: 'memory-management', field: 'lesson_memory_management', difficulty: 'advanced' },
];

export const LESSON_DEFAULT_FIELDS: Record<string, boolean> = LESSON_DEFINITIONS.reduce(
  (acc, lesson) => {
    acc[lesson.field] = false;
    return acc;
  },
  {} as Record<string, boolean>
);

const LESSON_BY_SLUG = new Map(LESSON_DEFINITIONS.map((lesson) => [lesson.slug, lesson]));

export function lessonSlugFromPathname(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2 || parts[0] !== 'learn') {
    return null;
  }
  return parts[1] || null;
}

export async function ensureLessonDefaults(uid: string) {
  const statsRef = doc(db, 'stats', uid);
  await setDoc(
    statsRef,
    {
      ...LESSON_DEFAULT_FIELDS,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function markLessonCompleted(uid: string, lessonSlug: string) {
  const lesson = LESSON_BY_SLUG.get(lessonSlug);
  if (!lesson) {
    return;
  }

  const statsRef = doc(db, 'stats', uid);
  await setDoc(
    statsRef,
    {
      [lesson.field]: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
