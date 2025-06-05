
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wifi } from 'lucide-react';

const LoginHeader: React.FC = () => {
  return (
    <CardHeader className="space-y-1 pb-4">
      <div className="flex items-center justify-center mb-4">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <Wifi className="h-6 w-6 text-white" />
        </div>
      </div>
      <CardTitle className="text-2xl text-center font-bold">WiFi Sénégal</CardTitle>
      <CardDescription className="text-center">
        Accédez au tableau de bord administrateur
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
