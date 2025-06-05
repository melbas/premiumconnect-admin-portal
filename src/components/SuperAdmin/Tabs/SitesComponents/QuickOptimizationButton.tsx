
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { optimizationMCP } from '@/services/mcp/OptimizationMCPServer';
import { networkMCP } from '@/services/mcp/NetworkMCPServer';
import { behaviorMCP } from '@/services/mcp/BehaviorMCPServer';

interface QuickOptimizationButtonProps {
  siteId: string;
  siteName: string;
  onOptimizationComplete?: () => void;
}

const QuickOptimizationButton: React.FC<QuickOptimizationButtonProps> = ({
  siteId,
  siteName,
  onOptimizationComplete
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      // Récupérer les contextes
      const networkContext = await networkMCP.getNetworkContext(siteId);
      const behaviorContext = await behaviorMCP.getBehaviorContext(siteId);
      
      // Générer les optimisations
      const optimizations = await optimizationMCP.generateOptimizations(
        siteId, 
        networkContext, 
        behaviorContext
      );

      // Appliquer une optimisation immédiate
      const immediateRecommendation = optimizations.recommendations.immediate[0];
      if (immediateRecommendation) {
        const success = await optimizationMCP.applyOptimization(siteId, 'immediate-1');
        
        if (success) {
          toast({
            title: "Optimisation appliquée",
            description: `${siteName}: ${immediateRecommendation}`,
          });
        } else {
          toast({
            title: "Optimisation partiellement appliquée",
            description: "Certaines recommandations nécessitent une intervention manuelle",
            variant: "destructive"
          });
        }
      }

      onOptimizationComplete?.();
      
    } catch (error) {
      console.error('Erreur optimisation:', error);
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'appliquer l'optimisation automatique",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOptimize}
      disabled={isOptimizing}
      className="h-8 px-2"
    >
      {isOptimizing ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Zap className="h-3 w-3" />
      )}
      <span className="ml-1 text-xs">
        {isOptimizing ? 'Optimisation...' : 'Optimiser'}
      </span>
    </Button>
  );
};

export default QuickOptimizationButton;
