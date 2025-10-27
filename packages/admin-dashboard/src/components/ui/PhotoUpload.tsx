import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Image } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import MobilePhotoCapture from '../Jobs/MobilePhotoCapture';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showMobileCapture, setShowMobileCapture] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    setUploading(true);
    const newPhotos: string[] = [];
    
    for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        // Convert to base64 for demo - in production, upload to cloud storage
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === Math.min(files.length, maxPhotos - photos.length)) {
              onPhotosChange([...photos, ...newPhotos]);
              setUploading(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(updatedPhotos);
  };

  const handleMobilePhotoCapture = (photo: string) => {
    onPhotosChange([...photos, photo]);
    setShowMobileCapture(false);
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Controls */}
      {canAddMore && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            icon={Camera}
            onClick={() => {
              if (isMobile) {
                setShowMobileCapture(true);
              } else {
                cameraInputRef.current?.click();
              }
            }}
            disabled={uploading}
            className="flex-1"
          >
            Take Photo
          </Button>
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            Upload Photos
          </Button>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="relative group p-0 overflow-hidden">
              <img
                src={photo}
                alt={`Job photo ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removePhoto(index)}
                  className="opacity-0 group-hover:opacity-100 p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h4>
          <p className="text-gray-500 mb-4">Add photos to document the job progress</p>
        </div>
      )}

      {/* Photo Count */}
      <div className="text-sm text-gray-500 text-center">
        {photos.length} of {maxPhotos} photos
      </div>

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
            <span>Uploading photos...</span>
          </div>
        </div>
      )}

      {/* Mobile Photo Capture Modal */}
      <MobilePhotoCapture
        isOpen={showMobileCapture}
        onPhotoCapture={handleMobilePhotoCapture}
        onClose={() => setShowMobileCapture(false)}
      />
    </div>
  );
};

export default PhotoUpload;