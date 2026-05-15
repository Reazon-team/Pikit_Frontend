'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PromptCard from '@/components/cards/PromptCard';
import PromptCardSkeleton from '@/components/skeletons/PromptCardSkeleton';
import type { PromptListItem } from '@/types';

interface PopularPromptsSectionProps {
  prompts: PromptListItem[];
  isLoading: boolean;
}

const VISIBLE_COUNT = 4;
const AUTO_SLIDE_INTERVAL = 5000; // 5초

export default function PopularPromptsSection({
  prompts,
  isLoading,
}: PopularPromptsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 총 페이지 수 (4개씩 묶음)
  const totalPages = Math.ceil(prompts.length / VISIBLE_COUNT);

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused || totalPages <= 1 || isLoading) return;

    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalPages, isLoading]);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  if (!isLoading && prompts.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8 pb-4">
      <h2 className="mb-4 text-heading-md text-gr-100">인기 프롬프트</h2>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* 카드 그리드 */}
        {isLoading ? (
          <div className="grid grid-cols-4 gap-6">
            {[...Array(VISIBLE_COUNT)].map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const pagePrompts = prompts.slice(
                  pageIndex * VISIBLE_COUNT,
                  pageIndex * VISIBLE_COUNT + VISIBLE_COUNT
                );
                
                return (
                  <div
                    key={pageIndex}
                    className="grid w-full flex-shrink-0 grid-cols-4 gap-6"
                  >
                    {pagePrompts.map((prompt) => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                    
                    {/* 카드 개수가 4개 미만일 때 빈 공간 채우기 */}
                    {pagePrompts.length < VISIBLE_COUNT &&
                      Array.from({ length: VISIBLE_COUNT - pagePrompts.length }).map((_, i) => (
                        <div key={`empty-${pageIndex}-${i}`} className="invisible" />
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 좌측 화살표 — hover 시에만 표시 */}
        {!isLoading && totalPages > 1 && (
          <button
            onClick={handlePrev}
            className={`absolute left-0 top-[31%] z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-100 bg-bg-100 shadow-lg transition-all duration-300 hover:shadow-xl ${
              isPaused ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-label="이전 페이지"
          >
            <ChevronLeft size={20} className="text-gr-100" />
          </button>
        )}

        {/* 우측 화살표 — hover 시에만 표시 */}
        {!isLoading && totalPages > 1 && (
          <button
            onClick={handleNext}
            className={`absolute right-0 top-[31%] z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-100 bg-bg-100 shadow-lg transition-all duration-300 hover:shadow-xl ${
              isPaused ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-label="다음 페이지"
          >
            <ChevronRight size={20} className="text-gr-100" />
          </button>
        )}

        {/* 페이지 인디케이터 (점) */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-gr-400 hover:bg-gr-300'
                }`}
                aria-label={`${index + 1}페이지로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
