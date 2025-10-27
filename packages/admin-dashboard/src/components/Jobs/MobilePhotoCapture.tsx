import React, { useState, useRef } from 'react';
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface MobilePhotoCaptureProps {
  onPhotoCapture: (photo: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const MobilePhotoCapture: React.FC<MobilePhotoCaptureProps> = ({
  onPhotoCapture,
  onClose,
  isOpen,
}) => {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    setIsCapturing(true);
    
    // Convert to base64 for demo - in production, upload to cloud storage
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCapturedPhoto(e.target.result as string);
        setIsCapturing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Capture Photo</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!capturedPhoto ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Take a photo to document job progress</p>
              <Button
                variant="primary"
                icon={Camera}
                onClick={() => fileInputRef.current?.click()}
                disabled={isCapturing}
                className="w-full"
              >
                {isCapturing ? 'Processing...' : 'Take Photo'}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleCapture(e.target.files)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedPhoto}
                alt="Captured photo"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                icon={RotateCcw}
                onClick={retakePhoto}
                className="flex-1"
              >
                Retake
              </Button>
              <Button
                variant="primary"
                icon={Check}
                onClick={confirmPhoto}
                className="flex-1"
              >
                Use Photo
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MobilePhotoCapture;