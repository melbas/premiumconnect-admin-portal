
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  UserPlus,
  BarChart,
  MessageCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Quick Actions component
const QuickActions: React.FC = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `Action déclenchée`,
      description: `Vous avez sélectionné l'action: ${action}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
        <CardDescription>Accès rapide aux actions courantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Créer un site")}
          >
            <PlusCircle size={16} />
            <span>Créer un site</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Ajouter un grossiste")}
          >
            <UserPlus size={16} />
            <span>Ajouter un grossiste</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Lancer une campagne")}
          >
            <BarChart size={16} />
            <span>Lancer une campagne</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Accéder au Chat IA")}
          >
            <MessageCircle size={16} />
            <span>Chat IA Support</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
