
import React from 'react';
import ConnectionsOverviewSection from './Sections/ConnectionsOverviewSection';
import CaptivePortalMetricsSection from './Sections/CaptivePortalMetricsSection';

const CaptivePortalDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Portail Captif</h1>
      <CaptivePortalMetricsSection />
      <ConnectionsOverviewSection />
    </div>
  );
};

export default CaptivePortalDashboard;
