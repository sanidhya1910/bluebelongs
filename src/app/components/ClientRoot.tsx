'use client';

import React from 'react';
import ClickSparkOverlay from './ClickSparkOverlay';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ClickSparkOverlay />
    </>
  );
}
