
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  MapPin,
  BarChart,
  AlertTriangle,
  Users
} from 'lucide-react';

// Recent Activity component
const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, description: "Nouveau site créé: Kaolack Est", time: "Il y a 30 minutes", type: "site" },
    { id: 2, description: "Campagne approuvée: Promo Ramadan", time: "Il y a 2 heures", type: "marketing" },
    { id: 3, description: "Problème résolu: Instabilité réseau à Thiès", time: "Il y a 5 heures", type: "technical" },
    { id: 4, description: "Nouveau grossiste ajouté: Fatou Ndiaye", time: "Il y a 1 jour", type: "wholesaler" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "site":
        return <MapPin size={18} className="text-primary" />;
      case "marketing":
        return <BarChart size={18} className="text-success" />;
      case "technical":
        return <AlertTriangle size={18} className="text-warning" />;
      case "wholesaler":
        return <Users size={18} className="text-secondary" />;
      default:
        return <Users size={18} className="text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
        <CardDescription>Les dernières actions effectuées sur le tableau de bord</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="p-2 bg-background rounded-full border border-border">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
