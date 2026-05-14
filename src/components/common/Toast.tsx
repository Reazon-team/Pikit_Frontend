'use client';

import React from 'react';
import { useToastStore } from '@/stores/toastStore';

const Toast = () => {
  const { message, type, hide } = useToastStore();

  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 animate-bounce">
      <div
        className={`rounded-full px-6 py-3 text-body-500 text-white shadow-lg ${
          type === 'success' ? 'bg-gr-100' : 'bg-danger'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
