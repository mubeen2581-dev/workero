import React, { useState } from 'react';
import { Camera, Pen, Clock, CheckCircle } from 'lucide-react';
import { Job } from '@/types';
import Button from '../ui/Button';
import MobilePhotoCapture from './MobilePhotoCapture';
import SignaturePad from '../ui/SignaturePad';
import Card from '../ui/Card';

interface QuickActionsProps {
  job: Job;
  onJobUpdate: (jobId: string, updates: Partial<Job>) => void;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  job,
  onJobUpdate,
  className = '',
}) => {
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  const handlePhotoCapture = (photo: string) => {
    const updatedPhotos = [...job.photos, photo];
    onJobUpdate(job.id, { photos: updatedPhotos });
    setShowPhotoCapture(false);
  };

  const handleSignatureCapture = (signature: string | null) => {
    onJobUpdate(job.id, { signature });
    if (signature) {
      setShowSignature(false);
    }
  };

  const handleStatusChange = (newStatus: Job['status']) => {
    const updates: Partial<Job> = { status: newStatus };
    
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString();
      updates.actualDuration = job.actualDuration || job.estimatedDuration;
    }
    
    onJobUpdate(job.id, updates);
  };

  const canComplete = job.status === 'in_progress' && job.signature;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Actions */}
      {job.status === 'scheduled' && (
        <Button
          variant="primary"
          icon={Clock}
          onClick={() => handleStatusChange('in_progress')}
          className="w-full"
        >
          Start Job
        </Button>
      )}

      {job.status === 'in_progress' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              icon={Camera}
              onClick={() => setShowPhotoCapture(true)}
              size="sm"
            >
              Add Photo
            </Button>
            <Button
              variant="secondary"
              icon={Pen}
              onClick={() => setShowSignature(true)}
              size="sm"
            >
              Get Signature
            </Button>
          </div>
          
          <Button
            variant="primary"
            icon={CheckCircle}
            onClick={() => handleStatusChange('completed')}
            disabled={!canComplete}
            className="w-full"
          >
            {canComplete ? 'Complete Job' : 'Signature Required'}
          </Button>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Job Completed</span>
          </div>
          {job.completedDate && (
            <p className="text-sm text-gray-500 mt-1">
              Completed on {new Date(job.completedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Photo Capture Modal */}
      <MobilePhotoCapture
        isOpen={showPhotoCapture}
        onPhotoCapture={handlePhotoCapture}
        onClose={() => setShowPhotoCapture(false)}
      />

      {/* Signature Modal */}
      {showSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <Card className="p-6">
              <SignaturePad
                signature={job.signature}
                onSignatureChange={handleSignatureCapture}
              />
              <div className="mt-4 flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowSignature(false)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;