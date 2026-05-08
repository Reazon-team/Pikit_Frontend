'use client';

import React, { useState, useMemo } from 'react';
import { PromptCard } from '@/components/ui/PromptCard';
import { getMockPrompts } from '@/lib/mock-data';

type Category = 'all' | 'new' | 'hot' | 'qa';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const allPrompts = useMemo(() => getMockPrompts(), []);

  const filteredPrompts = useMemo(() => {
    if (activeCategory === 'all') return allPrompts;
    if (activeCategory === 'qa') return []; // Q&A currently empty
    return allPrompts.filter((p) => p.category === activeCategory);
  }, [activeCategory, allPrompts]);

  return (
    <main className="container mx-auto max-w-[1400px] px-4 py-8">
      {/* Nav Area */}
      <nav className="mb-8 flex items-center gap-8 border-b border-line-100 pb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={`font-mono text-sm transition-colors ${
            activeCategory === 'all' ? 'text-primary-100' : 'text-gray-400 hover:text-gray-100'
          }`}
        >
          {`// all`}
        </button>
        <button
          onClick={() => setActiveCategory('new')}
          className={`font-mono text-sm transition-colors ${
            activeCategory === 'new' ? 'text-primary-100' : 'text-gray-400 hover:text-gray-100'
          }`}
        >
          {`// new`}
        </button>
        <button
          onClick={() => setActiveCategory('hot')}
          className={`font-mono text-sm transition-colors ${
            activeCategory === 'hot' ? 'text-primary-100' : 'text-gray-400 hover:text-gray-100'
          }`}
        >
          {`// hot`}
        </button>
        <button
          onClick={() => setActiveCategory('qa')}
          className={`font-mono text-sm transition-colors ${
            activeCategory === 'qa' ? 'text-primary-100' : 'text-gray-400 hover:text-gray-100'
          }`}
        >
          {`// Q&A`}
        </button>
      </nav>

      {/* Status Area */}
      <div className="mb-8 flex items-center gap-2 border-y border-line-100 py-3 font-mono text-xs text-gray-300">
        <span className="text-primary-100">●</span>
        <span>{filteredPrompts.length} prompts loaded</span>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
        {activeCategory === 'qa' && (
          <div className="col-span-full py-20 text-center font-mono text-gray-400">
            No Q&A items found.
          </div>
        )}
      </div>
    </main>
  );
}
