
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  height?: number;
}

const ChartErrorFallback: React.FC<ChartErrorFallbackProps> = ({ 
  error, 
  onRetry, 
  height = 300 
}) => {
  return (
    <div 
      style={{ height: `${height}px` }} 
      className="flex flex-col items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted"
    >
      <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground mb-3 text-center px-4">
        Impossible de charger le graphique
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <p className="text-xs text-red-500 mb-3 px-4 text-center">
          {error.message}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default ChartErrorFallback;
