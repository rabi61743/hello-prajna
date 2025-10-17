import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isLoading = false
}: ConfirmationDialogProps) {
  const icons = {
    danger: <XCircle className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />
  };

  const buttonVariants = {
    danger: 'destructive',
    warning: 'default',
    info: 'default',
    success: 'default'
  } as const;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {icons[type]}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={buttonVariants[type] === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for using confirmation dialogs
import { useState, useCallback } from 'react';

interface UseConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmationOptions>({
    title: '',
    description: ''
  });
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: UseConfirmationOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveCallback) {
      resolveCallback(true);
    }
    setIsOpen(false);
  }, [resolveCallback]);

  const handleCancel = useCallback(() => {
    if (resolveCallback) {
      resolveCallback(false);
    }
    setIsOpen(false);
  }, [resolveCallback]);

  const ConfirmationDialogComponent = useCallback(() => (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      {...options}
    />
  ), [isOpen, handleCancel, handleConfirm, options]);

  return {
    confirm,
    ConfirmationDialog: ConfirmationDialogComponent
  };
}
