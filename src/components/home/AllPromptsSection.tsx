'use client';

import React from 'react';
import { PromptListItem } from '@/types';
import PromptCard from '../cards/PromptCard';
import PromptCardSkeleton from '../skeletons/PromptCardSkeleton';

interface AllPromptsSectionProps {
  prompts: PromptListItem[];
  isLoading: boolean;
  onCopyCountUpdate: (id: number, count: number) => void;
}

const AllPromptsSection = ({
  prompts,
  isLoading,
  onCopyCountUpdate,
}: AllPromptsSectionProps) => {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-8">
      <h2 className="mb-4 text-heading-md text-gr-100">전체 프롬프트</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-4 gap-x-6 gap-y-8">
          {[...Array(16)].map((_, i) => (
            <PromptCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-x-6 gap-y-8">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onCopyCountUpdate={onCopyCountUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AllPromptsSection;
