import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = '#ffaa40',
  colorTo = '#ff4081',
  delay = 0,
}: BorderBeamProps) {
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const beam = beamRef.current;
    if (!beam) return;

    // 使用 CSS 动画
    beam.style.setProperty('--beam-size', `${size}px`);
    beam.style.setProperty('--beam-duration', `${duration}s`);
    beam.style.setProperty('--beam-width', `${borderWidth}px`);
    beam.style.setProperty('--beam-color-from', colorFrom);
    beam.style.setProperty('--beam-color-to', colorTo);
  }, [size, duration, borderWidth, colorFrom, colorTo]);

  return (
    <div
      ref={beamRef}
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent',
        '[--beam-size:200px] [--beam-duration:15s] [--beam-width:1.5px] [--beam-color-from:#ffaa40] [--beam-color-to:#ff4081]',
        "after:content-[''] after:absolute after:rounded-[inherit] after:[background:linear-gradient(90deg,transparent,var(--beam-color-from),var(--beam-color-to),transparent)] after:[background-size:var(--beam-size)_100%] after:[animation:beam_var(--beam-duration)_infinite_linear] after:[offset-path:rect(0%_100%_100%_0%)] after:animate-border-beam",
        'before:content-[""] before:absolute before:rounded-[inherit] before:[background:linear-gradient(90deg,transparent,var(--beam-color-from),var(--beam-color-to),transparent)] before:[background-size:var(--beam-size)_100%] before:[animation:beam_var(--beam-duration)_infinite_linear] before:[animation-delay:calc(var(--beam-duration)/-2)] before:animate-border-beam',
        className
      )}
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
}
