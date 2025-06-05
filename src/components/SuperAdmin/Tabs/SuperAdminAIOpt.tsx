
import React, { useState } from 'react';
import { sites } from '../mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import AIOptimizationDashboard from './AIOpt/AIOptimizationDashboard';

const SuperAdminAIOpt: React.FC = () => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Optimisation IA</h1>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Sélectionner un site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name} - {site.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AIOptimizationDashboard 
        selectedSiteId={selectedSiteId} 
        sites={sites} 
      />
    </div>
  );
};

export default SuperAdminAIOpt;
