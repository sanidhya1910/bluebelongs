declare module '@/utils/clickspark' {
  import type React from 'react';
  const ClickSpark: React.FC<{
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;
    extraScale?: number;
    children?: React.ReactNode;
  }>;
  export default ClickSpark;
}
