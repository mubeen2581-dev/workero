import React, { useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
  className?: string;
}

const BarcodeInput: React.FC<BarcodeInputProps> = ({ onScan, className = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    const code = inputRef.current?.value.trim();
    if (code) onScan(code);
  };

  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <input ref={inputRef} placeholder="Scan or type barcode..." className="input flex-1" />
          <Button variant="primary" size="sm" onClick={handleScan}>Add</Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Camera scanning placeholder for web. On mobile, use native scanner.</p>
      </div>
    </Card>
  );
};

export default BarcodeInput;


