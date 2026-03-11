import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface SparklesProps {
  className?: string;
  children?: React.ReactNode;
}

export function Sparkles({ className, children }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawSparkles = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const sparkles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      opacity: Math.random(),
      speed: Math.random() * 0.02 + 0.01,
    }));

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      sparkles.forEach((sparkle) => {
        sparkle.opacity += sparkle.speed;
        if (sparkle.opacity > 1 || sparkle.opacity < 0) {
          sparkle.speed *= -1;
        }

        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(sparkle.opacity)})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const cleanup = drawSparkles(canvas);

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup?.();
    };
  }, [drawSparkles]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      {children}
    </div>
  );
}
