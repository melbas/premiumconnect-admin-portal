
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CaptivePortalUserInterface } from '@/components/CaptivePortal';

const Portal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const configId = searchParams.get('config') || 'default';

  const handleConnect = () => {
    // Redirection ou logique de connexion WiFi
    console.log('WiFi connection established');
  };

  return (
    <CaptivePortalUserInterface 
      configId={configId}
      onConnect={handleConnect}
    />
  );
};

export default Portal;
