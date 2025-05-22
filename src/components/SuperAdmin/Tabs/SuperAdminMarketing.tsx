
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { campaigns, Campaign, campaignChartData } from '../mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Plus } from 'lucide-react';

// Modal component for adding/editing campaigns
const CampaignModal = ({ 
  isOpen, 
  onClose, 
  campaign, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  campaign?: Campaign; 
  onSave: (campaign: Partial<Campaign>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    budget: campaign?.budget || 0,
    status: campaign?.status || 'active',
    type: campaign?.type || 'banner',
    targetZones: campaign?.targetZones || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'budget' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          {campaign ? 'Modifier Campagne' : 'Ajouter Campagne'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de la campagne
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium">
              Budget (FCFA)
            </label>
            <Input
              id="budget"
              name="budget"
              type="number"
              min="0"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="banner">Bannière</option>
              <option value="audio">Audio</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="active">Active</option>
              <option value="paused">En pause</option>
              <option value="completed">Terminée</option>
            </select>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {campaign ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuperAdminMarketing: React.FC = () => {
  const [marketingCampaigns, setMarketingCampaigns] = useState<Campaign[]>(campaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle modal save
  const handleSaveCampaign = (campaignData: Partial<Campaign>) => {
    if (currentCampaign) {
      // Edit existing campaign
      const updatedCampaigns = marketingCampaigns.map(c => 
        c.id === currentCampaign.id ? { ...c, ...campaignData } : c
      );
      setMarketingCampaigns(updatedCampaigns);
      toast({ 
        title: "Campagne modifiée", 
        description: `${campaignData.name} a été mis à jour avec succès.` 
      });
    } else {
      // Create new campaign
      const newCampaign: Campaign = {
        id: (marketingCampaigns.length + 1).toString(),
        name: campaignData.name || '',
        budget: campaignData.budget || 0,
        impressions: 0,
        clicks: 0,
        status: (campaignData.status as 'active' | 'completed' | 'paused') || 'active',
        startDate: new Date().toISOString().split('T')[0],
        type: campaignData.type || 'banner',
        targetZones: campaignData.targetZones || []
      };
      
      setMarketingCampaigns([...marketingCampaigns, newCampaign]);
      toast({ 
        title: "Campagne ajoutée", 
        description: `${newCampaign.name} a été ajoutée avec succès.` 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Marketing</h1>
        {user?.role === 'marketing' && (
          <Button onClick={() => {
            setCurrentCampaign(undefined);
            setIsModalOpen(true);
          }}>
            <Plus size={16} className="mr-2" />
            Nouvelle Campagne
          </Button>
        )}
      </div>
      
      {/* Campaign Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance des Campagnes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartComponent
              type="doughnut"
              data={{
                labels: campaignChartData.labels,
                datasets: campaignChartData.datasets
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Clics par Campagne'
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
              height={350}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes Marketing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Budget</th>
                  <th>Impressions</th>
                  <th>Clics</th>
                  <th>Taux de Clics</th>
                  <th>Statut</th>
                  <th>Date de Début</th>
                </tr>
              </thead>
              <tbody>
                {marketingCampaigns.map((campaign) => (
                  <tr key={campaign.id} onClick={() => {
                    if (user?.role === 'marketing') {
                      setCurrentCampaign(campaign);
                      setIsModalOpen(true);
                    }
                  }} className={user?.role === 'marketing' ? 'cursor-pointer' : ''}>
                    <td className="font-medium">{campaign.name}</td>
                    <td>{campaign.budget.toLocaleString()} FCFA</td>
                    <td>{campaign.impressions.toLocaleString()}</td>
                    <td>{campaign.clicks.toLocaleString()}</td>
                    <td>
                      {campaign.impressions > 0 
                        ? `${((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%` 
                        : '0%'}
                    </td>
                    <td>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${campaign.status === 'active' 
                            ? 'bg-success/20 text-success' 
                            : campaign.status === 'paused'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-muted/40 text-muted-foreground'
                          }`}
                      >
                        {campaign.status === 'active' ? 'Active' : 
                          campaign.status === 'paused' ? 'En pause' : 'Terminée'}
                      </span>
                    </td>
                    <td>
                      {new Date(campaign.startDate).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Campaign Modal */}
      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={currentCampaign}
        onSave={handleSaveCampaign}
      />
    </div>
  );
};

export default SuperAdminMarketing;
