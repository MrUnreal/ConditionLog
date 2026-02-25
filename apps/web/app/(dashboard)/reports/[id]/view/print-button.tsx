'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button onClick={handlePrint} className="print:hidden">
      🖨️ Print / Save as PDF
    </Button>
  );
}
