'use client';

import { ReactNode } from 'react';
import { lessonToneClass } from '@/components/lesson/text';

const C_CODE_KEYWORDS = new Set([
  'int',
  'float',
  'double',
  'char',
  'bool',
  'long',
  'short',
  'unsigned',
  'signed',
  'const',
  'void',
  'return',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'continue',
]);

export function renderHighlightedCodeLine(line: string, lineKey: string): ReactNode {
  return renderHighlightedCodeLineWithOptions(line, lineKey, { highlightQuestionMarks: true });
}

export function renderHighlightedCodeLineWithOptions(
  line: string,
  lineKey: string,
  options: {
    highlightQuestionMarks?: boolean;
    questionMarkClassName?: string;
    questionMarkStyle?: React.CSSProperties;
  } = {}
): ReactNode {
  const {
    highlightQuestionMarks = true,
    questionMarkClassName = lessonToneClass.yellow,
    questionMarkStyle,
  } = options;

  if (line.length === 0) {
    return <span className={lessonToneClass.dark}>{'\u00A0'}</span>;
  }

  const tokenRegex =
    /(\/\/.*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\?\?\?|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of line.matchAll(tokenRegex)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(
        <span key={`${lineKey}-plain-${tokenIndex}`} className={lessonToneClass.dark}>
          {line.slice(lastIndex, index)}
        </span>
      );
    }

    let className = lessonToneClass.dark;
    if (token === '???') {
      className = highlightQuestionMarks ? questionMarkClassName : questionMarkClassName;
    } else if (token.startsWith('//')) {
      className = lessonToneClass.green;
    } else if (token.startsWith('"') || token.startsWith("'")) {
      className = lessonToneClass.red;
    } else if (token === 'true' || token === 'false') {
      className = lessonToneClass.red;
    } else if (C_CODE_KEYWORDS.has(token)) {
      className = lessonToneClass.blue;
    } else if (/^\d/.test(token)) {
      className = lessonToneClass.red;
    }

    parts.push(
      <span
        key={`${lineKey}-tok-${tokenIndex}`}
        className={className}
        style={token === '???' ? questionMarkStyle : undefined}
      >
        {token}
      </span>
    );
    lastIndex = index + token.length;
    tokenIndex += 1;
  }

  if (lastIndex < line.length) {
    parts.push(
      <span key={`${lineKey}-tail`} className={lessonToneClass.dark}>
        {line.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? <>{parts}</> : <span className={lessonToneClass.dark}>{line}</span>;
}
