'use client';

import React from 'react';
import ClickSpark from '../../utils/ClickSpark';

type Props = {
  children: React.ReactNode;
};

export default function ClickSparkProvider({ children }: Props) {
  return (
    <div className="relative min-h-screen">
      <ClickSpark
        sparkColor="#0ea5e9"
        sparkSize={10}
        sparkRadius={18}
        sparkCount={10}
        duration={450}
        easing="ease-out"
        extraScale={1.15}
      >
        {children}
      </ClickSpark>
    </div>
  );
}
