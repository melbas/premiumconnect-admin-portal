
import React from 'react';
import AIDashboard from '@/components/AI/AIDashboard';
import { useAuth } from '@/context/AuthContext';

const SuperAdminAI: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intelligence Artificielle</h2>
          <p className="text-muted-foreground">
            Fonctionnalités IA avancées adaptées au marché africain
          </p>
        </div>
      </div>

      <AIDashboard userId={user?.id} language="fr" />
    </div>
  );
};

export default SuperAdminAI;
