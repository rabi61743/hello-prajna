import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOfflineStatus } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

export default function OfflineIndicator() {
  const isOffline = useOfflineStatus();
  const [showAlert, setShowAlert] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShowAlert(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (!showAlert) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert
        variant={isOffline ? 'destructive' : 'default'}
        className={cn(
          'animate-in slide-in-from-top-5',
          !isOffline && 'bg-green-50 border-green-200 text-green-800'
        )}
      >
        {isOffline ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <Wifi className="h-4 w-4" />
        )}
        <AlertDescription>
          {isOffline ? (
            <>
              <strong>You're offline.</strong> Some features may be limited.
            </>
          ) : (
            <>
              <strong>You're back online!</strong> All features are now available.
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
