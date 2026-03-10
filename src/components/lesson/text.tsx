'use client';

import { ReactNode } from 'react';

const toneClass: Record<'red' | 'green' | 'blue' | 'white' | 'dark', string> = {
  red: 'text-[#ff6565]',
  green: 'text-[#34d356]',
  blue: 'text-[#6d94ff]',
  white: 'text-white',
  dark: 'text-[#222222]',
};

export function Tone({
  color,
  children,
}: {
  color: 'red' | 'green' | 'blue' | 'white' | 'dark';
  children: ReactNode;
}) {
  return <span className={toneClass[color]}>{children}</span>;
}

export function EmptyLine() {
  return <span>&nbsp;</span>;
}
