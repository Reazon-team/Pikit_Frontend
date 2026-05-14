'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { authApi } from '@/lib/api';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const router = useRouter();
  const { isAuthenticated, setAuth } = useAuthStore();
  const { openLoginModal } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/');
    }
  }, [mounted, isAuthenticated, router]);

  const validate = (): boolean => {
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    // Password complexity: English + Number + Special char, 8+ chars
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.');
      return false;
    }

    if (password !== passwordConfirm) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return false;
    } else {
      setPasswordError(null);
    }

    if (!nickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await authApi.signup({ 
        username: email, 
        password, 
        nickname 
      });
      setAuth(response);
      router.push('/');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && passwordConfirm && nickname && !isLoading;

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 text-center text-heading-xl text-gr-100">회원가입</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-caption-lg-500 text-gr-100">이메일</label>
          <input
            type="text"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line-100 px-4 py-3 text-body-400 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Nickname (Added to satisfy API requirements) */}
        <div className="space-y-2">
          <label className="text-caption-lg-500 text-gr-100">닉네임</label>
          <input
            type="text"
            placeholder="사용하실 닉네임을 입력해주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-lg border border-line-100 px-4 py-3 text-body-400 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-caption-lg-500 text-gr-100">비밀번호</label>
          <input
            type="password"
            placeholder="영문, 숫자, 특수문자가 들어간 8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line-100 px-4 py-3 text-body-400 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Password Confirm */}
        <div className="space-y-2">
          <input
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={`w-full rounded-lg border px-4 py-3 text-body-400 focus:outline-none ${
              passwordError ? 'border-danger' : 'border-line-100 focus:border-primary'
            }`}
          />
          {passwordError && (
            <p className="text-caption-lg-400 text-danger">{passwordError}</p>
          )}
        </div>

        {/* Global Error Message */}
        {errorMessage && (
          <p className="text-caption-lg-400 text-danger text-center">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full rounded-lg bg-primary py-3 text-body-500 text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '가입 처리 중...' : '가입완료'}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center text-caption-lg-400 text-gr-200">
        이미 계정이 있으신가요?{' '}
        <button
          onClick={() => {
            router.push('/');
            setTimeout(() => openLoginModal(), 100);
          }}
          className="font-medium text-gr-100 hover:underline"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
