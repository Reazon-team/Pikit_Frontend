'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { authApi } from '@/lib/api';

const LoginModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const { isLoginModalOpen, closeLoginModal } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLoginModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 기존 username 필드를 email로 사용하도록 mapping (백엔드 사양에 따라 다를 수 있으나 현재 username이 login 필드임)
      const response = await authApi.login({ username: email, password });
      setAuth(response, rememberMe);
      closeLoginModal();
      window.location.reload();
    } catch (err) {
      setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeLoginModal} />
      
      <div className="relative w-[400px] rounded-2xl bg-bg-100 p-8 shadow-xl">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute right-6 top-6 text-gr-300 transition-colors hover:text-gr-100"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-center text-heading-md text-gr-100">로그인</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gr-300" />
            <input
              type="text"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-10 py-3 text-body-400 focus:outline-none ${
                errorMessage ? 'border-danger' : 'border-line-100 focus:border-primary'
              }`}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gr-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border px-10 py-3 text-body-400 focus:outline-none ${
                errorMessage ? 'border-danger' : 'border-line-100 focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gr-300 hover:text-gr-100"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-caption-lg-400 text-danger">{errorMessage}</p>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-line-100 text-primary focus:ring-primary accent-primary"
              />
              <span className="text-caption-lg-400 text-gr-200">로그인 유지</span>
            </label>
            <Link
              href="#"
              className="text-caption-lg-400 text-gr-200 underline decoration-gr-200/50 underline-offset-4 hover:text-gr-100"
            >
              비밀번호 찾기
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary py-3 text-body-500 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center text-caption-lg-400 text-gr-200">
          계정이 없으신가요?{' '}
          <Link
            href="/signup"
            onClick={closeLoginModal}
            className="font-medium text-gr-100 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
