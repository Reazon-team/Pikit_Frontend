'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { authApi } from '@/lib/api';
import LoginModal from '@/components/auth/LoginModal';

const Header = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { openLoginModal } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore errors during logout
    }
    clearAuth();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.location.reload();
    }
  };

  const menuItems = [
    { label: '프롬프트', href: '/' },
    { label: '질문해요', href: '/qa' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line-100 bg-bg-100">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6 py-4">
        {/* Left Area: Logo & Menu */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <img src="/logo.png" alt="Pickit" className="h-5 w-auto" />
          </Link>

          <nav className="flex items-center gap-5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-body-500 transition-colors hover:text-gr-100 ${
                    isActive ? 'font-medium text-gr-100' : 'text-gr-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Area: Search Bar */}
        <div className="relative mx-4 w-full max-w-[480px] flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gr-200" />
          <input
            type="text"
            placeholder="프롬프트를 검색하세요."
            className="h-10 w-full rounded-md bg-bg-200 pl-10 pr-4 text-caption-lg-400 text-gr-100 placeholder:text-gr-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>

        {/* Right Area: Auth */}
        <div className="flex items-center gap-2">
          {!mounted ? (
            <div className="h-9 w-20" />
          ) : isAuthenticated && user ? (
            <div ref={dropdownRef} className="relative flex items-center gap-3">
              <span className="text-body-500 text-gr-100">{user.nickname}</span>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-caption-lg-500"
              >
                {user.nickname?.charAt(0).toUpperCase()}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-md border border-line-100 bg-bg-100 shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-caption-lg-500 text-gr-200 hover:bg-bg-200 hover:text-gr-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="h-9 rounded-sm px-4 text-caption-lg-500 text-gr-200 transition-colors hover:text-gr-300"
                style={{ border: '1px solid var(--color-line-100)' }}
              >
                로그인
              </button>
              <Link
                href="/signup"
                className="flex items-center rounded-sm bg-primary px-4 text-caption-lg-500 text-white transition-all hover:opacity-90"
                style={{ height: '36px' }}
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
      <LoginModal />
    </header>
  );
};

export { Header };
