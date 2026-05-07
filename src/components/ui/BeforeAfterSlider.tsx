'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Move } from 'lucide-react';

interface Props {
  beforeImageUrl: string;
  afterImageUrl: string;
  initialPosition?: number;
  className?: string;
}

export const BeforeAfterSlider: React.FC<Props> = ({
  beforeImageUrl,
  afterImageUrl,
  initialPosition = 50,
  className = '',
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPosition = (x / rect.width) * 100;
      const clamped = Math.max(0, Math.min(100, newPosition));
      setPosition(clamped);
    },
    []
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square w-full overflow-hidden select-none ${className} ${
        isDragging ? 'cursor-ew-resize' : ''
      }`}
    >
      {/* After Image (Background) */}
      <img
        src={afterImageUrl}
        alt="After"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImageUrl}
          alt="Before"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute left-3 top-3 rounded bg-bg-100/70 px-2 py-1 text-[10px] font-mono text-gray-100 backdrop-blur-sm">
        BEFORE
      </div>
      <div className="absolute right-3 top-3 rounded bg-bg-100/70 px-2 py-1 text-[10px] font-mono text-gray-100 backdrop-blur-sm">
        AFTER
      </div>

      {/* Handle */}
      <div
        className="absolute bottom-0 top-0 z-10 w-[2px] bg-primary-100 shadow-[0_0_10px_rgba(76,255,145,0.5)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-primary-100 shadow-lg active:scale-110 transition-transform"
        >
          <Move className="h-4 w-4 text-bg-100" />
        </div>
      </div>
    </div>
  );
};
