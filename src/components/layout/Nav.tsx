'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: '// all', href: '/?sort=random' },
  { label: '// new', href: '/?sort=latest' },
  { label: '// hot', href: '/?sort=popular' },
  { label: '// Q&A', href: '/qa' },
];

const NavContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort');

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => {
        let isActive = false;
        
        if (item.href === '/') {
          isActive = pathname === '/' && !sort;
        } else if (item.href.startsWith('/?sort=')) {
          const itemSort = item.href.split('=')[1];
          isActive = pathname === '/' && (sort === itemSort || (!sort && itemSort === 'random'));
        } else {
          isActive = pathname === item.href;
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'font-mono text-sm transition-colors hover:text-gray-100',
              isActive
                ? 'text-primary-100 font-bold bg-primary-100/10 px-2 py-1 rounded-sm'
                : 'text-gray-300'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

const Nav = () => {
  return (
    <Suspense fallback={<div className="flex items-center gap-6 h-8" />}>
      <NavContent />
    </Suspense>
  );
};

export { Nav };
