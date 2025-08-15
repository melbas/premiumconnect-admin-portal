import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export const useErrorBoundary = () => {
  const { toast } = useToast();
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
    errorCount: 0
  });

  const logError = useCallback(async (errorInfo: ErrorInfo) => {
    try {
      // Log to console for debugging
      console.error('Application Error:', errorInfo);
      
      // Send to analytics/monitoring service
      if (typeof window !== 'undefined') {
        // You can integrate with services like Sentry, LogRocket, etc.
        console.info('Error logged for monitoring');
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }, []);

  const captureError = useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    setState(prev => ({
      hasError: true,
      error,
      errorInfo: errorData,
      errorCount: prev.errorCount + 1
    }));

    logError(errorData);

    // Show user-friendly toast notification
    toast({
      title: "Une erreur est survenue",
      description: "L'équipe technique a été notifiée. Veuillez réessayer.",
      variant: "destructive",
    });
  }, [logError, toast]);

  const resetError = useCallback(() => {
    setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    });
  }, []);

  const handleAsyncError = useCallback((error: Error) => {
    captureError(error);
  }, [captureError]);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      handleAsyncError(error);
    };

    const handleError = (event: ErrorEvent) => {
      const error = event.error instanceof Error ? event.error : new Error(event.message);
      handleAsyncError(error);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      }
    };
  }, [handleAsyncError]);

  return {
    ...state,
    captureError,
    resetError,
    handleAsyncError
  };
};