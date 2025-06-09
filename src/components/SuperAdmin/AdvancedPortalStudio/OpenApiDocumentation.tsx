
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Upload, 
  Play, 
  Code, 
  Eye,
  Copy,
  Globe,
  Settings,
  Book,
  Zap
} from 'lucide-react';

interface OpenApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description: string;
  parameters: Array<{
    name: string;
    in: 'query' | 'path' | 'header' | 'body';
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: Array<{
    status: number;
    description: string;
    schema?: string;
  }>;
  tags: string[];
}

const OpenApiDocumentation: React.FC = () => {
  const [endpoints, setEndpoints] = useState<OpenApiEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<OpenApiEndpoint | null>(null);
  const [apiInfo, setApiInfo] = useState({
    title: 'WiFi Sénégal Portal API',
    version: '1.0.0',
    description: 'API pour la gestion des portails captifs WiFi au Sénégal',
    baseUrl: 'https://api.wifi-senegal.com/v1',
  });
  const [activeTab, setActiveTab] = useState('endpoints');
  const { toast } = useToast();

  const generateOpenApiSpec = () => {
    const spec = {
      openapi: '3.0.3',
      info: {
        title: apiInfo.title,
        version: apiInfo.version,
        description: apiInfo.description,
      },
      servers: [
        {
          url: apiInfo.baseUrl,
          description: 'Serveur de production',
        }
      ],
      paths: endpoints.reduce((acc, endpoint) => {
        const path = endpoint.path;
        if (!acc[path]) acc[path] = {};
        
        acc[path][endpoint.method.toLowerCase()] = {
          summary: endpoint.summary,
          description: endpoint.description,
          tags: endpoint.tags,
          parameters: endpoint.parameters.map(param => ({
            name: param.name,
            in: param.in,
            required: param.required,
            description: param.description,
            schema: { type: param.type }
          })),
          responses: endpoint.responses.reduce((respAcc, resp) => {
            respAcc[resp.status] = {
              description: resp.description,
              content: resp.schema ? {
                'application/json': {
                  schema: JSON.parse(resp.schema || '{}')
                }
              } : undefined
            };
            return respAcc;
          }, {} as any)
        };
        
        return acc;
      }, {} as any),
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          },
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    };

    return spec;
  };

  const exportOpenApiSpec = () => {
    const spec = generateOpenApiSpec();
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${apiInfo.title.toLowerCase().replace(/\s+/g, '-')}-openapi.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Spécification exportée",
      description: "Le fichier OpenAPI a été téléchargé avec succès",
    });
  };

  const importOpenApiSpec = async (file: File) => {
    try {
      const text = await file.text();
      const spec = JSON.parse(text);
      
      // Parse OpenAPI spec and populate endpoints
      setApiInfo({
        title: spec.info?.title || 'API importée',
        version: spec.info?.version || '1.0.0',
        description: spec.info?.description || '',
        baseUrl: spec.servers?.[0]?.url || '',
      });

      toast({
        title: "Spécification importée",
        description: "L'API a été importée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur d'importation",
        description: "Impossible de lire le fichier OpenAPI",
        variant: "destructive",
      });
    }
  };

  const addNewEndpoint = () => {
    const newEndpoint: OpenApiEndpoint = {
      id: crypto.randomUUID(),
      path: '/api/example',
      method: 'GET',
      summary: 'Nouvel endpoint',
      description: 'Description de l\'endpoint',
      parameters: [],
      responses: [
        {
          status: 200,
          description: 'Succès',
          schema: '{"message": "string"}'
        }
      ],
      tags: ['general']
    };

    setEndpoints([...endpoints, newEndpoint]);
    setSelectedEndpoint(newEndpoint);
  };

  const methodColors = {
    GET: 'bg-green-100 text-green-800 border-green-200',
    POST: 'bg-blue-100 text-blue-800 border-blue-200',
    PUT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200',
    PATCH: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documentation OpenAPI</h3>
          <p className="text-sm text-muted-foreground">
            Générez et gérez la documentation de vos APIs automatiquement
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={addNewEndpoint}>
            <Zap className="h-4 w-4 mr-2" />
            Nouvel Endpoint
          </Button>
          <Button onClick={exportOpenApiSpec} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="testing">Tests API</TabsTrigger>
          <TabsTrigger value="codegen">Génération Code</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des endpoints */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Endpoints API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEndpoint?.id === endpoint.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedEndpoint(endpoint)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-xs ${methodColors[endpoint.method]}`}>
                        {endpoint.method}
                      </Badge>
                      <span className="font-mono text-sm">{endpoint.path}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{endpoint.summary}</p>
                  </div>
                ))}

                {endpoints.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun endpoint configuré</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration de l'endpoint */}
            {selectedEndpoint ? (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Configuration Endpoint</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Méthode HTTP</Label>
                      <Select 
                        value={selectedEndpoint.method} 
                        onValueChange={(value) => 
                          setSelectedEndpoint({...selectedEndpoint, method: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Chemin</Label>
                      <Input 
                        value={selectedEndpoint.path}
                        onChange={(e) => 
                          setSelectedEndpoint({...selectedEndpoint, path: e.target.value})
                        }
                        placeholder="/api/endpoint"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Résumé</Label>
                    <Input 
                      value={selectedEndpoint.summary}
                      onChange={(e) => 
                        setSelectedEndpoint({...selectedEndpoint, summary: e.target.value})
                      }
                      placeholder="Brève description de l'endpoint"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      value={selectedEndpoint.description}
                      onChange={(e) => 
                        setSelectedEndpoint({...selectedEndpoint, description: e.target.value})
                      }
                      placeholder="Description détaillée de l'endpoint"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <Input 
                      value={selectedEndpoint.tags.join(', ')}
                      onChange={(e) => 
                        setSelectedEndpoint({
                          ...selectedEndpoint, 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })
                      }
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="lg:col-span-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun endpoint sélectionné</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sélectionnez un endpoint existant ou créez-en un nouveau
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre de l'API</Label>
                  <Input 
                    value={apiInfo.title}
                    onChange={(e) => setApiInfo({...apiInfo, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Version</Label>
                  <Input 
                    value={apiInfo.version}
                    onChange={(e) => setApiInfo({...apiInfo, version: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>URL de Base</Label>
                <Input 
                  value={apiInfo.baseUrl}
                  onChange={(e) => setApiInfo({...apiInfo, baseUrl: e.target.value})}
                  placeholder="https://api.example.com/v1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={apiInfo.description}
                  onChange={(e) => setApiInfo({...apiInfo, description: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Interface de Test API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Interface de Test Swagger</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Testez vos endpoints directement depuis l'interface
                </p>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  Ouvrir Swagger UI
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codegen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Génération de Code Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="h-6 w-6 mb-2" />
                  JavaScript/TypeScript
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="h-6 w-6 mb-2" />
                  Python
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="h-6 w-6 mb-2" />
                  Java
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="h-6 w-6 mb-2" />
                  C#
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="h-6 w-6 mb-2" />
                  PHP
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="h-6 w-6 mb-2" />
                  Go
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpenApiDocumentation;
