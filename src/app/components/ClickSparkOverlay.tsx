'use client';

import React, { useEffect, useState } from 'react';
import ClickSpark from '../../utils/ClickSpark';

export default function ClickSparkOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <ClickSpark
        sparkColor="#0ea5e9"
        sparkSize={10}
        sparkRadius={18}
        sparkCount={10}
        duration={450}
        easing="ease-out"
        extraScale={1.15}
        listenGlobalClicks
      />
    </div>
  );
}
