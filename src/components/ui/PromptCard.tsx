'use client';

import React, { useState } from 'react';
import { Prompt } from '@/types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Button } from './Button';
import { Clipboard, Check } from 'lucide-react';

interface Props {
  prompt: Prompt;
}

export const PromptCard: React.FC<Props> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt.promptText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (copyErr) {
        console.error('Failed to copy text: ', copyErr);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="group overflow-hidden rounded-md border border-line-100 bg-bg-200 transition-colors hover:border-line-200">
      <BeforeAfterSlider
        beforeImageUrl={prompt.beforeImageUrl}
        afterImageUrl={prompt.afterImageUrl}
      />
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-100 line-clamp-1">{prompt.title}</h3>
          <p className="text-sm text-gray-300 line-clamp-1">{prompt.description}</p>
        </div>

        <div className="relative mb-4 rounded border border-line-100 bg-bg-100 p-3">
          <pre className="font-mono text-xs text-primary-100 line-clamp-4 h-[72px] overflow-hidden">
            {prompt.promptText}
          </pre>
          <div className="absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-bg-100 to-transparent" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-300">
            <Clipboard className="h-3.5 w-3.5" />
            <span>{prompt.copyCount.toLocaleString()}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 font-mono text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>copied</span>
              </>
            ) : (
              <>
                <Clipboard className="h-3.5 w-3.5" />
                <span>copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
