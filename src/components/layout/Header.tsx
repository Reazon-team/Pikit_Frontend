import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Nav } from './Nav';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line-100 bg-bg-100/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center font-mono text-xl font-bold text-primary-100">
            <span>pickit</span>
            <span className="ml-0.5 h-5 w-2 bg-primary-100 animate-blink"></span>
          </Link>
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 md:max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-sans">
            로그인
          </Button>
          <Button variant="primary" size="sm" className="font-sans">
            회원가입
          </Button>
        </div>
      </div>
    </header>
  );
};

export { Header };
