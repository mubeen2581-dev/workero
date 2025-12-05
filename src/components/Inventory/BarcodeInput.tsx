import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X, Loader2, Keyboard } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
  className?: string;
}

const BarcodeInput: React.FC<BarcodeInputProps> = ({ onScan, className = '' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopScanning();
    };
  }, []);

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
    setError(null);
  };

  const startScanning = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Get available video input devices
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      // Use the first available camera (usually the default)
      const selectedDeviceId = videoInputDevices[0].deviceId;

      // Start scanning
      const stream = await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const code = result.getText();
            if (code) {
              stopScanning();
              onScan(code);
              toast.success(`Barcode scanned: ${code}`);
            }
          }
          if (error && error.name !== 'NotFoundException') {
            // NotFoundException is normal when no barcode is detected
            console.debug('Scan error:', error);
          }
        }
      );

      streamRef.current = stream;
      setIsScanning(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to access camera');
      setIsLoading(false);
      toast.error(err.message || 'Failed to start camera');
    }
  };

  const handleScan = () => {
    const code = inputRef.current?.value.trim();
    if (code) {
      onScan(code);
      inputRef.current!.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <Card className={className}>
      <div className="p-4">
        {/* Camera View */}
        {isScanning && (
          <div className="mb-4 relative">
            <video
              ref={videoRef}
              className="w-full h-48 bg-gray-900 rounded-lg object-cover"
              autoPlay
              playsInline
              muted
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={stopScanning}
              className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
              icon={X}
            >
              Stop
            </Button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white rounded-lg w-48 h-32" />
            </div>
          </div>
        )}

        {/* Manual Input */}
        {!isScanning && (
          <div className="flex items-center gap-2 mb-2">
            <input
              ref={inputRef}
              placeholder="Scan or type barcode..."
              className="input flex-1"
              onKeyPress={handleKeyPress}
            />
            <Button variant="primary" size="sm" onClick={handleScan}>
              Add
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isScanning ? (
            <Button
              variant="outline"
              size="sm"
              onClick={startScanning}
              disabled={isLoading}
              icon={isLoading ? Loader2 : Camera}
              className="flex-1"
            >
              {isLoading ? 'Starting camera...' : 'Scan with Camera'}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={stopScanning}
              icon={Keyboard}
              className="flex-1"
            >
              Switch to Manual Input
            </Button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}

        {!isScanning && !error && (
          <p className="text-xs text-gray-500 mt-2">
            Click "Scan with Camera" to use your webcam, or type the barcode manually.
          </p>
        )}
      </div>
    </Card>
  );
};

export default BarcodeInput;


