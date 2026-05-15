'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PopularPromptsSection from '@/components/home/PopularPromptsSection';
import MainBanner from '@/components/home/MainBanner';
import AllPromptsSection from '@/components/home/AllPromptsSection';
import Pagination from '@/components/common/Pagination';
import { promptApi } from '@/lib/api';
import { PromptListItem } from '@/types';

function HomeContent() {
  const [popularPrompts, setPopularPrompts] = useState<PromptListItem[]>([]);
  const [allPrompts, setAllPrompts] = useState<PromptListItem[]>([]);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [isAllLoading, setIsAllLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentPage = Number(searchParams.get('page')) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  // 인기 프롬프트 (상위 12개, copyCount 기준)
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await promptApi.popular({ limit: 12 });
        setPopularPrompts(response);
      } catch (err) {
        console.error('Failed to fetch popular prompts:', err);
      } finally {
        setIsPopularLoading(false);
      }
    };
    fetchPopular();
  }, []);

  // 전체 프롬프트 (최신순, 페이징)
  useEffect(() => {
    const fetchAll = async () => {
      setIsAllLoading(true);
      setError(null);
      try {
        const response = await promptApi.list({ 
          sort: 'latest', 
          page: currentPage - 1, 
          size: pageSize 
        });
        setAllPrompts(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : '프롬프트를 불러오지 못했습니다.');
      } finally {
        setIsAllLoading(false);
      }
    };
    fetchAll();
  }, [currentPage]);

  const handleCopyCountUpdate = (id: number, count: number) => {
    setAllPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, copyCount: count } : p))
    );
    setPopularPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, copyCount: count } : p))
    );
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error && !isAllLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-body-500 text-gr-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <PopularPromptsSection prompts={popularPrompts} isLoading={isPopularLoading} />
      <MainBanner />
      <AllPromptsSection
        prompts={allPrompts}
        isLoading={isAllLoading}
        onCopyCountUpdate={handleCopyCountUpdate}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
