import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, RefreshCw, X, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { CalendarSyncService, CalendarSyncStatus } from '@/services/calendarSync';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

interface CalendarSyncStatusProps {
  onSyncPush?: () => void;
  onSyncPull?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

const CalendarSyncStatusComponent: React.FC<CalendarSyncStatusProps> = ({
  onSyncPush,
  onSyncPull,
  onDisconnect,
  className = '',
}) => {
  const [status, setStatus] = useState<CalendarSyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const data = await CalendarSyncService.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load calendar sync status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncPush = async () => {
    setIsSyncing(true);
    try {
      const result = await CalendarSyncService.syncPush();
      if (result.success) {
        toast.success(result.message);
        onSyncPush?.();
      } else {
        toast.error(result.message);
      }
      await loadStatus();
    } catch (error) {
      toast.error('Failed to sync events');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncPull = async () => {
    setIsSyncing(true);
    try {
      const result = await CalendarSyncService.syncPull();
      if (result.success) {
        toast.success(result.message);
        if (result.data?.conflicts && result.data.conflicts > 0) {
          toast.warning(`${result.data.conflicts} conflicts detected with existing events`);
        }
        onSyncPull?.();
      } else {
        toast.error(result.message);
      }
      await loadStatus();
    } catch (error) {
      toast.error('Failed to pull events');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Calendar?')) {
      return;
    }

    try {
      const result = await CalendarSyncService.disconnect();
      if (result.success) {
        toast.success(result.message);
        onDisconnect?.();
        await loadStatus();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to disconnect');
    }
  };

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
        </div>
      </Card>
    );
  }

  if (!status?.connected) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Google Calendar</h3>
          </div>
          <Badge className="bg-gray-100 text-gray-700">Not Connected</Badge>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Connect your Google Calendar to sync events bidirectionally
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={async () => {
            await CalendarSyncService.connect();
          }}
          className="w-full"
        >
          Connect Google Calendar
        </Button>
      </Card>
    );
  }

  const connection = status.connection!;
  const lastSync = connection.last_sync_at
    ? formatDistanceToNow(new Date(connection.last_sync_at), { addSuffix: true })
    : 'Never';

  const getStatusColor = (syncStatus: string | null) => {
    switch (syncStatus) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">Google Calendar</h3>
        </div>
        <Badge className={connection.is_token_valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {connection.is_token_valid ? 'Connected' : 'Token Expired'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Email:</span> {connection.google_email}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-medium">Last Sync:</span> {lastSync}
        </div>
        {connection.last_sync_status && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 font-medium">Status:</span>
            <Badge className={`text-xs ${getStatusColor(connection.last_sync_status)}`}>
              {connection.last_sync_status}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSyncPush}
          disabled={isSyncing || !connection.is_token_valid}
          icon={isSyncing ? Loader2 : RefreshCw}
          className="w-full"
        >
          {isSyncing ? 'Syncing...' : 'Push to Google'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSyncPull}
          disabled={isSyncing || !connection.is_token_valid}
          icon={isSyncing ? Loader2 : RefreshCw}
          className="w-full"
        >
          {isSyncing ? 'Pulling...' : 'Pull from Google'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          disabled={isSyncing}
          icon={X}
          className="w-full text-red-600 hover:text-red-700"
        >
          Disconnect
        </Button>
      </div>
    </Card>
  );
};

export default CalendarSyncStatusComponent;

