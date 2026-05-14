'use client';

import React from 'react';
import { Bookmark, Copy } from 'lucide-react';
import { PromptListItem } from '@/types';
import Link from 'next/link';

interface PopularPromptCardProps {
  prompt: PromptListItem;
}

const PopularPromptCard = ({ prompt }: PopularPromptCardProps) => {
  return (
    <Link href={`/prompts/${prompt.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-bg-200">
        <img
          src={prompt.afterImageUrl}
          alt={prompt.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Bookmark Icon on image */}
        <div className="absolute bottom-2 right-2 text-white drop-shadow-md">
          <Bookmark size={20} fill={prompt.isBookmarked ? 'white' : 'none'} />
        </div>
      </div>
      <div className="mt-2 space-y-1 px-1">
        <h3 className="truncate text-body-500 text-gr-100">{prompt.title}</h3>
        <div className="flex items-center gap-3 text-caption text-gr-300">
          <span className="flex items-center gap-1">
            <Copy size={12} /> {prompt.copyCount}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={12} fill={prompt.isBookmarked ? 'currentColor' : 'none'} /> {prompt.bookmarkCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PopularPromptCard;
