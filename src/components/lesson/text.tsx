'use client';

import { ReactNode } from 'react';

export type LessonToneName = 'red' | 'green' | 'blue' | 'white' | 'dark' | 'yellow';

export const lessonToneClass: Record<LessonToneName, string> = {
  red: 'text-[#ff6565]',
  green: 'text-[#34d356]',
  blue: 'text-[#6d94ff]',
  white: 'text-white',
  dark: 'text-[#222222]',
  yellow: 'text-[#d3b93a]',
};

export function Tone({
  color,
  children,
}: {
  color: LessonToneName;
  children: ReactNode;
}) {
  return <span className={lessonToneClass[color]}>{children}</span>;
}

export function EmptyLine() {
  return <span>&nbsp;</span>;
}
