// hooks/useIsPrinting.ts
import { useEffect, useState } from 'react';

export function useIsPrinting() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('print');
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    const handleMediaChange = (event: MediaQueryListEvent) => setIsPrinting(event.matches);

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return isPrinting;
}
