import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Users, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  Mail
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const requestSchema = z.object({
  requestType: z.enum(['access', 'rectification', 'erasure', 'portability', 'objection', 'restriction']),
  userEmail: z.string().email('Email invalide'),
  userPhone: z.string().min(8, 'Numéro de téléphone requis'),
  description: z.string().min(10, 'Description requis (minimum 10 caractères)'),
  urgency: z.enum(['low', 'medium', 'high']),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface DataRequest {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: string;
  completedAt?: string;
  description: string;
  response?: string;
}

interface DataRightsManagerProps {
  trigger?: React.ReactNode;
  userEmail?: string;
  userPhone?: string;
}

const DataRightsManager: React.FC<DataRightsManagerProps> = ({
  trigger,
  userEmail = '',
  userPhone = ''
}) => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      userEmail,
      userPhone,
      description: '',
      urgency: 'medium',
    },
  });

  const requestTypes = [
    {
      id: 'access',
      title: 'Droit d\'accès',
      description: 'Obtenir une copie de toutes vos données personnelles',
      icon: Eye,
      color: 'bg-blue-500',
      estimatedTime: '15 jours',
      details: 'Nous vous fournirons un rapport complet de toutes les données que nous détenons sur vous.'
    },
    {
      id: 'rectification',
      title: 'Droit de rectification',
      description: 'Corriger vos informations incorrectes ou incomplètes',
      icon: Edit,
      color: 'bg-green-500',
      estimatedTime: '5 jours',
      details: 'Demandez la correction de données inexactes ou la mise à jour d\'informations obsolètes.'
    },
    {
      id: 'erasure',
      title: 'Droit à l\'effacement',
      description: 'Supprimer définitivement vos données personnelles',
      icon: Trash2,
      color: 'bg-red-500',
      estimatedTime: '30 jours',
      details: 'Suppression complète de vos données (sauf obligations légales de conservation).'
    },
    {
      id: 'portability',
      title: 'Droit à la portabilité',
      description: 'Récupérer vos données dans un format exploitable',
      icon: Download,
      color: 'bg-purple-500',
      estimatedTime: '15 jours',
      details: 'Obtenez vos données dans un format structuré pour les transférer ailleurs.'
    },
    {
      id: 'objection',
      title: 'Droit d\'opposition',
      description: 'Vous opposer à certains traitements de vos données',
      icon: Shield,
      color: 'bg-orange-500',
      estimatedTime: '10 jours',
      details: 'Refusez que vos données soient utilisées à des fins spécifiques (marketing, etc.).'
    },
    {
      id: 'restriction',
      title: 'Droit de limitation',
      description: 'Limiter le traitement de vos données',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      estimatedTime: '10 jours',
      details: 'Demandez que le traitement de vos données soit temporairement suspendu.'
    }
  ];

  const handleSubmitRequest = async (data: RequestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRequest: DataRequest = {
        id: `req-${Date.now()}`,
        type: data.requestType,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        description: data.description
      };
      
      setRequests(prev => [newRequest, ...prev]);
      
      toast({
        title: "Demande soumise avec succès",
        description: `Votre demande de ${requestTypes.find(t => t.id === data.requestType)?.title} a été enregistrée.`,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: DataRequest['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
      processing: { label: 'En cours', variant: 'default' as const, icon: Clock },
      completed: { label: 'Terminé', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejeté', variant: 'destructive' as const, icon: AlertTriangle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Users className="h-4 w-4 mr-2" />
      Mes droits RGPD
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion de vos droits sur les données
          </DialogTitle>
          <DialogDescription>
            Exercez vos droits conformément au RGPD et à la loi sénégalaise sur la protection des données.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="new-request" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-request">Nouvelle demande</TabsTrigger>
            <TabsTrigger value="my-requests">Mes demandes ({requests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new-request" className="space-y-6">
            {/* Types de demandes disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = form.watch('requestType') === type.id;
                
                return (
                  <Card 
                    key={type.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => form.setValue('requestType', type.id as any)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${type.color} p-2 rounded-lg text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{type.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {type.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Formulaire de demande */}
            {form.watch('requestType') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {requestTypes.find(t => t.id === form.watch('requestType'))?.title}
                  </CardTitle>
                  <CardDescription>
                    {requestTypes.find(t => t.id === form.watch('requestType'))?.details}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitRequest)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="userEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="votre@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="userPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="+221 XX XXX XX XX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priorité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez la priorité" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Faible - Traitement standard</SelectItem>
                                <SelectItem value="medium">Moyenne - Traitement prioritaire</SelectItem>
                                <SelectItem value="high">Élevée - Traitement urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description détaillée</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez précisément votre demande..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Plus votre demande est précise, plus nous pourrons y répondre rapidement.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Nous traiterons votre demande dans les délais légaux. Un email de confirmation vous sera envoyé.
                        </AlertDescription>
                      </Alert>

                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Aucune demande</h3>
                  <p className="text-muted-foreground">Vous n'avez pas encore soumis de demande.</p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => {
                const requestType = requestTypes.find(t => t.id === request.type);
                const Icon = requestType?.icon || FileText;
                
                return (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`${requestType?.color || 'bg-gray-500'} p-2 rounded-lg text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{requestType?.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Soumise le {new Date(request.submittedAt).toLocaleDateString()}</span>
                              {request.completedAt && (
                                <span>• Terminée le {new Date(request.completedAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      {request.response && (
                        <Alert className="mt-4">
                          <Mail className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Réponse :</strong> {request.response}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DataRightsManager;