import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  delay?: number;
}

export function TextGenerateEffect({
  words,
  className,
  delay = 0,
}: TextGenerateEffectProps) {
  const [renderedText, setRenderedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      if (currentIndex < words.length) {
        timeoutRef.current = setTimeout(() => {
          setRenderedText((prev) => prev + words[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 50); // 打字速度
      }
    }, delay);

    return () => {
      clearTimeout(initialDelay);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, words, delay]);

  return (
    <div className={cn('font-bold text-white', className)}>
      {renderedText}
      {currentIndex < words.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
}
