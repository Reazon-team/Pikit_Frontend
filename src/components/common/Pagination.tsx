'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center text-gr-200 hover:text-gr-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronsLeft size={18} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center text-gr-200 hover:text-gr-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-8 w-8 text-caption-lg-400 transition ${
            currentPage === page
              ? 'font-medium text-gr-100 underline underline-offset-4'
              : 'text-gr-200 hover:text-gr-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center text-gr-200 hover:text-gr-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight size={18} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center text-gr-200 hover:text-gr-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
