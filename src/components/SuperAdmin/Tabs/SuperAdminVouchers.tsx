import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vouchers, Voucher, voucherChartData } from '../mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Download, FileType, Plus, Settings, Trash, Search } from 'lucide-react';

const SuperAdminVouchers: React.FC = () => {
  const [voucherList, setVoucherList] = useState<Voucher[]>(vouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredVouchers = voucherList.filter(voucher =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVoucher = () => {
    setSelectedVoucher(null);
    setIsModalOpen(true);
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDeleteVoucher = (voucher: Voucher) => {
    setVoucherList(voucherList.filter(v => v.id !== voucher.id));
    toast({
      title: "Voucher supprimé",
      description: `Le voucher ${voucher.code} a été supprimé avec succès.`,
    });
  };

  const handleSaveVoucher = (voucherData: Partial<Voucher>) => {
    if (selectedVoucher) {
      // Update existing voucher
      const updatedVoucherList = voucherList.map(v =>
        v.id === selectedVoucher.id ? { ...v, ...voucherData } : v
      );
      setVoucherList(updatedVoucherList);
      toast({
        title: "Voucher mis à jour",
        description: `Le voucher ${voucherData.code} a été mis à jour avec succès.`,
      });
    } else {
      // Create new voucher
      const newVoucher: Voucher = {
        id: (voucherList.length + 1).toString(),
        code: voucherData.code || '',
        description: voucherData.description || '',
        discount: voucherData.discount || 0,
        status: voucherData.status || 'active',
        redemptionLimit: voucherData.redemptionLimit || 100,
        redemptionCount: 0,
        expiryDate: voucherData.expiryDate || new Date().toISOString().split('T')[0],
      };
      setVoucherList([...voucherList, newVoucher]);
      toast({
        title: "Voucher ajouté",
        description: `Le voucher ${newVoucher.code} a été ajouté avec succès.`,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Vouchers</h1>
        <Button onClick={handleAddVoucher}>
          <Plus size={16} className="mr-2" />
          Nouveau Voucher
        </Button>
      </div>

      {/* Voucher Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance des Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartComponent
              type="doughnut"
              data={{
                labels: voucherChartData.labels,
                datasets: voucherChartData.datasets
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Utilisations par Voucher'
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

      {/* Voucher List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par code ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Redemption Limit</TableHead>
                  <TableHead>Redemption Count</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-medium">{voucher.code}</TableCell>
                    <TableCell>{voucher.description}</TableCell>
                    <TableCell>{voucher.discount}%</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${voucher.status === 'active'
                            ? 'bg-success/20 text-success'
                            : voucher.status === 'inactive'
                              ? 'bg-muted/40 text-muted-foreground'
                              : 'bg-warning/20 text-warning'
                          }`}
                      >
                        {voucher.status === 'active' ? 'Active' : voucher.status === 'inactive' ? 'Inactive' : 'Expired'}
                      </span>
                    </TableCell>
                    <TableCell>{voucher.redemptionLimit}</TableCell>
                    <TableCell>{voucher.redemptionCount}</TableCell>
                    <TableCell>{new Date(voucher.expiryDate).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditVoucher(voucher)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteVoucher(voucher)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVouchers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Aucun voucher trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Voucher Modal */}
      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        voucher={selectedVoucher}
        onSave={handleSaveVoucher}
      />
    </div>
  );
};

// Voucher Modal component
const VoucherModal = ({
  isOpen,
  onClose,
  voucher,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  voucher?: Voucher | null;
  onSave: (voucher: Partial<Voucher>) => void;
}) => {
  const [formData, setFormData] = useState({
    code: voucher?.code || '',
    description: voucher?.description || '',
    discount: voucher?.discount || 0,
    status: voucher?.status || 'active',
    redemptionLimit: voucher?.redemptionLimit || 100,
    expiryDate: voucher?.expiryDate || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' || name === 'redemptionLimit' ? Number(value) : value,
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
          {voucher ? 'Modifier Voucher' : 'Ajouter Voucher'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="block text-sm font-medium">
              Code
            </Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="block text-sm font-medium">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount" className="block text-sm font-medium">
              Discount (%)
            </Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="redemptionLimit" className="block text-sm font-medium">
              Redemption Limit
            </Label>
            <Input
              id="redemptionLimit"
              name="redemptionLimit"
              type="number"
              min="1"
              value={formData.redemptionLimit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="block text-sm font-medium">
              Expiry Date
            </Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="block text-sm font-medium">
              Status
            </Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" defaultValue={formData.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {voucher ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminVouchers;
