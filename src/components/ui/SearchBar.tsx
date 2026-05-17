import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchBar = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', className)}>
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gr-300" />
        <input
          ref={ref}
          className="h-10 w-full rounded-md bg-bg-300 pl-10 pr-4 text-body-400 text-gr-100 placeholder:text-gr-300 outline-none focus:bg-bg-100 focus:ring-2 focus:ring-primary-light border-none"
          placeholder="프롬프트를 검색하세요"
          {...props}
        />
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
