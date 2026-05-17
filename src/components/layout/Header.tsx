'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { authApi } from '@/lib/api';
import LoginModal from '@/components/auth/LoginModal';
import { SearchBar } from '@/components/ui/SearchBar';

const Header = () => {
  const { isAuthenticated, isAdmin, user, clearAuth } = useAuthStore();
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
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <img src="/logo.png" alt="Pickit" className="h-5 w-auto" />
          </Link>

          <nav className="flex items-center gap-5">
            {menuItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname.startsWith('/prompts')
                  : pathname.startsWith(item.href);
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

            {/* 관리자만 보이는 메뉴 */}
            {mounted && isAuthenticated && isAdmin && (
              <Link
                href="/admin/prompts"
                className={`text-body-500 transition-colors hover:text-gr-100 ${
                  pathname.startsWith('/admin')
                    ? 'font-medium text-gr-100'
                    : 'text-gr-200'
                }`}
              >
                프롬프트 관리
              </Link>
            )}
          </nav>
        </div>

        {/* Center Area: Search Bar */}
        <SearchBar className="mx-4 max-w-[380px] flex-1" />

        {/* Right Area: Auth */}
        <div className="flex items-center gap-2">
          {!mounted ? (
            <div className="h-9 w-20" />
          ) : isAuthenticated && user ? (
            <div ref={dropdownRef} className="relative flex items-center gap-2">
              <div className="flex items-center" style={{ gap: '4px' }}>
                <span className="text-body-500 text-gr-100">
                  {user.nickname}
                </span>
                <span className="text-body-400 text-gr-100">님</span>
              </div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-caption-lg-500 text-primary"
                style={{ backgroundColor: '#FFF5EC' }}
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
              <Link
                href="/signup"
                className="h-9 rounded-sm px-4 text-caption-lg-500 text-gr-100 transition-colors hover:text-gr-300 flex items-center"
              >
                회원가입
              </Link>
              <button
                onClick={openLoginModal}
                className="flex items-center rounded-sm bg-primary px-4 text-caption-lg-500 text-white transition-all hover:opacity-90"
                style={{ height: '36px' }}
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
      <LoginModal />
    </header>
  );
};

export { Header };
