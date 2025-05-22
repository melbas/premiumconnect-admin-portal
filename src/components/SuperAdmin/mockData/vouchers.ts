
// Voucher interface
export interface Voucher {
  id: string;
  code: string;
  type: 'time' | 'data';
  value: string;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
  usedAt?: string;
  createdBy: string;
  batchId?: string;
  // Adding missing properties that are used in the application
  description?: string;
  discount?: number;
  redemptionLimit?: number;
  redemptionCount?: number;
  expiryDate?: string;
}

// Mock vouchers data
export const vouchers: Voucher[] = [
  {
    id: '1',
    code: 'WIFI-123456',
    type: 'time',
    value: '120',
    status: 'active',
    createdAt: '2023-03-15T10:00:00',
    createdBy: '1',
    description: '2 heures de connexion',
    discount: 0,
    redemptionLimit: 1,
    redemptionCount: 0,
    expiryDate: '2023-04-15T10:00:00'
  },
  {
    id: '2',
    code: 'WIFI-234567',
    type: 'data',
    value: '1000',
    status: 'used',
    createdAt: '2023-03-14T14:30:00',
    usedAt: '2023-03-16T09:45:00',
    createdBy: '3',
    description: '1GB de données',
    discount: 0,
    redemptionLimit: 1,
    redemptionCount: 1,
    expiryDate: '2023-04-14T14:30:00'
  },
  {
    id: '3',
    code: 'WIFI-345678',
    type: 'time',
    value: '60',
    status: 'expired',
    createdAt: '2023-03-10T16:20:00',
    createdBy: '1',
    description: '1 heure de connexion',
    discount: 0,
    redemptionLimit: 1,
    redemptionCount: 0,
    expiryDate: '2023-03-12T16:20:00'
  },
  {
    id: '4',
    code: 'WIFI-456789',
    type: 'time',
    value: '30',
    status: 'active',
    createdAt: '2023-03-17T11:15:00',
    createdBy: '2',
    description: '30 minutes de connexion',
    discount: 0,
    redemptionLimit: 1,
    redemptionCount: 0,
    expiryDate: '2023-04-17T11:15:00'
  },
  {
    id: '5',
    code: 'WIFI-567890',
    type: 'data',
    value: '500',
    status: 'active',
    createdAt: '2023-03-18T09:30:00',
    createdBy: '3',
    description: '500MB de données',
    discount: 0,
    redemptionLimit: 1,
    redemptionCount: 0,
    expiryDate: '2023-04-18T09:30:00'
  }
];
