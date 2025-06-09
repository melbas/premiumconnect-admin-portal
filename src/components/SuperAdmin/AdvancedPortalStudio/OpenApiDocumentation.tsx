
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Book, 
  Download, 
  Upload, 
  Play, 
  Code, 
  FileText,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  summary: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: Record<string, {
    description: string;
    schema: any;
  }>;
  tags: string[];
}

const OpenApiDocumentation: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      id: '1',
      path: '/api/auth/sms',
      method: 'POST',
      summary: 'Envoyer un code SMS',
      description: 'Envoie un code de vérification SMS au numéro spécifié',
      parameters: [
        {
          name: 'phone',
          type: 'string',
          required: true,
          description: 'Numéro de téléphone au format international'
        },
        {
          name: 'message',
          type: 'string',
          required: false,
          description: 'Message personnalisé à envoyer'
        }
      ],
      responses: {
        '200': {
          description: 'SMS envoyé avec succès',
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              messageId: { type: 'string' },
              timestamp: { type: 'string' }
            }
          }
        },
        '400': {
          description: 'Numéro de téléphone invalide',
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              code: { type: 'number' }
            }
          }
        }
      },
      tags: ['Authentication', 'SMS']
    },
    {
      id: '2',
      path: '/api/payment/mobile-money',
      method: 'POST',
      summary: 'Paiement Mobile Money',
      description: 'Initie un paiement via Orange Money ou Wave',
      parameters: [
        {
          name: 'phone',
          type: 'string',
          required: true,
          description: 'Numéro de téléphone du payeur'
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          description: 'Montant en FCFA'
        },
        {
          name: 'provider',
          type: 'string',
          required: true,
          description: 'Fournisseur: orange_money ou wave'
        }
      ],
      responses: {
        '200': {
          description: 'Paiement initié',
          schema: {
            type: 'object',
            properties: {
              transactionId: { type: 'string' },
              status: { type: 'string' },
              redirectUrl: { type: 'string' }
            }
          }
        }
      },
      tags: ['Payment', 'Mobile Money']
    }
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(endpoints[0]);
  const [testRequest, setTestRequest] = useState('{}');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTestEndpoint = async () => {
    if (!selectedEndpoint) return;
    
    setIsLoading(true);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        success: true,
        data: {
          message: `Test de ${selectedEndpoint.path} réussi`,
          timestamp: new Date().toISOString(),
          endpoint: selectedEndpoint.path,
          method: selectedEndpoint.method
        }
      };
      
      setTestResponse(JSON.stringify(mockResponse, null, 2));
      
      toast({
        title: "Test réussi",
        description: `L'endpoint ${selectedEndpoint.path} a répondu correctement`,
      });
    } catch (error) {
      setTestResponse(JSON.stringify({ error: 'Test failed' }, null, 2));
      toast({
        title: "Erreur de test",
        description: "Une erreur est survenue lors du test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCodeSample = (language: string): string => {
    if (!selectedEndpoint) return '';

    const { path, method, parameters } = selectedEndpoint;
    
    switch (language) {
      case 'javascript':
        return `// Appel API en JavaScript
const response = await fetch('${path}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
${parameters.map(p => `    ${p.name}: ${p.type === 'string' ? '"value"' : 'value'}`).join(',\n')}
  })
});

const data = await response.json();
console.log(data);`;

      case 'python':
        return `# Appel API en Python
import requests

url = "${path}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}
data = {
${parameters.map(p => `    "${p.name}": ${p.type === 'string' ? '"value"' : 'value'}`).join(',\n')}
}

response = requests.${method.toLowerCase()}(url, headers=headers, json=data)
print(response.json())`;

      case 'curl':
        return `# Appel API avec cURL
curl -X ${method} "${path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
${parameters.map(p => `    "${p.name}": ${p.type === 'string' ? '"value"' : 'value'}`).join(',\n')}
  }'`;

      default:
        return '';
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copié",
        description: "Le code a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier le code",
        variant: "destructive",
      });
    }
  };

  const exportOpenApiSpec = () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'API Portail Captif',
        version: '1.0.0',
        description: 'Documentation API pour les portails captifs sénégalais'
      },
      servers: [
        {
          url: 'https://api.portail-captif.sn',
          description: 'Serveur de production'
        },
        {
          url: 'https://staging-api.portail-captif.sn',
          description: 'Serveur de test'
        }
      ],
      paths: endpoints.reduce((acc, endpoint) => {
        acc[endpoint.path] = {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.summary,
            description: endpoint.description,
            tags: endpoint.tags,
            parameters: endpoint.parameters.map(p => ({
              name: p.name,
              in: 'body',
              required: p.required,
              description: p.description,
              schema: { type: p.type }
            })),
            responses: endpoint.responses
          }
        };
        return acc;
      }, {} as any)
    };

    const dataStr = JSON.stringify(spec, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'openapi-spec.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Spécification exportée",
      description: "Le fichier OpenAPI a été téléchargé",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documentation OpenAPI</h3>
          <p className="text-sm text-muted-foreground">
            Documentation automatique et tests d'APIs
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportOpenApiSpec}>
            <Download className="h-4 w-4 mr-2" />
            Exporter OpenAPI
          </Button>
          
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer Spec
          </Button>
          
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            Swagger UI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Endpoints API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedEndpoint?.id === endpoint.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant={endpoint.method === 'GET' ? 'default' : 
                            endpoint.method === 'POST' ? 'destructive' : 
                            endpoint.method === 'PUT' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {endpoint.method}
                  </Badge>
                  <span className="font-mono text-sm">{endpoint.path}</span>
                </div>
                <p className="text-sm text-muted-foreground">{endpoint.summary}</p>
                <div className="flex gap-1 mt-2">
                  {endpoint.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documentation détaillée */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedEndpoint?.path || 'Sélectionnez un endpoint'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEndpoint ? (
              <Tabs defaultValue="documentation" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="test">Test</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="documentation" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedEndpoint.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Paramètres</h4>
                    <div className="space-y-2">
                      {selectedEndpoint.parameters.map((param) => (
                        <div key={param.name} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono">{param.name}</code>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">
                                Requis
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Réponses</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedEndpoint.responses).map(([code, response]) => (
                        <div key={code} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={code.startsWith('2') ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {code}
                            </Badge>
                            <span className="text-sm font-medium">{response.description}</span>
                          </div>
                          <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(response.schema, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="test" className="space-y-4">
                  <div>
                    <Label htmlFor="test-request">Corps de la requête (JSON)</Label>
                    <Textarea
                      id="test-request"
                      value={testRequest}
                      onChange={(e) => setTestRequest(e.target.value)}
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>

                  <Button 
                    onClick={handleTestEndpoint}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isLoading ? 'Test en cours...' : 'Tester l\'endpoint'}
                  </Button>

                  {testResponse && (
                    <div>
                      <Label>Réponse</Label>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                        {testResponse}
                      </pre>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    
                    {['javascript', 'python', 'curl'].map((lang) => (
                      <TabsContent key={lang} value={lang}>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                            {generateCodeSample(lang)}
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(generateCodeSample(lang), lang)}
                          >
                            {copiedCode === lang ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Book className="h-12 w-12 mx-auto mb-4" />
                  <p>Sélectionnez un endpoint pour voir sa documentation</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpenApiDocumentation;
