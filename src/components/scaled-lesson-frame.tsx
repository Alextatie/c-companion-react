'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type ScaledLessonFrameProps = {
  baseWidth: number;
  children: ReactNode;
};

function ScaledLessonFrame({ baseWidth, children }: ScaledLessonFrameProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const nextScale = Math.min(1, Math.max(0.55, (viewportWidth - 32) / baseWidth));
      setScale(nextScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseWidth]);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    });

    observer.observe(contentRef.current);
    setContentHeight(contentRef.current.offsetHeight);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full" style={{ height: contentHeight * scale }}>
      <div
        ref={contentRef}
        className="absolute left-1/2 top-0 max-w-none"
        style={{
          width: `${baseWidth}px`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ScaledLessonFrame;
