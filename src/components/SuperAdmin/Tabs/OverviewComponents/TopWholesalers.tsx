
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { users } from '../../mockData';

// Top Wholesalers component
const TopWholesalers: React.FC = () => {
  // Sort wholesalers by revenue
  const topWholesalers = [...users]
    .filter(user => user.revenue)
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Grossistes</CardTitle>
        <CardDescription>Classés par revenu</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Site</TableHead>
              <TableHead className="text-right">Revenu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topWholesalers.map((wholesaler) => (
              <TableRow key={wholesaler.id}>
                <TableCell className="font-medium">{wholesaler.name}</TableCell>
                <TableCell>{wholesaler.assignedSiteId ? `Site #${wholesaler.assignedSiteId}` : "Non assigné"}</TableCell>
                <TableCell className="text-right">{wholesaler.revenue?.toLocaleString()} FCFA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopWholesalers;
