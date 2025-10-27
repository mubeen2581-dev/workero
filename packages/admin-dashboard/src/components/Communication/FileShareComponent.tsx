import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Download, Eye, Paperclip } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface FileShareComponentProps {
  onFileSelect: (files: FileAttachment[]) => void;
  onSendFile: (file: FileAttachment, message?: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

const FileShareComponent: React.FC<FileShareComponentProps> = ({
  onFileSelect,
  onSendFile,
  acceptedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'],
  maxFileSize = 10,
  className = '',
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    const validFiles: FileAttachment[] = [];
    
    Array.from(files).forEach((file) => {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !acceptedTypes.includes(fileExtension)) {
        alert(`File type .${fileExtension} is not supported`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB`);
        return;
      }

      const fileAttachment: FileAttachment = {
        id: `file_${Date.now()}_${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type || `application/${fileExtension}`,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };

      validFiles.push(fileAttachment);
    });

    if (validFiles.length > 0) {
      setSelectedFiles([...selectedFiles, ...validFiles]);
      onFileSelect(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      default:
        return '📎';
    }
  };

  const handleSendFile = (file: FileAttachment) => {
    onSendFile(file, message);
    setMessage('');
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">File Sharing</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={Paperclip}
          >
            Attach
          </Button>
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported: {acceptedTypes.join(', ')} (max {maxFileSize}MB)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.map(type => `.${type}`).join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Selected Files</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.name)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.type.startsWith('image/') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                        icon={Eye}
                        className="p-1"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = file.url;
                        a.download = file.name;
                        a.click();
                      }}
                      icon={Download}
                      className="p-1"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendFile(file)}
                      className="text-xs px-2 py-1"
                    >
                      Send
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      icon={X}
                      className="p-1 text-red-600 hover:text-red-700"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Optional Message */}
            <div className="mt-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message with your files (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Share</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Mock quote PDF generation
                const quotePDF: FileAttachment = {
                  id: `quote_${Date.now()}`,
                  name: 'Quote_#12345.pdf',
                  size: 245760, // ~240KB
                  type: 'application/pdf',
                  url: 'data:application/pdf;base64,mock-pdf-data',
                  uploadedAt: new Date().toISOString(),
                };
                handleSendFile(quotePDF);
              }}
              className="text-xs"
            >
              📄 Send Quote
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Mock invoice PDF generation
                const invoicePDF: FileAttachment = {
                  id: `invoice_${Date.now()}`,
                  name: 'Invoice_#67890.pdf',
                  size: 198432, // ~194KB
                  type: 'application/pdf',
                  url: 'data:application/pdf;base64,mock-invoice-data',
                  uploadedAt: new Date().toISOString(),
                };
                handleSendFile(invoicePDF);
              }}
              className="text-xs"
            >
              🧾 Send Invoice
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileShareComponent;