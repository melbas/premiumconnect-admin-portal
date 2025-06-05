
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react';

interface SiteAIIndicatorsProps {
  siteId: string;
  siteName: string;
  optimizationScore?: number;
  activeAlertsCount?: number;
  lastOptimization?: Date;
}

const SiteAIIndicators: React.FC<SiteAIIndicatorsProps> = ({
  siteId,
  siteName,
  optimizationScore = 0,
  activeAlertsCount = 0,
  lastOptimization
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-3 w-3" />;
    if (score >= 70) return <Brain className="h-3 w-3" />;
    return <AlertTriangle className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Score d'optimisation */}
      <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getScoreColor(optimizationScore)}`}>
        {getScoreIcon(optimizationScore)}
        {optimizationScore}%
      </div>

      {/* Alertes actives */}
      {activeAlertsCount > 0 && (
        <Badge variant="destructive" className="text-xs">
          {activeAlertsCount} alerte{activeAlertsCount > 1 ? 's' : ''}
        </Badge>
      )}

      {/* Dernière optimisation */}
      {lastOptimization && (
        <span className="text-xs text-muted-foreground">
          Opt: {lastOptimization.toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

export default SiteAIIndicators;
