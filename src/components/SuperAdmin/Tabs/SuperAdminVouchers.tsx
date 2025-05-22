
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { vouchers, Voucher, voucherChartData } from '../mockData';
import { 
  Button,
} from '@/components/ui/button';
import {
  Dialog,
  DialogTitle, 
  DialogDescription, 
  DialogHeader,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
} from '@/components/ui/tabs';
import {
  Input,
} from '@/components/ui/input';
import {
  Label,
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Mail, Search, Plus, FilterX, Download, Trash } from 'lucide-react';

// For the actual implementation, you would likely use a more comprehensive date picker
// Here we're just using a basic input for simplicity
interface VoucherFormData {
  code: string;
  description: string;
  discount: number;
  status: "active" | "used" | "expired";
  redemptionLimit: number;
  expiryDate: string;
  type: 'time' | 'data';
  value: string;
  createdAt: string;
  createdBy: string;
}

const VoucherManager = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newVoucher, setNewVoucher] = useState<Omit<VoucherFormData, 'createdAt' | 'createdBy'>>({
    code: '',
    description: '',
    discount: 0,
    status: 'active',
    redemptionLimit: 1,
    expiryDate: '',
    type: 'time',
    value: '',
  });

  // Filter vouchers based on active tab and search term
  const filteredVouchers = vouchers.filter(voucher => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "active" && voucher.status === "active") ||
      (activeTab === "unused" && voucher.status === "active") ||
      (activeTab === "used" && voucher.status === "used") || 
      (activeTab === "expired" && voucher.status === "expired");
      
    const matchesSearch = 
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  const handleCreateVoucher = () => {
    // In a real app, you would make an API call here
    const currentDate = new Date().toISOString();
    const newVoucherEntry: Voucher = {
      ...newVoucher,
      id: `v-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: currentDate,
      createdBy: "1", // Assuming the current user ID is 1
      redemptionCount: 0,
      usedAt: undefined,
      batchId: undefined,
    };
    
    // Here you would typically update state through a reducer or context
    console.log("Creating new voucher:", newVoucherEntry);
    
    // Close the dialog and reset the form
    setShowCreateDialog(false);
    setNewVoucher({
      code: '',
      description: '',
      discount: 0,
      status: 'active',
      redemptionLimit: 1,
      expiryDate: '',
      type: 'time',
      value: ''
    });
  };

  const handleUpdateStatus = (id: string, newStatus: "active" | "used" | "expired") => {
    // In a real app, you would make an API call here
    console.log(`Updating voucher ${id} status to ${newStatus}`);
  };

  const voucherStatusCounts = {
    all: vouchers.length,
    active: vouchers.filter(v => v.status === "active").length,
    used: vouchers.filter(v => v.status === "used").length,
    expired: vouchers.filter(v => v.status === "expired").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Coupons</h1>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Créer un Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Coupons</CardTitle>
            <CardDescription>Gérez et surveillez vos coupons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des coupons..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setSearchTerm("")}>
                <FilterX size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Download size={16} />
              </Button>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">
                  Tous ({voucherStatusCounts.all})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Actif ({voucherStatusCounts.active})
                </TabsTrigger>
                <TabsTrigger value="used">
                  Utilisé ({voucherStatusCounts.used})
                </TabsTrigger>
                <TabsTrigger value="expired">
                  Expiré ({voucherStatusCounts.expired})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="m-0">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left">Code</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Valeur</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Statut</th>
                        <th className="p-3 text-left">Expiration</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher) => (
                          <tr key={voucher.id} className="border-t">
                            <td className="p-3 font-medium">{voucher.code}</td>
                            <td className="p-3">{voucher.description || "-"}</td>
                            <td className="p-3">{voucher.type === 'time' ? `${voucher.value} min` : `${voucher.value} MB`}</td>
                            <td className="p-3">{voucher.type === 'time' ? 'Temps' : 'Données'}</td>
                            <td className="p-3">
                              <span 
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${voucher.status === 'active' ? 'bg-success/20 text-success' : 
                                  voucher.status === 'used' ? 'bg-primary/20 text-primary' : 
                                  'bg-warning/20 text-warning'}`}
                              >
                                {voucher.status === 'active' ? 'Actif' : 
                                 voucher.status === 'used' ? 'Utilisé' : 'Expiré'}
                              </span>
                            </td>
                            <td className="p-3">
                              {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-3">
                              <div className="flex justify-center items-center gap-2">
                                {voucher.status === 'active' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleUpdateStatus(voucher.id, "used")}
                                  >
                                    <Mail size={14} className="mr-1" />
                                    Envoyer
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-muted-foreground">
                            Aucun coupon trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartComponent
                type="doughnut"
                data={voucherChartData}
                height={200}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-success">{voucherStatusCounts.active}</h4>
                <p className="text-xs text-muted-foreground mt-1">Actifs</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-primary">{voucherStatusCounts.used}</h4>
                <p className="text-xs text-muted-foreground mt-1">Utilisés</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-warning">{voucherStatusCounts.expired}</h4>
                <p className="text-xs text-muted-foreground mt-1">Expirés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Voucher Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau coupon</DialogTitle>
            <DialogDescription>
              Remplissez les champs pour créer un nouveau coupon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Code du Coupon</Label>
              <Input
                id="code"
                value={newVoucher.code}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, code: e.target.value }))}
                placeholder="ex: WIFI-123456"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newVoucher.description}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, description: e.target.value }))}
                placeholder="ex: 2 heures de connexion"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newVoucher.type} 
                  onValueChange={(value: 'time' | 'data') => 
                    setNewVoucher(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Temps</SelectItem>
                    <SelectItem value="data">Données</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  value={newVoucher.value}
                  onChange={(e) => setNewVoucher(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={newVoucher.type === 'time' ? 'Minutes' : 'MB'}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expiry">Date d'expiration</Label>
              <Input
                id="expiry"
                type="date"
                value={newVoucher.expiryDate}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="redemptionLimit">Limite d'utilisation</Label>
              <Input
                id="redemptionLimit"
                type="number"
                value={newVoucher.redemptionLimit}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, redemptionLimit: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateVoucher}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoucherManager;
