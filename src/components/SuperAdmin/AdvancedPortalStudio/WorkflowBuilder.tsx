
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  GitBranch, 
  Settings,
  Zap,
  AlertCircle
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'start' | 'api_call' | 'condition' | 'end' | 'delay' | 'transform';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: Array<{
    source: string;
    target: string;
  }>;
  isActive: boolean;
}

const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Authentification SMS + Paiement',
      description: 'Workflow complet d\'authentification avec paiement mobile money',
      nodes: [
        {
          id: 'start-1',
          type: 'start',
          name: 'Début',
          config: {},
          position: { x: 50, y: 100 }
        },
        {
          id: 'api-1',
          type: 'api_call',
          name: 'Envoi SMS',
          config: {
            url: 'https://api.orange.sn/sms/send',
            method: 'POST',
            authType: 'api_key'
          },
          position: { x: 250, y: 100 }
        },
        {
          id: 'condition-1',
          type: 'condition',
          name: 'Code vérifié ?',
          config: {
            field: 'verification_status',
            operator: 'equals',
            value: 'verified'
          },
          position: { x: 450, y: 100 }
        },
        {
          id: 'api-2',
          type: 'api_call',
          name: 'Paiement Mobile Money',
          config: {
            url: 'https://api.orange.sn/mobile-money/payment',
            method: 'POST',
            authType: 'oauth2'
          },
          position: { x: 650, y: 100 }
        },
        {
          id: 'end-1',
          type: 'end',
          name: 'Fin',
          config: {},
          position: { x: 850, y: 100 }
        }
      ],
      connections: [
        { source: 'start-1', target: 'api-1' },
        { source: 'api-1', target: 'condition-1' },
        { source: 'condition-1', target: 'api-2' },
        { source: 'api-2', target: 'end-1' }
      ],
      isActive: true
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const nodeTypes = [
    { value: 'start', label: 'Début', icon: Play, color: 'bg-green-500' },
    { value: 'api_call', label: 'Appel API', icon: Zap, color: 'bg-blue-500' },
    { value: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-yellow-500' },
    { value: 'delay', label: 'Délai', icon: Settings, color: 'bg-purple-500' },
    { value: 'transform', label: 'Transformation', icon: Settings, color: 'bg-indigo-500' },
    { value: 'end', label: 'Fin', icon: AlertCircle, color: 'bg-red-500' }
  ];

  const handleExecuteWorkflow = async () => {
    if (!selectedWorkflow) return;
    
    setIsExecuting(true);
    
    try {
      // Simulation d'exécution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Workflow exécuté",
        description: `Le workflow "${selectedWorkflow.name}" a été exécuté avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'exécution",
        description: "Une erreur est survenue lors de l'exécution du workflow",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveWorkflow = () => {
    if (!selectedWorkflow) return;
    
    toast({
      title: "Workflow sauvegardé",
      description: `Le workflow "${selectedWorkflow.name}" a été sauvegardé`,
    });
  };

  const handleAddNode = (type: WorkflowNode['type']) => {
    if (!selectedWorkflow) return;

    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      name: `Nouveau ${nodeTypes.find(nt => nt.value === type)?.label}`,
      config: {},
      position: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 100 }
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: [...selectedWorkflow.nodes, newNode]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
  };

  const renderNodeConfig = () => {
    if (!selectedNode) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration: {selectedNode.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="node-name">Nom du nœud</Label>
            <Input
              id="node-name"
              value={selectedNode.name}
              onChange={(e) => {
                const updated = { ...selectedNode, name: e.target.value };
                setSelectedNode(updated);
              }}
            />
          </div>

          {selectedNode.type === 'api_call' && (
            <>
              <div>
                <Label htmlFor="api-url">URL de l'API</Label>
                <Input
                  id="api-url"
                  placeholder="https://api.example.com/endpoint"
                  value={selectedNode.config.url || ''}
                  onChange={(e) => {
                    const updated = {
                      ...selectedNode,
                      config: { ...selectedNode.config, url: e.target.value }
                    };
                    setSelectedNode(updated);
                  }}
                />
              </div>
              
              <div>
                <Label htmlFor="api-method">Méthode HTTP</Label>
                <Select
                  value={selectedNode.config.method || 'GET'}
                  onValueChange={(value) => {
                    const updated = {
                      ...selectedNode,
                      config: { ...selectedNode.config, method: value }
                    };
                    setSelectedNode(updated);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {selectedNode.type === 'condition' && (
            <>
              <div>
                <Label htmlFor="condition-field">Champ à vérifier</Label>
                <Input
                  id="condition-field"
                  placeholder="response.status"
                  value={selectedNode.config.field || ''}
                  onChange={(e) => {
                    const updated = {
                      ...selectedNode,
                      config: { ...selectedNode.config, field: e.target.value }
                    };
                    setSelectedNode(updated);
                  }}
                />
              </div>
              
              <div>
                <Label htmlFor="condition-operator">Opérateur</Label>
                <Select
                  value={selectedNode.config.operator || 'equals'}
                  onValueChange={(value) => {
                    const updated = {
                      ...selectedNode,
                      config: { ...selectedNode.config, operator: value }
                    };
                    setSelectedNode(updated);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Égal à</SelectItem>
                    <SelectItem value="not_equals">Différent de</SelectItem>
                    <SelectItem value="greater_than">Supérieur à</SelectItem>
                    <SelectItem value="less_than">Inférieur à</SelectItem>
                    <SelectItem value="contains">Contient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="condition-value">Valeur</Label>
                <Input
                  id="condition-value"
                  placeholder="success"
                  value={selectedNode.config.value || ''}
                  onChange={(e) => {
                    const updated = {
                      ...selectedNode,
                      config: { ...selectedNode.config, value: e.target.value }
                    };
                    setSelectedNode(updated);
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workflow Builder</h3>
          <p className="text-sm text-muted-foreground">
            Créez des workflows visuels pour automatiser vos processus
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveWorkflow}
            disabled={!selectedWorkflow}
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          
          <Button
            onClick={handleExecuteWorkflow}
            disabled={!selectedWorkflow || isExecuting}
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? 'Exécution...' : 'Exécuter'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des workflows */}
        <Card>
          <CardHeader>
            <CardTitle>Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedWorkflow?.id === workflow.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{workflow.name}</h4>
                  <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                    {workflow.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {workflow.description}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  {workflow.nodes.length} nœuds
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas du workflow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedWorkflow?.name || 'Sélectionnez un workflow'}
              </span>
              <div className="flex gap-2">
                {nodeTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Button
                      key={type.value}
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddNode(type.value as WorkflowNode['type'])}
                      className="h-8"
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWorkflow ? (
              <div className="relative bg-muted/20 border-2 border-dashed rounded-lg h-96 overflow-auto">
                {selectedWorkflow.nodes.map((node) => {
                  const nodeType = nodeTypes.find(nt => nt.value === node.type);
                  const IconComponent = nodeType?.icon || Settings;
                  
                  return (
                    <div
                      key={node.id}
                      className={`absolute w-32 h-20 ${nodeType?.color} text-white rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center text-xs font-medium hover:scale-105 transition-transform ${
                        selectedNode?.id === node.id ? 'ring-2 ring-white' : ''
                      }`}
                      style={{
                        left: `${node.position.x}px`,
                        top: `${node.position.y}px`
                      }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <IconComponent className="h-4 w-4 mb-1" />
                      <span className="text-center px-1">{node.name}</span>
                    </div>
                  );
                })}
                
                {selectedWorkflow.nodes.length === 0 && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <GitBranch className="h-8 w-8 mx-auto mb-2" />
                      <p>Ajoutez des nœuds pour créer votre workflow</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                <div className="text-center">
                  <GitBranch className="h-12 w-12 mx-auto mb-4" />
                  <p>Sélectionnez un workflow pour le modifier</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuration du nœud sélectionné */}
      {selectedNode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderNodeConfig()}
          
          <Card>
            <CardHeader>
              <CardTitle>Variables disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <code>{'{{user.phone}}'}</code> - Numéro de téléphone
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>{'{{user.email}}'}</code> - Adresse email
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>{'{{session.id}}'}</code> - ID de session
                </div>
                <div className="p-2 bg-muted rounded">
                  <code>{'{{response.data}}'}</code> - Données de réponse API
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
