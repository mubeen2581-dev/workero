import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PhotoUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onUpload,
  maxFiles = 10,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.slice(0, maxFiles - previewFiles.length);
    setPreviewFiles(prev => [...prev, ...validFiles]);
    onUpload(validFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card
        className={`relative border-2 border-dashed transition-colors ${
          dragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Job Photos
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop images here, or click to select files
          </p>
          
          <Button
            variant="primary"
            icon={Upload}
            onClick={openFileDialog}
            disabled={previewFiles.length >= maxFiles}
          >
            Choose Files
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            Max {maxFiles} files • JPG, PNG, GIF up to 10MB each
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </Card>

      {/* Preview Files */}
      {previewFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Uploaded Photos ({previewFiles.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                
                {/* File Info */}
                <div className="mt-2">
                  <p className="text-xs text-gray-600 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upload Progress (Mock) */}
      {previewFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700">
              Uploading {previewFiles.length} photo{previewFiles.length !== 1 ? 's' : ''}...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoUploader;
