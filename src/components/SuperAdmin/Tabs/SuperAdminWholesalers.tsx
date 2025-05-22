
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockWholesalers } from '../mockData/wholesalers';
import { sites } from '../mockData/sites';
import { UserData } from '../mockData/users';
import { useAuth } from '@/context/AuthContext';

import {
  Phone,
  Mail,
  User,
  ExternalLink,
  Edit,
  Trash,
  Plus,
  Search,
  ChevronDown,
  Info
} from 'lucide-react';

const WholesalerDetail = ({ wholesaler }: { wholesaler: UserData }) => {
  // Format the last active date for better readability
  const lastActive = new Date(wholesaler.lastActive).toLocaleString();
  
  // Find the site name if assigned
  const assignedSite = wholesaler.assignedSiteId 
    ? sites.find(site => site.id === wholesaler.assignedSiteId)?.name || 'Site inconnu' 
    : 'Non assigné';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={32} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{wholesaler.name}</h2>
          <p className="text-muted-foreground">{wholesaler.role === 'technical' ? 'Grossiste' : wholesaler.role}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Mail size={16} className="mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <Phone size={16} className="mr-2" />
            Appeler
          </Button>
          <Button size="sm">
            <User size={16} className="mr-2" />
            Profil
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Site Assigné</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{assignedSite}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{wholesaler.revenue?.toLocaleString()} FCFA</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{wholesaler.users || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom Complet</p>
                <p>{wholesaler.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{wholesaler.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p>{wholesaler.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dernière Activité</p>
                <p>{lastActive}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${wholesaler.status === 'active' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}
                  >
                    {wholesaler.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Problèmes</p>
                <p>{wholesaler.resolvedIssues || 0} résolus sur {wholesaler.totalIssues || 0}</p>
              </div>
            </div>
            
            {wholesaler.bio && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Biographie</p>
                <p className="text-sm">{wholesaler.bio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Performance</CardTitle>
          <CardDescription>Revenu sur les 3 derniers mois</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[200px]">
            {/* Placeholder chart - In a real app, you would use actual data */}
            <ChartComponent
              type="line"
              data={{
                labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
                datasets: [
                  {
                    label: 'Revenu (FCFA)',
                    data: [350000, 410000, 380000, 450000, 420000, wholesaler.revenue || 0],
                    borderColor: 'rgba(37, 99, 235, 0.7)',
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    fill: true,
                    tension: 0.4
                  }
                ]
              }}
              height={200}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WholesalersTable = ({ 
  wholesalers, 
  onSelect,
  onEdit,
  onDelete
}: { 
  wholesalers: UserData[],
  onSelect: (wholesaler: UserData) => void,
  onEdit: (wholesaler: UserData) => void,
  onDelete: (id: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter wholesalers based on search term
  const filteredWholesalers = wholesalers.filter(
    w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         w.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Grossistes</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border mt-4">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Site</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Revenu</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWholesalers.length > 0 ? (
                filteredWholesalers.map((wholesaler) => {
                  // Find site name if assigned
                  const siteName = wholesaler.assignedSiteId
                    ? sites.find(site => site.id === wholesaler.assignedSiteId)?.name || 'Site inconnu'
                    : '-';
                  
                  return (
                    <tr key={wholesaler.id} className="border-t">
                      <td className="p-3 cursor-pointer" onClick={() => onSelect(wholesaler)}>
                        <div className="font-medium">{wholesaler.name}</div>
                      </td>
                      <td className="p-3">{wholesaler.email}</td>
                      <td className="p-3">{siteName}</td>
                      <td className="p-3">
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${wholesaler.status === 'active' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}
                        >
                          {wholesaler.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="p-3">{wholesaler.revenue?.toLocaleString()} FCFA</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onSelect(wholesaler)}
                          >
                            <ExternalLink size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onEdit(wholesaler)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => onDelete(wholesaler.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    Aucun grossiste trouvé avec le terme de recherche
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface WholesalerFormData {
  name: string;
  email: string;
  phone: string;
  assignedSiteId: string;
  status: 'active' | 'inactive';
  bio: string;
}

const SuperAdminWholesalers: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedWholesaler, setSelectedWholesaler] = useState<UserData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<WholesalerFormData>({
    name: '',
    email: '',
    phone: '',
    assignedSiteId: '',
    status: 'active',
    bio: ''
  });
  
  const handleSelectWholesaler = (wholesaler: UserData) => {
    setSelectedWholesaler(wholesaler);
    setActiveTab("detail");
  };
  
  const handleEditWholesaler = (wholesaler: UserData) => {
    setFormData({
      name: wholesaler.name,
      email: wholesaler.email,
      phone: wholesaler.phone || '',
      assignedSiteId: wholesaler.assignedSiteId || '',
      status: wholesaler.status,
      bio: wholesaler.bio || ''
    });
    setIsAddDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (id: string) => {
    setToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteWholesaler = () => {
    if (!toDeleteId) return;
    
    // In a real app, this would involve an API call
    console.log(`Deleting wholesaler with ID ${toDeleteId}`);
    
    setIsDeleteDialogOpen(false);
    setToDeleteId(null);
  };
  
  const handleAddWholesaler = () => {
    // In a real app, this would be an API call
    console.log("Adding new wholesaler:", formData);
    
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      assignedSiteId: '',
      status: 'active',
      bio: ''
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Grossistes</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un grossiste
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste des grossistes</TabsTrigger>
          {selectedWholesaler && (
            <TabsTrigger value="detail">Détails du grossiste</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="list" className="w-full">
          <WholesalersTable 
            wholesalers={mockWholesalers}
            onSelect={handleSelectWholesaler}
            onEdit={handleEditWholesaler}
            onDelete={handleOpenDeleteDialog}
          />
        </TabsContent>
        
        <TabsContent value="detail">
          {selectedWholesaler && <WholesalerDetail wholesaler={selectedWholesaler} />}
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Wholesaler Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un grossiste</DialogTitle>
            <DialogDescription>
              Remplissez les champs pour ajouter un nouveau grossiste au système.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site">Site assigné</Label>
                <Select 
                  value={formData.assignedSiteId} 
                  onValueChange={(value) => setFormData({...formData, assignedSiteId: value})}
                >
                  <SelectTrigger id="site">
                    <SelectValue placeholder="Sélectionner un site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Notes</Label>
              <Input 
                id="bio" 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddWholesaler}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce grossiste ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteWholesaler}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminWholesalers;
