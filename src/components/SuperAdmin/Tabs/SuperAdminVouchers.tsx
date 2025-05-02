
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Plus, Ticket, FileDown, Trash2, Search, Check, Printer, Copy, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { unifiApiService, UnifiVoucher } from '@/services/unifiService';
import ChartComponent from '@/components/Dashboard/ChartComponent';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SuperAdminVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<UnifiVoucher[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const { toast } = useToast();

  // Form state for new voucher
  const [voucherName, setVoucherName] = useState<string>('Forfait Standard');
  const [voucherDuration, setVoucherDuration] = useState<string>('1440'); // 24 hours in minutes
  const [voucherDataLimit, setVoucherDataLimit] = useState<string>('1000'); // 1 GB in MB
  const [voucherCount, setVoucherCount] = useState<string>('1');
  const [voucherBandwidth, setVoucherBandwidth] = useState<string>('1024'); // 1 Mbps in Kbps
  const [printCodes, setPrintCodes] = useState<boolean>(true);
  const [notifyBySMS, setNotifyBySMS] = useState<boolean>(false);
  const [multiUse, setMultiUse] = useState<boolean>(false);
  
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
  
  // Filter vouchers based on active tab and search term
  const filteredVouchers = vouchers
    .filter(voucher => {
      // Filter by tab
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return !voucher.expired;
      if (activeTab === 'expired') return voucher.expired;
      return true;
    })
    .filter(voucher => {
      // Filter by search
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        (voucher.name && voucher.name.toLowerCase().includes(searchLower)) ||
        voucher.code.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort vouchers
      if (sortBy === 'createdAt') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      if (sortBy === 'expiresAt') {
        const aTime = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
        const bTime = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
        
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      if (sortBy === 'duration') {
        const aDuration = a.timeLimitMinutes || 0;
        const bDuration = b.timeLimitMinutes || 0;
        
        return sortDirection === 'asc' ? aDuration - bDuration : bDuration - aDuration;
      }
      
      if (sortBy === 'usage') {
        const aUsage = a.authorizedGuestCount / (a.authorizeGuestLimit || 1);
        const bUsage = b.authorizedGuestCount / (b.authorizeGuestLimit || 1);
        
        return sortDirection === 'asc' ? aUsage - bUsage : bUsage - aUsage;
      }
      
      return 0;
    });

  // Generate new voucher
  const handleGenerateVoucher = () => {
    // Generate random codes for demo
    const generateRandomCode = () => {
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    
    const count = parseInt(voucherCount, 10);
    const newVouchers = Array(count).fill(null).map((_, index) => {
      const now = new Date();
      const durationMinutes = parseInt(voucherDuration, 10);
      const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();
      
      return {
        id: `v${Date.now()}-${index}`,
        createdAt: now.toISOString(),
        name: voucherName,
        code: generateRandomCode(),
        authorizeGuestLimit: multiUse ? 5 : 1,
        authorizedGuestCount: 0,
        activeAt: undefined,
        expiresAt: expiresAt,
        expired: false,
        timeLimitMinutes: durationMinutes,
        dataUsageLimitMBytes: parseInt(voucherDataLimit, 10),
        rxRateLimitKBps: parseInt(voucherBandwidth, 10),
        txRateLimitKBps: parseInt(voucherBandwidth, 10)
      };
    });
    
    setVouchers([...newVouchers, ...vouchers]);
    
    toast({
      title: "Vouchers générés",
      description: `${count} voucher(s) créé(s) avec succès.`,
    });
    
    if (printCodes) {
      toast({
        title: "Impression préparée",
        description: `Les codes sont prêts pour impression.`,
      });
    }
    
    if (notifyBySMS) {
      toast({
        title: "Notifications SMS",
        description: `Les notifications SMS seraient envoyées dans un environnement de production.`,
      });
    }
    
    // Reset form values
    setVoucherName('Forfait Standard');
    setVoucherDuration('1440');
    setVoucherDataLimit('1000');
    setVoucherCount('1');
    setVoucherBandwidth('1024');
  };
  
  // Delete voucher
  const handleDeleteVoucher = (voucherId: string) => {
    setVouchers(vouchers.filter(v => v.id !== voucherId));
    
    toast({
      title: "Voucher supprimé",
      description: "Le voucher a été supprimé avec succès.",
    });
  };
  
  // Delete selected vouchers
  const handleDeleteSelected = () => {
    if (selectedVouchers.length === 0) return;
    
    setVouchers(vouchers.filter(v => !selectedVouchers.includes(v.id)));
    setSelectedVouchers([]);
    
    toast({
      title: "Vouchers supprimés",
      description: `${selectedVouchers.length} voucher(s) supprimé(s) avec succès.`,
    });
  };
  
  // Print selected vouchers
  const handlePrintSelected = () => {
    if (selectedVouchers.length === 0) return;
    
    toast({
      title: "Impression lancée",
      description: `${selectedVouchers.length} voucher(s) envoyé(s) à l'imprimante.`,
    });
  };
  
  // Toggle voucher selection
  const toggleVoucherSelection = (voucherId: string) => {
    setSelectedVouchers(prev => 
      prev.includes(voucherId)
        ? prev.filter(id => id !== voucherId)
        : [...prev, voucherId]
    );
  };
  
  // Toggle all vouchers selection
  const toggleAllVouchers = () => {
    if (selectedVouchers.length === filteredVouchers.length) {
      setSelectedVouchers([]);
    } else {
      setSelectedVouchers(filteredVouchers.map(v => v.id));
    }
  };
  
  // Copy voucher code
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    
    toast({
      title: "Code copié",
      description: "Le code du voucher a été copié dans le presse-papier.",
    });
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

  // Get usage statistics
  const getUsageStatistics = () => {
    const total = vouchers.length;
    const active = vouchers.filter(v => !v.expired).length;
    const expired = vouchers.filter(v => v.expired).length;
    const unused = vouchers.filter(v => !v.expired && v.authorizedGuestCount === 0).length;
    const partiallyUsed = vouchers.filter(v => !v.expired && v.authorizedGuestCount > 0 && v.authorizedGuestCount < v.authorizeGuestLimit).length;
    const fullyUsed = vouchers.filter(v => !v.expired && v.authorizedGuestCount === v.authorizeGuestLimit).length;
    
    // Usage rate
    const usageRate = total > 0 
      ? Math.round((vouchers.filter(v => v.authorizedGuestCount > 0).length / total) * 100)
      : 0;
      
    return { total, active, expired, unused, partiallyUsed, fullyUsed, usageRate };
  };
  
  const stats = getUsageStatistics();

  // Chart data for voucher statistics
  const voucherStatusChartData = {
    labels: ['Non utilisés', 'Partiellement utilisés', 'Complètement utilisés', 'Expirés'],
    datasets: [
      {
        label: 'Status des Vouchers',
        data: [stats.unused, stats.partiallyUsed, stats.fullyUsed, stats.expired],
        backgroundColor: [
          'rgba(10, 179, 156, 0.6)',  // teal for unused
          'rgba(255, 159, 64, 0.6)',  // orange for partially used
          'rgba(54, 162, 235, 0.6)',  // blue for fully used 
          'rgba(170, 170, 170, 0.6)', // gray for expired
        ],
        borderColor: [
          'rgb(10, 179, 156)',
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)',
          'rgb(170, 170, 170)',
        ],
        borderWidth: 1,
      }
    ],
  };
  
  // Chart data for daily voucher creation
  const getLast7DaysVoucherData = () => {
    const dates = [];
    const counts = [];
    
    // Get dates for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }));
      
      // Count vouchers created on this date
      const count = vouchers.filter(voucher => {
        const createdDate = new Date(voucher.createdAt);
        return (
          createdDate.getDate() === date.getDate() &&
          createdDate.getMonth() === date.getMonth() &&
          createdDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      counts.push(count);
    }
    
    return { dates, counts };
  };
  
  const dailyData = getLast7DaysVoucherData();
  
  const voucherCreationChartData = {
    labels: dailyData.dates,
    datasets: [
      {
        label: 'Vouchers créés',
        data: dailyData.counts,
        backgroundColor: 'rgba(101, 116, 205, 0.6)',
        borderColor: 'rgba(101, 116, 205, 1)',
        borderWidth: 2,
        tension: 0.2,
        fill: true,
      }
    ],
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
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="print-codes" className="cursor-pointer">Imprimer les codes</Label>
                  <Switch 
                    id="print-codes" 
                    checked={printCodes}
                    onCheckedChange={setPrintCodes}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-sms" className="cursor-pointer">Notifier par SMS</Label>
                  <Switch 
                    id="notify-sms" 
                    checked={notifyBySMS}
                    onCheckedChange={setNotifyBySMS}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="multi-use" className="cursor-pointer">Multi-utilisateurs (5)</Label>
                  <Switch 
                    id="multi-use" 
                    checked={multiUse}
                    onCheckedChange={setMultiUse}
                  />
                </div>
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
                <TabsTrigger value="active">
                  Actifs
                  <Badge variant="outline" className="ml-1 bg-success/20 text-success">{stats.active}</Badge>
                </TabsTrigger>
                <TabsTrigger value="expired">
                  Expirés
                  <Badge variant="outline" className="ml-1">{stats.expired}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un voucher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                {selectedVouchers.length > 0 && (
                  <>
                    <Badge variant="outline">{selectedVouchers.length} sélectionné(s)</Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 size={16} />
                      <span>Supprimer</span>
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handlePrintSelected}
                  disabled={selectedVouchers.length === 0}
                >
                  <Printer size={16} />
                  <span>Imprimer</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileDown size={16} />
                  <span>Exporter CSV</span>
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 h-4 w-4"
                          checked={selectedVouchers.length === filteredVouchers.length && filteredVouchers.length > 0}
                          onChange={toggleAllVouchers}
                        />
                        Code
                      </div>
                    </th>
                    <th>Forfait</th>
                    <th>
                      <button 
                        className="flex items-center"
                        onClick={() => {
                          if (sortBy === 'duration') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('duration');
                            setSortDirection('desc');
                          }
                        }}
                      >
                        Durée
                        {sortBy === 'duration' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th>Données</th>
                    <th>
                      <button 
                        className="flex items-center"
                        onClick={() => {
                          if (sortBy === 'createdAt') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('createdAt');
                            setSortDirection('desc');
                          }
                        }}
                      >
                        Créé le
                        {sortBy === 'createdAt' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th>
                      <button 
                        className="flex items-center"
                        onClick={() => {
                          if (sortBy === 'expiresAt') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('expiresAt');
                            setSortDirection('desc');
                          }
                        }}
                      >
                        Expire le
                        {sortBy === 'expiresAt' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th>
                      <button 
                        className="flex items-center"
                        onClick={() => {
                          if (sortBy === 'usage') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('usage');
                            setSortDirection('desc');
                          }
                        }}
                      >
                        Utilisation
                        {sortBy === 'usage' && (
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((voucher) => (
                    <tr key={voucher.id}>
                      <td className="font-medium">
                        <div className="flex items-center">
                          <input 
                            type="checkbox"
                            className="mr-2 h-4 w-4"
                            checked={selectedVouchers.includes(voucher.id)}
                            onChange={() => toggleVoucherSelection(voucher.id)}
                          />
                          <span className="font-mono">{voucher.code}</span>
                          <button 
                            className="ml-2 text-muted-foreground hover:text-primary"
                            onClick={() => copyVoucherCode(voucher.code)}
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
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
                      <td>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-primary hover:underline flex items-center">
                              {formatDate(voucher.createdAt).split(' ')[0]}
                              <Calendar size={14} className="ml-1" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <p className="text-sm font-medium">Créé le</p>
                            <p className="text-xs text-muted-foreground">{formatDate(voucher.createdAt)}</p>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={`hover:underline flex items-center ${
                              voucher.expired ? 'text-danger' : 'text-primary'
                            }`}>
                              {formatDate(voucher.expiresAt).split(' ')[0]}
                              <Calendar size={14} className="ml-1" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <p className="text-sm font-medium">Expire le</p>
                            <p className="text-xs text-muted-foreground">{formatDate(voucher.expiresAt)}</p>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="mr-2 h-2.5 w-full max-w-16 rounded-full bg-muted">
                            <div 
                              className={`h-full rounded-full ${
                                voucher.authorizedGuestCount === voucher.authorizeGuestLimit ? 'bg-primary' : 'bg-success'
                              }`}
                              style={{ 
                                width: `${(voucher.authorizedGuestCount / (voucher.authorizeGuestLimit || 1)) * 100}%` 
                              }}
                            />
                          </div>
                          <span>{voucher.authorizedGuestCount}/{voucher.authorizeGuestLimit || 1}</span>
                        </div>
                      </td>
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
                      <td className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleDeleteVoucher(voucher.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredVouchers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted-foreground">
                        {isLoading ? 'Chargement des vouchers...' : (
                          searchTerm ? 'Aucun voucher ne correspond à votre recherche' : 'Aucun voucher trouvé'
                        )}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des Vouchers</CardTitle>
            <CardDescription>Distribution des statuts de vouchers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartComponent
                type="doughnut"
                data={voucherStatusChartData}
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  },
                  cutout: '60%'
                }}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Création de Vouchers</CardTitle>
            <CardDescription>Nombre de vouchers créés les 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartComponent
                type="bar"
                data={voucherCreationChartData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voucher Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.total}
            </div>
            <p className="text-sm text-muted-foreground">
              Vouchers créés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.active}
            </div>
            <p className="text-sm text-muted-foreground">
              Non expirés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Non Utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.unused}
            </div>
            <p className="text-sm text-muted-foreground">
              Disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">En Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.partiallyUsed}
            </div>
            <p className="text-sm text-muted-foreground">
              Partiellement utilisés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expirés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.expired}
            </div>
            <p className="text-sm text-muted-foreground">
              Plus valides
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taux d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.usageRate}%
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
