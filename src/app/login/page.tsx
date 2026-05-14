'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';

export default function LoginPage() {
  const router = useRouter();
  const { openLoginModal } = useUIStore();

  useEffect(() => {
    router.replace('/');
    // 작은 지연 후 모달 오픈
    setTimeout(() => {
      openLoginModal();
    }, 100);
  }, [router, openLoginModal]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
