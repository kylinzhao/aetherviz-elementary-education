import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MovingBorder({
  children,
  duration = 2000,
  className,
  style,
}: MovingBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const border = borderRef.current;
    if (!border) return;

    border.style.setProperty('--border-duration', `${duration}ms`);
  }, [duration]);

  return (
    <div
      ref={borderRef}
      className={cn(
        'relative overflow-hidden rounded-lg',
        'before:absolute before:inset-0 before:rounded-[inherit]',
        "before:[background:conic-gradient(from_0deg,transparent_0_340deg,white_360deg)]",
        'before:[animation:rotate_var(--border-duration)_linear_infinite]',
        'before:animate-rotate',
        className
      )}
      style={style}
    >
      <div className="relative h-full w-full rounded-[inherit] bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
