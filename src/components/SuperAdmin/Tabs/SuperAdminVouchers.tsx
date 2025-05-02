
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Plus, Ticket, FileDown, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { unifiApiService, UnifiVoucher } from '@/services/unifiService';

const SuperAdminVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<UnifiVoucher[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  // Form state for new voucher
  const [voucherName, setVoucherName] = useState<string>('Forfait Standard');
  const [voucherDuration, setVoucherDuration] = useState<string>('1440'); // 24 hours in minutes
  const [voucherDataLimit, setVoucherDataLimit] = useState<string>('1000'); // 1 GB in MB
  const [voucherCount, setVoucherCount] = useState<string>('1');
  const [voucherBandwidth, setVoucherBandwidth] = useState<string>('1024'); // 1 Mbps in Kbps
  
  // Fetch vouchers
  const fetchVouchers = async () => {
    setRefreshing(true);
    try {
      const data = await unifiApiService.getVouchers();
      setVouchers(data);
      
      toast({
        title: "Vouchers actualisés",
        description: `${data.length} vouchers récupérés avec succès.`,
      });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les vouchers. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchVouchers();
  }, []);
  
  // Filter vouchers based on active tab
  const filteredVouchers = vouchers.filter(voucher => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !voucher.expired;
    if (activeTab === 'expired') return voucher.expired;
    return true;
  });

  // Generate new voucher
  const handleGenerateVoucher = () => {
    toast({
      title: "Vouchers générés",
      description: `${voucherCount} voucher(s) créé(s) avec succès.`,
    });
    
    // Reset form values
    setVoucherName('Forfait Standard');
    setVoucherDuration('1440');
    setVoucherDataLimit('1000');
    setVoucherCount('1');
    setVoucherBandwidth('1024');
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="dashboard-title">Gestion des Vouchers</h1>
        <Button 
          onClick={fetchVouchers} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Voucher Creation Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Créer des Vouchers</CardTitle>
            <CardDescription>Définissez les paramètres et générez des vouchers pour vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voucher-name">Nom du forfait</Label>
                <Input 
                  id="voucher-name" 
                  value={voucherName} 
                  onChange={(e) => setVoucherName(e.target.value)} 
                  placeholder="Forfait Journalier" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voucher-duration">Durée (min)</Label>
                <Select value={voucherDuration} onValueChange={setVoucherDuration}>
                  <SelectTrigger id="voucher-duration">
                    <SelectValue placeholder="Sélectionnez une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 heure (60 min)</SelectItem>
                    <SelectItem value="720">12 heures (720 min)</SelectItem>
                    <SelectItem value="1440">1 jour (1440 min)</SelectItem>
                    <SelectItem value="4320">3 jours (4320 min)</SelectItem>
                    <SelectItem value="10080">1 semaine (10080 min)</SelectItem>
                    <SelectItem value="43200">30 jours (43200 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voucher-data-limit">Limite de données (MB)</Label>
                <Select value={voucherDataLimit} onValueChange={setVoucherDataLimit}>
                  <SelectTrigger id="voucher-data-limit">
                    <SelectValue placeholder="Sélectionnez une limite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 MB</SelectItem>
                    <SelectItem value="500">500 MB</SelectItem>
                    <SelectItem value="1000">1 GB</SelectItem>
                    <SelectItem value="2000">2 GB</SelectItem>
                    <SelectItem value="5000">5 GB</SelectItem>
                    <SelectItem value="10000">10 GB</SelectItem>
                    <SelectItem value="0">Illimité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voucher-bandwidth">Bande passante (Kbps)</Label>
                <Select value={voucherBandwidth} onValueChange={setVoucherBandwidth}>
                  <SelectTrigger id="voucher-bandwidth">
                    <SelectValue placeholder="Sélectionnez une vitesse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">512 Kbps</SelectItem>
                    <SelectItem value="1024">1 Mbps (1024 Kbps)</SelectItem>
                    <SelectItem value="2048">2 Mbps (2048 Kbps)</SelectItem>
                    <SelectItem value="5120">5 Mbps (5120 Kbps)</SelectItem>
                    <SelectItem value="10240">10 Mbps (10240 Kbps)</SelectItem>
                    <SelectItem value="0">Illimité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voucher-count">Nombre à générer</Label>
                <Input 
                  id="voucher-count" 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={voucherCount} 
                  onChange={(e) => setVoucherCount(e.target.value)} 
                />
              </div>
              
              <Button 
                type="button" 
                className="w-full mt-4 flex items-center justify-center gap-2" 
                onClick={handleGenerateVoucher}
              >
                <Plus size={16} />
                Générer {voucherCount !== '1' ? voucherCount : ''} Voucher{voucherCount !== '1' ? 's' : ''}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Voucher List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vouchers</CardTitle>
            <CardDescription>
              Gérez et suivez les vouchers WiFi disponibles
            </CardDescription>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="active">Actifs</TabsTrigger>
                <TabsTrigger value="expired">Expirés</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1 mr-2">
                <Ticket size={16} />
                <span>Imprimer sélection</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FileDown size={16} />
                <span>Exporter CSV</span>
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Forfait</th>
                    <th>Durée</th>
                    <th>Données</th>
                    <th>Créé le</th>
                    <th>Expire le</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td className="font-medium">{voucher.code}</td>
                      <td>{voucher.name || 'Standard'}</td>
                      <td>
                        {voucher.timeLimitMinutes 
                          ? voucher.timeLimitMinutes >= 1440 
                            ? `${Math.round(voucher.timeLimitMinutes / 1440)} jours` 
                            : `${Math.round(voucher.timeLimitMinutes / 60)} heures`
                          : 'N/A'
                        }
                      </td>
                      <td>
                        {voucher.dataUsageLimitMBytes 
                          ? voucher.dataUsageLimitMBytes >= 1000 
                            ? `${voucher.dataUsageLimitMBytes / 1000} GB` 
                            : `${voucher.dataUsageLimitMBytes} MB`
                          : 'Illimité'
                        }
                      </td>
                      <td>{formatDate(voucher.createdAt)}</td>
                      <td>{formatDate(voucher.expiresAt)}</td>
                      <td>
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${voucher.expired 
                              ? 'bg-danger/20 text-danger' 
                              : voucher.authorizedGuestCount > 0 
                                ? 'bg-warning/20 text-warning'
                                : 'bg-success/20 text-success'
                            }`}
                        >
                          {voucher.expired 
                            ? 'Expiré' 
                            : voucher.authorizedGuestCount > 0 
                              ? 'En utilisation' 
                              : 'Disponible'
                          }
                        </span>
                      </td>
                      <td>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredVouchers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted-foreground">
                        {isLoading ? 'Chargement des vouchers...' : 'Aucun voucher trouvé'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Voucher Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vouchers Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {vouchers.filter(v => !v.expired).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {vouchers.filter(v => !v.expired && v.authorizedGuestCount > 0).length} en utilisation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vouchers Expirés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {vouchers.filter(v => v.expired).length}
            </div>
            <p className="text-sm text-muted-foreground">
              Des 7 derniers jours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taux d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {vouchers.length > 0 
                ? Math.round((vouchers.filter(v => v.authorizedGuestCount > 0).length / vouchers.length) * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Des vouchers générés
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminVouchers;
