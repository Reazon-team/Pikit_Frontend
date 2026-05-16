'use client';

import React from 'react';

const MainBanner = () => {
  return (
    <section className="mx-auto max-w-[1280px] px-6 my-8">
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#FFF3E8] to-[#FFE0CC] px-10 py-8">
        <div>
          <p
            className="mb-2 text-gr-200"
            style={{
              fontFamily: 'Pretendard',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '1.5',
              letterSpacing: '-0.011em',
            }}
          >
            쉽게 찾고, 바로 복사하는
          </p>
          <h2 className="text-heading-xl text-gr-100">
            <span className="text-primary font-bold">이미지 프롬프트 모음</span>{' '}
            Pikit
          </h2>
        </div>

        {/* Placeholder for Pikit Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary font-bold text-heading-xl text-white shadow-lg">
          P
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
