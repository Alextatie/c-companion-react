'use client';

import { ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';

type ScaledLessonFrameProps = {
  baseWidth: number;
  title?: ReactNode;
  titleClassName?: string;
  children: ReactNode;
};

function ScaledLessonFrame({
  baseWidth,
  title,
  titleClassName = 'mb-8 text-5xl font-bold text-shadow-lg text-center',
  children,
}: ScaledLessonFrameProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (!wrapperRef.current || !contentRef.current) {
      return;
    }

    const availableWidth = wrapperRef.current.clientWidth;
    const availableHeight = wrapperRef.current.clientHeight;
    const measuredHeight = contentRef.current.offsetHeight;
    const widthScale = availableWidth / baseWidth;
    const heightScale = measuredHeight > 0 ? availableHeight / measuredHeight : 1;
    const nextScale = Math.min(1, Math.max(0.4, Math.min(widthScale, heightScale)));
    setScale(nextScale);
  }, [baseWidth]);

  useLayoutEffect(() => {
    updateScale();
    const animationFrame = window.requestAnimationFrame(updateScale);
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    window.addEventListener('pageshow', updateScale);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
      window.removeEventListener('pageshow', updateScale);
    };
  }, [updateScale]);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current) {
      return;
    }

    const observer = new ResizeObserver(updateScale);

    observer.observe(wrapperRef.current);
    observer.observe(contentRef.current);
    updateScale();

    return () => observer.disconnect();
  }, [updateScale]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      <div
        ref={contentRef}
        className="absolute left-1/2 top-0 max-w-none"
        style={{
          width: `${baseWidth}px`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {title ? <h1 className={titleClassName}>{title}</h1> : null}
        {children}
      </div>
    </div>
  );
}

export default ScaledLessonFrame;
