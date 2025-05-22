
import React from 'react';
import ConnectionsOverviewSection from './Sections/ConnectionsOverviewSection';
import CaptivePortalMetricsSection from './Sections/CaptivePortalMetricsSection';
import UserActivitySection from './Sections/UserActivitySection';
import { useUserStatistics } from '@/hooks/use-user-statistics';

const CaptivePortalDashboard = () => {
  const { chartData } = useUserStatistics(30);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Portail Captif</h1>
      <CaptivePortalMetricsSection />
      <ConnectionsOverviewSection />
      <UserActivitySection chartData={chartData} />
    </div>
  );
};

export default CaptivePortalDashboard;
