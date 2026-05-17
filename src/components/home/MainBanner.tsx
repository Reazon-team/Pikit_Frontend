'use client';

import React from 'react';

const MainBanner = () => {
  return (
    <section className="mx-auto max-w-[1280px] px-6 my-8">
      <img
        src="/banner.png"
        alt="Pikit banner"
        className="w-full h-[120px] object-cover"
        style={{ borderRadius: 'var(--radius-lg)' }}
      />
    </section>
  );
};

export default MainBanner;
