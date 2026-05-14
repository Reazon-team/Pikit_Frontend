'use client';

import React from 'react';
import { PromptListItem } from '@/types';
import PopularPromptCard from '../cards/PopularPromptCard';
import PopularPromptCardSkeleton from '../skeletons/PopularPromptCardSkeleton';

interface PopularPromptsSectionProps {
  prompts: PromptListItem[];
  isLoading: boolean;
}

const PopularPromptsSection = ({
  prompts,
  isLoading,
}: PopularPromptsSectionProps) => {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-8">
      <h2 className="mb-4 text-heading-md text-gr-100">인기 프롬프트</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <PopularPromptCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          {prompts.slice(0, 6).map((prompt) => (
            <PopularPromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularPromptsSection;
