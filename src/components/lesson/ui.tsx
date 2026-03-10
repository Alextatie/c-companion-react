'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

const lessonChipVisualClassName =
  'flex w-fit items-center justify-center rounded-sm bg-white/30 px-2 py-[2px] text-[16px] leading-none text-[#e3efe6] text-center';

const noLigaturesStyle = { fontVariantLigatures: 'none' as const };

export function HomeButton({ topClass = '-top-[4.7rem]' }: { topClass?: string }) {
  return (
    <Link
      href="/"
      className={`no-select absolute ${topClass} left-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8fd89a] shadow-lg transition hover:bg-[rgb(214,232,220)]`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M10 21v-6h4v6" />
      </svg>
      <span className="sr-only">Home</span>
    </Link>
  );
}

export function LessonChip({ text }: { text: string }) {
  return <div className={`no-select ${lessonChipVisualClassName}`}>{text}</div>;
}

export function CodeEditor({
  code,
  lineStart = 1,
  rightSlot,
  activeLineIndex = 3,
  inputBefore,
  inputAfter,
  gutterClassName = 'py-1',
  contentClassName = 'px-1 py-1',
}: {
  code: ReactNode[];
  lineStart?: number;
  rightSlot?: ReactNode;
  activeLineIndex?: number;
  inputBefore?: ReactNode;
  inputAfter?: ReactNode;
  gutterClassName?: string;
  contentClassName?: string;
}) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-300 bg-[#3c4455] shadow-lg">
      <div className="grid grid-cols-[20px_1fr]">
        <div className={`select-none bg-[#3c4455] text-[17px] leading-7 text-[#c2c7d1] ${gutterClassName}`}>
          {code.map((_, index) => (
            <div key={`ln-${index}`} className="text-center font-mono">
              {lineStart + index}
            </div>
          ))}
        </div>
        <div
          className={`overflow-x-auto bg-white font-mono text-[17px] leading-7 text-slate-900 ${contentClassName}`}
          style={noLigaturesStyle}
        >
          {code.map((line, index) => (
            <div key={`code-${index}`} className="whitespace-pre flex items-center">
              {index === activeLineIndex && rightSlot ? (
                <span className="flex items-center">
                  {inputBefore ?? null}
                  <span>{rightSlot}</span>
                  {inputAfter ?? null}
                </span>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OutputPanel({ lines, minHeightClass }: { lines: ReactNode[]; minHeightClass: string }) {
  return (
    <div className="output-select w-full rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg">
      <div className={`px-3 py-1 font-mono text-[17px] leading-7 ${minHeightClass}`} style={noLigaturesStyle}>
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LessonTable({
  columnsClassName,
  headers,
  rows,
  className = '',
  headerClassName = '',
  cellClassName = '',
  accentColumns = [],
}: {
  columnsClassName: string;
  headers: ReactNode[];
  rows: ReactNode[][];
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  accentColumns?: number[];
}) {
  return (
    <div className={`space-y-px ${className}`}>
      <div className={`grid ${columnsClassName} gap-px bg-transparent font-semibold ${headerClassName}`}>
        {headers.map((header, index) => (
          <div key={`header-${index}`} className="flex items-stretch">
            <div className={`${lessonChipVisualClassName} w-full`}>
              {header}
            </div>
          </div>
        ))}
      </div>
      <div
        className="overflow-hidden rounded-sm border border-white/20 bg-white/70 text-[13px] leading-tight text-[#5c5c5c]"
        style={noLigaturesStyle}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid ${columnsClassName} ${
              rowIndex % 2 === 0 ? 'bg-[#e0e0e0]' : 'bg-[#ebebeb]'
            } ${cellClassName}`}
          >
            {row.map((cell, cellIndex) => (
              <div
                key={`cell-${rowIndex}-${cellIndex}`}
                className={`px-2 py-1 ${accentColumns.includes(cellIndex) ? 'text-[#ff6565]' : ''}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RunButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm bg-[#8fd949] px-3 py-0.5 text-xl leading-none text-white ${className}`}
    >
      Run
    </button>
  );
}

export function ChoiceButton({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[21px] w-full items-center justify-center rounded-[1px] border border-[#3a9cab] bg-[#48ced7] px-2 text-[18px] leading-none text-[#e9ffff] shadow-sm transition hover:bg-[#57dae2] ${className}`}
    >
      {children}
    </button>
  );
}

export function ChoiceButtonGroup({
  options,
  className = '',
  buttonClassName = '',
}: {
  options: Array<{ label: ReactNode; onClick: () => void }>;
  className?: string;
  buttonClassName?: string;
}) {
  return (
    <div className={`w-[85px] shrink-0 space-y-1 pt-4 ${className}`}>
      {options.map((option, index) => (
        <ChoiceButton key={index} onClick={option.onClick} className={buttonClassName}>
          {option.label}
        </ChoiceButton>
      ))}
    </div>
  );
}

export function LessonBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center rounded bg-white px-3 py-2 text-lg text-[#5d9d87] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)]"
    >
      <span>{'<-'}</span>
      <span className="ml-1">Back</span>
    </button>
  );
}

export function LessonNextButton({
  onClick,
  isLastPage,
}: {
  onClick: () => void;
  isLastPage: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center rounded bg-white py-2 text-lg text-[#3d7f80] text-shadow-lg shadow-lg transition hover:bg-[rgb(214,232,220)] ${
        isLastPage ? 'px-2.5' : 'px-3'
      }`}
    >
      <span>{isLastPage ? 'Finish Lesson' : 'Next'}</span>
      {!isLastPage && <span className="ml-1">{'->'}</span>}
    </button>
  );
}

export function HintButton({
  widthClass,
  children,
}: {
  widthClass: string;
  children: ReactNode;
}) {
  return (
    <div className="no-select relative group">
      <div
        className={`pointer-events-none absolute bottom-full right-0 mb-[1.45rem] rounded-sm bg-[#e7e7e7] px-3 py-2 text-left text-[16px] leading-tight text-[#5b5b5b] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ${widthClass}`}
      >
        <div className="underline decoration-1 underline-offset-2">Solution:</div>
        <div>{children}</div>
      </div>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded bg-[#d3b93a] text-[32px] leading-none text-[#e4f9d9]">
        ?
      </div>
    </div>
  );
}
