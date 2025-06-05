
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface AuditFiltersProps {
  filters: {
    search: string;
    actionType: string;
    criticality: string;
    startDate: string;
    endDate: string;
    adminUserId: string;
  };
  setFilters: (filters: any) => void;
  onRefresh: () => void;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({ filters, setFilters, onRefresh }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.actionType} onValueChange={(value) => setFilters({ ...filters, actionType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="auth_login">Connexions</SelectItem>
              <SelectItem value="user_create">Création utilisateur</SelectItem>
              <SelectItem value="user_update">Modification utilisateur</SelectItem>
              <SelectItem value="portal_create">Création portail</SelectItem>
              <SelectItem value="config_update">Modification config</SelectItem>
              <SelectItem value="data_export">Export données</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.criticality} onValueChange={(value) => setFilters({ ...filters, criticality: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Criticité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            placeholder="Date début"
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            placeholder="Date fin"
          />

          <Button onClick={onRefresh} variant="outline">
            Actualiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditFilters;
