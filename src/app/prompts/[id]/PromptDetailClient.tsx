'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Copy, Bookmark } from 'lucide-react';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { promptApi } from '@/lib/api';
import { PromptDetail } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useToastStore } from '@/stores/toastStore';
import PromptDetailSkeleton from '@/components/skeletons/PromptDetailSkeleton';
import Link from 'next/link';

export default function PromptDetailClient() {
  const params = useParams();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useUIStore();
  const showToast = useToastStore((state) => state.show);

  useEffect(() => {
    if (!id || id === 'placeholder') return;

    const fetchDetail = async () => {
      try {
        const data = await promptApi.detail(Number(id));
        setPrompt(data);
        setIsBookmarked(data.isBookmarked);
      } catch (err) {
        console.error('Failed to fetch prompt detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleCopy = async () => {
    if (!prompt) return;
    const textToCopy = prompt.promptText || prompt.description || '';
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('프롬프트가 복사되었습니다!');
      const result = await promptApi.incrementCopy(prompt.id);
      setPrompt((prev) => prev ? { ...prev, copyCount: result.copyCount } : null);
    } catch (err) {
      showToast('복사에 실패했습니다.', 'error');
    }
  };

  const handleBookmark = async () => {
    if (!prompt) return;
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    try {
      const result = await promptApi.toggleBookmark(prompt.id);
      setIsBookmarked(result.bookmarked ?? false);
      setPrompt((prev) => prev ? { ...prev, bookmarkCount: result.count } : null);
      showToast(result.bookmarked ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.');
    } catch (err) {
      showToast('북마크 처리에 실패했습니다.', 'error');
    }
  };

  if (id === 'placeholder') {
    return null;
  }

  if (isLoading) {
    return <PromptDetailSkeleton />;
  }

  if (!prompt) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
        <p className="text-heading-md text-gr-200 mb-4">
          프롬프트를 찾을 수 없습니다
        </p>
        <Link href="/" className="text-primary underline text-body-500">
          메인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      {/* Top Info Area */}
      <div className="mb-6">
        <h1 className="text-heading-xl text-gr-100 mb-2">{prompt.title}</h1>
        <div className="flex items-center gap-3 text-caption text-gr-300">
          <span className="flex items-center gap-1">
            <Copy size={14} /> {prompt.copyCount}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} className={isBookmarked ? "text-primary" : ""} /> {prompt.bookmarkCount}
          </span>
        </div>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Prompt Text Area */}
        <div className="bg-bg-200 rounded-2xl p-6 border border-line-100">
          {/* Action Area */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleCopy}
              className="flex-1 bg-primary text-white py-3 rounded-lg text-body-500 flex items-center justify-center gap-2 hover:opacity-90 transition shadow-sm"
            >
              <Copy size={18} />
              프롬프트 복사
            </button>
            <button
              onClick={handleBookmark}
              className="p-3 bg-bg-100 border border-line-100 rounded-lg hover:border-gr-300 transition"
              aria-label="북마크"
            >
              <Bookmark size={18} className={isBookmarked ? "fill-primary text-primary" : "text-gr-200"} />
            </button>
          </div>

          {/* Prompt Label */}
          <p className="text-caption-lg-500 text-gr-100 mb-3">프롬프트</p>

          {/* Prompt Text */}
          <div className="text-body-400 text-gr-100 whitespace-pre-wrap leading-relaxed">
            {prompt.promptText || prompt.description}
          </div>
        </div>

        {/* Right: Before/After Slider Area */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-line-100 shadow-sm bg-bg-200">
            <BeforeAfterSlider
              beforeImageUrl={prompt.beforeImageUrl}
              afterImageUrl={prompt.afterImageUrl}
              className="aspect-square"
            />
          </div>
          <p className="text-caption-lg-400 text-gr-300 text-center mt-3">
            드래그해서 변환 결과 비교
          </p>
        </div>
      </div>
    </div>
  );
}
