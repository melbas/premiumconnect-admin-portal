
import React, { useState } from 'react';
import { users as mockWholesalers, UserData, sites } from '../mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Edit, Plus, Search, Trash, ExternalLink, Phone, Mail, User } from 'lucide-react';
import ChartComponent from '@/components/Dashboard/ChartComponent';

// Calculate performance score for wholesalers
const calculatePerformanceScore = (wholesaler: UserData) => {
  // Mock calculation based on revenue, users, and resolved issues
  const maxRevenue = 5000000; // Maximum possible revenue
  const maxUsers = 2000; // Maximum possible users
  const totalIssues = wholesaler.totalIssues || 10;
  const resolvedIssues = wholesaler.resolvedIssues || 5;
  
  const revenueScore = (wholesaler.revenue || 0) / maxRevenue * 40;
  const usersScore = (wholesaler.users || 0) / maxUsers * 30;
  const issueScore = resolvedIssues / totalIssues * 30;
  
  return Math.min(Math.round(revenueScore + usersScore + issueScore), 100);
};

// Modal component for viewing wholesaler profile
const WholesalerProfileModal = ({ 
  isOpen, 
  onClose, 
  wholesaler 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  wholesaler: UserData;
}) => {
  if (!isOpen || !wholesaler) return null;

  const performanceScore = calculatePerformanceScore(wholesaler);
  const assignedSite = sites.find(site => site.id === wholesaler.assignedSiteId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-background p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profil du Grossiste</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-muted mb-3">
                {wholesaler.avatar ? (
                  <img 
                    src={wholesaler.avatar} 
                    alt={wholesaler.name}
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-2xl">
                    {wholesaler.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium">{wholesaler.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{wholesaler.role}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-muted-foreground" />
                <span>{wholesaler.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-muted-foreground" />
                <span>{wholesaler.phone || "+221 78 123 4567"}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2 text-muted-foreground" />
                <span>ID: {wholesaler.id}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <h4 className="font-medium mb-1">Performance</h4>
              <div className="flex items-center space-x-2">
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      performanceScore >= 80 ? 'bg-success' : 
                      performanceScore >= 60 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${performanceScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{performanceScore}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {performanceScore >= 80 ? 'Excellent' : 
                 performanceScore >= 60 ? 'Bon' : 'Nécessite une amélioration'}
              </p>
            </div>
          </div>
          
          {/* Assigned Site Information */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Site Assigné</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignedSite ? (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">{assignedSite.name}</span>
                      <span className="text-sm text-muted-foreground">{assignedSite.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Utilisateurs</p>
                        <p className="font-medium">{assignedSite.users?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Revenu Mensuel</p>
                        <p className="font-medium">{assignedSite.revenue?.toLocaleString()} FCFA</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Disponibilité</p>
                        <p className="font-medium">{assignedSite.uptime}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Problèmes</p>
                        <p className="font-medium">{assignedSite.issues}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Aucun site assigné</p>
                )}
              </CardContent>
            </Card>
            
            {/* Revenue History */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Historique de Revenu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ChartComponent
                    type="line"
                    data={{
                      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                      datasets: [{
                        label: 'Revenu (FCFA)',
                        data: [
                          Math.floor(Math.random() * 500000) + 200000,
                          Math.floor(Math.random() * 500000) + 200000,
                          Math.floor(Math.random() * 500000) + 200000,
                          Math.floor(Math.random() * 500000) + 200000,
                          Math.floor(Math.random() * 500000) + 200000,
                          Math.floor(Math.random() * 500000) + 200000,
                        ],
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.3
                      }]
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return value.toLocaleString() + ' FCFA';
                            }
                          }
                        }
                      }
                    }}
                    height={200}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Informations Supplémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p>{wholesaler.bio || "Grossiste responsable de la gestion du site et des clients dans la région."}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Dernière Connexion</p>
                  <p>{new Date(wholesaler.lastActive).toLocaleString('fr-FR')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal component for adding/editing wholesalers
const WholesalerModal = ({ 
  isOpen, 
  onClose, 
  wholesaler, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  wholesaler?: UserData; 
  onSave: (wholesaler: Partial<UserData>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: wholesaler?.name || '',
    email: wholesaler?.email || '',
    phone: wholesaler?.phone || '',
    role: wholesaler?.role || 'technical',
    assignedSiteId: wholesaler?.assignedSiteId || '',
    bio: wholesaler?.bio || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold">
          {wholesaler ? 'Modifier Grossiste' : 'Ajouter Grossiste'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom
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
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Téléphone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+221 78 123 4567"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="superadmin">Super Admin</option>
              <option value="marketing">Marketing</option>
              <option value="technical">Technique</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="assignedSiteId" className="block text-sm font-medium">
              Site Assigné
            </label>
            <select
              id="assignedSiteId"
              name="assignedSiteId"
              value={formData.assignedSiteId}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">-- Sélectionner un site --</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.location})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {wholesaler ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Wholesalers component
const SuperAdminWholesalers: React.FC = () => {
  const [wholesalers, setWholesalers] = useState<UserData[]>(() => 
    mockWholesalers.map(user => ({
      ...user,
      revenue: Math.floor(Math.random() * 3000000) + 500000,
      users: Math.floor(Math.random() * 1500) + 250,
      totalIssues: Math.floor(Math.random() * 15) + 5,
      resolvedIssues: Math.floor(Math.random() * 10) + 2,
      assignedSiteId: ['1', '2', '3', '4', '5'][Math.floor(Math.random() * 5)]
    }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentWholesaler, setCurrentWholesaler] = useState<UserData | undefined>(undefined);
  const [selectedWholesaler, setSelectedWholesaler] = useState<UserData | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get top wholesalers by revenue for chart
  const topWholesalers = [...wholesalers]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  // Filter wholesalers based on search term
  const filteredWholesalers = wholesalers.filter(wholesaler => 
    wholesaler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wholesaler.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle modal save
  const handleSaveWholesaler = (wholesalerData: Partial<UserData>) => {
    if (currentWholesaler) {
      // Edit existing wholesaler
      const updatedWholesalers = wholesalers.map(w => 
        w.id === currentWholesaler.id ? { ...w, ...wholesalerData } : w
      );
      setWholesalers(updatedWholesalers);
      toast({ 
        title: "Grossiste modifié", 
        description: `${wholesalerData.name} a été mis à jour avec succès.` 
      });
    } else {
      // Create new wholesaler
      const newWholesaler: UserData = {
        id: (wholesalers.length + 1).toString(),
        name: wholesalerData.name || '',
        email: wholesalerData.email || '',
        role: (wholesalerData.role as 'superadmin' | 'marketing' | 'technical') || 'technical',
        lastActive: new Date().toISOString(),
        status: 'active',
        avatar: `https://i.pravatar.cc/150?img=${wholesalers.length + 10}`,
        phone: wholesalerData.phone,
        assignedSiteId: wholesalerData.assignedSiteId,
        bio: wholesalerData.bio,
        revenue: Math.floor(Math.random() * 3000000) + 500000,
        users: Math.floor(Math.random() * 1500) + 250,
        totalIssues: Math.floor(Math.random() * 15) + 5,
        resolvedIssues: Math.floor(Math.random() * 10) + 2,
      };
      
      setWholesalers([...wholesalers, newWholesaler]);
      toast({ 
        title: "Grossiste ajouté", 
        description: `${newWholesaler.name} a été ajouté avec succès.` 
      });
    }
  };

  // Handle wholesaler edit
  const handleEditWholesaler = (wholesaler: UserData) => {
    setCurrentWholesaler(wholesaler);
    setIsModalOpen(true);
  };

  // Handle wholesaler delete
  const handleDeleteWholesaler = (id: string) => {
    setWholesalers(wholesalers.filter(wholesaler => wholesaler.id !== id));
    toast({ 
      title: "Grossiste supprimé", 
      description: "Le grossiste a été supprimé avec succès." 
    });
  };

  // Handle wholesaler status toggle
  const handleToggleStatus = (id: string) => {
    setWholesalers(wholesalers.map(wholesaler => 
      wholesaler.id === id
        ? { ...wholesaler, status: wholesaler.status === 'active' ? 'inactive' : 'active' }
        : wholesaler
    ));
    
    const wholesaler = wholesalers.find(w => w.id === id);
    const newStatus = wholesaler?.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: `Grossiste ${newStatus === 'active' ? 'activé' : 'suspendu'}`,
      description: `Le compte de ${wholesaler?.name} a été ${newStatus === 'active' ? 'activé' : 'suspendu'}.`,
      variant: newStatus === 'active' ? 'default' : 'destructive'
    });
  };

  // Handle viewing wholesaler profile
  const handleViewProfile = (wholesaler: UserData) => {
    setSelectedWholesaler(wholesaler);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Gestion des Grossistes</h1>
        {user?.role === 'superadmin' && (
          <Button onClick={() => {
            setCurrentWholesaler(undefined);
            setIsModalOpen(true);
          }}>
            <Plus size={16} className="mr-2" />
            Ajouter Grossiste
          </Button>
        )}
      </div>
      
      {/* Wholesaler charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Wholesalers by Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Grossistes par Revenu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartComponent
                type="bar"
                data={{
                  labels: topWholesalers.map(w => w.name),
                  datasets: [{
                    label: 'Revenu (FCFA)',
                    data: topWholesalers.map(w => w.revenue || 0),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)'
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        callback: function(value) {
                          return (value as number).toLocaleString() + ' FCFA';
                        }
                      }
                    }
                  }
                }}
                height={250}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Wholesaler Distribution by Site */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Grossistes par Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartComponent
                type="doughnut"
                data={{
                  labels: sites.map(site => site.name),
                  datasets: [{
                    label: 'Grossistes',
                    data: sites.map(site => 
                      wholesalers.filter(w => w.assignedSiteId === site.id).length
                    ),
                    backgroundColor: [
                      'rgba(37, 99, 235, 0.7)',
                      'rgba(239, 68, 68, 0.7)',
                      'rgba(16, 185, 129, 0.7)',
                      'rgba(245, 158, 11, 0.7)',
                      'rgba(139, 92, 246, 0.7)',
                      'rgba(236, 72, 153, 0.7)',
                      'rgba(14, 165, 233, 0.7)'
                    ]
                  }]
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
                height={250}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Grossistes</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher les grossistes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Site Assigné</th>
                  <th>Revenu</th>
                  <th>Performance</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWholesalers.map((wholesaler) => {
                  const performanceScore = calculatePerformanceScore(wholesaler);
                  const assignedSite = sites.find(site => site.id === wholesaler.assignedSiteId);
                  
                  return (
                    <tr key={wholesaler.id}>
                      <td className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 overflow-hidden rounded-full">
                            {wholesaler.avatar && (
                              <img 
                                src={wholesaler.avatar}
                                alt={wholesaler.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          {wholesaler.name}
                        </div>
                      </td>
                      <td>{wholesaler.email}</td>
                      <td>{wholesaler.phone || "+221 78 123 4567"}</td>
                      <td>{assignedSite ? assignedSite.name : "--"}</td>
                      <td>{(wholesaler.revenue || 0).toLocaleString()} FCFA</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div 
                              className={`h-full ${
                                performanceScore >= 80 ? 'bg-success' : 
                                performanceScore >= 60 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${performanceScore}%` }}
                            ></div>
                          </div>
                          <span>{performanceScore}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${wholesaler.status === 'active' 
                              ? 'bg-success/20 text-success' 
                              : 'bg-danger/20 text-danger'}`}
                        >
                          {wholesaler.status === 'active' ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewProfile(wholesaler)}
                          >
                            <ExternalLink size={14} />
                          </Button>
                          {user?.role === 'superadmin' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditWholesaler(wholesaler)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant={wholesaler.status === 'active' ? 'destructive' : 'default'}
                                size="sm" 
                                onClick={() => handleToggleStatus(wholesaler.id)}
                              >
                                {wholesaler.status === 'active' ? 'Suspendre' : 'Activer'}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteWholesaler(wholesaler.id)}
                              >
                                <Trash size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Wholesaler Modal */}
      <WholesalerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wholesaler={currentWholesaler}
        onSave={handleSaveWholesaler}
      />
      
      {/* Profile Modal */}
      {selectedWholesaler && (
        <WholesalerProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          wholesaler={selectedWholesaler}
        />
      )}
    </div>
  );
};

export default SuperAdminWholesalers;
