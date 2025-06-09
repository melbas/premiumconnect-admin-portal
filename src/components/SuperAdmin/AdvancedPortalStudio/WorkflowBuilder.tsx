
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { WorkflowService } from '@/services/workflowService';
import { Workflow, WorkflowNode, ApiConfig } from '@/types/workflow';
import { 
  Play, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  Link, 
  Zap,
  Clock,
  GitBranch,
  Database,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const { toast } = useToast();

  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      name: 'Nouveau Workflow',
      version: '1.0.0',
      nodes: [
        {
          id: 'start',
          type: 'start',
          position: { x: 100, y: 100 },
          data: { label: 'Début' },
          inputs: [],
          outputs: ['next'],
        },
        {
          id: 'end',
          type: 'end',
          position: { x: 400, y: 100 },
          data: { label: 'Fin' },
          inputs: ['prev'],
          outputs: [],
        }
      ],
      connections: [
        {
          id: 'start-end',
          source: 'start',
          target: 'end',
        }
      ],
      variables: {},
      isActive: false,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  };

  const addNode = (type: string) => {
    if (!selectedWorkflow) return;

    const newNode: WorkflowNode = {
      id: crypto.randomUUID(),
      type: type as any,
      position: { x: 250, y: 200 },
      data: { label: type },
      inputs: ['prev'],
      outputs: ['next'],
    };

    setSelectedWorkflow({
      ...selectedWorkflow,
      nodes: [...selectedWorkflow.nodes, newNode],
    });
  };

  const executeWorkflow = async () => {
    if (!selectedWorkflow) return;

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const result = await WorkflowService.executeWorkflow(selectedWorkflow, {
        userId: 'test-user',
        sessionId: crypto.randomUUID(),
      });

      setExecutionResult(result);
      toast({
        title: "Workflow exécuté",
        description: "Le workflow s'est terminé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'exécution",
        description: error.message,
        variant: "destructive",
      });
      setExecutionResult({ error: error.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const nodeTypeIcons = {
    start: Play,
    end: Save,
    api_call: Database,
    condition: GitBranch,
    delay: Clock,
    transform: RefreshCw,
    user_input: MessageSquare,
    notification: Zap,
    loop: RefreshCw,
  };

  const nodeTypeLabels = {
    start: 'Début',
    end: 'Fin',
    api_call: 'Appel API',
    condition: 'Condition',
    delay: 'Délai',
    transform: 'Transformation',
    user_input: 'Saisie Utilisateur',
    notification: 'Notification',
    loop: 'Boucle',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workflow Builder</h3>
          <p className="text-sm text-muted-foreground">
            Créez et gérez des workflows visuels pour l'automatisation
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={createNewWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Workflow
          </Button>
          
          {selectedWorkflow && (
            <Button 
              onClick={executeWorkflow} 
              disabled={isExecuting}
              variant="outline"
            >
              {isExecuting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Tester
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedWorkflow?.id === workflow.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{workflow.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {workflow.nodes.length} étapes • v{workflow.version}
                    </p>
                  </div>
                  <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                    {workflow.isActive ? 'Actif' : 'Brouillon'}
                  </Badge>
                </div>
              </div>
            ))}

            {workflows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucun workflow créé</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Éditeur de workflow */}
        {selectedWorkflow ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{selectedWorkflow.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedWorkflow.nodes.length} étapes configurées
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Palette d'outils */}
              <div>
                <Label className="text-sm font-medium">Ajouter une étape</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(nodeTypeLabels).map(([type, label]) => {
                    if (type === 'start' || type === 'end') return null;
                    const Icon = nodeTypeIcons[type as keyof typeof nodeTypeIcons];
                    return (
                      <Button
                        key={type}
                        size="sm"
                        variant="outline"
                        onClick={() => addNode(type)}
                        className="text-xs"
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Visualisation du workflow */}
              <div className="border rounded-lg p-4 bg-muted/20 min-h-[300px]">
                <div className="text-center text-muted-foreground">
                  <GitBranch className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Éditeur visuel du workflow</p>
                  <p className="text-xs">
                    Glissez et déposez les étapes pour créer votre flux
                  </p>
                </div>
                
                {/* Liste des nœuds */}
                <div className="mt-4 space-y-2">
                  {selectedWorkflow.nodes.map((node) => {
                    const Icon = nodeTypeIcons[node.type as keyof typeof nodeTypeIcons];
                    return (
                      <div key={node.id} className="flex items-center gap-2 p-2 bg-background rounded border">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{nodeTypeLabels[node.type as keyof typeof nodeTypeLabels]}</span>
                        <Badge variant="outline" className="text-xs">{node.id.slice(0, 8)}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Résultat d'exécution */}
              {executionResult && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Résultat de l'exécution</Label>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun workflow sélectionné</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Créez un nouveau workflow ou sélectionnez-en un existant pour commencer
              </p>
              <Button onClick={createNewWorkflow}>
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier workflow
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
