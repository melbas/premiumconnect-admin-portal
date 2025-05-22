
// User data interface
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'marketing' | 'technical' | 'voucher_manager';
  status: 'active' | 'inactive';
  lastActive: string;
  avatar?: string;
  phone?: string;
  assignedSiteId?: string;
  bio?: string;
  revenue?: number;
  users?: number;
  totalIssues?: number;
  resolvedIssues?: number;
}

// Mock users data
export const users: UserData[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'amadou@wifisenegal.com',
    role: 'superadmin',
    status: 'active',
    lastActive: '2023-03-20T14:30:00',
    avatar: '/assets/profiles/amadou.jpg'
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'fatou@wifisenegal.com',
    role: 'marketing',
    status: 'active',
    lastActive: '2023-03-19T10:15:00',
    avatar: '/assets/profiles/fatou.jpg'
  },
  {
    id: '3',
    name: 'Moussa Sow',
    email: 'moussa@wifisenegal.com',
    role: 'technical',
    status: 'active',
    lastActive: '2023-03-15T09:45:00',
    avatar: '/assets/profiles/moussa.jpg'
  },
  {
    id: '4',
    name: 'Aissatou Diop',
    email: 'aissatou@wifisenegal.com',
    role: 'marketing',
    status: 'active',
    lastActive: '2023-03-18T16:20:00',
    avatar: '/assets/profiles/aissatou.jpg'
  },
  {
    id: '5',
    name: 'Omar Gueye',
    email: 'omar@wifisenegal.com',
    role: 'technical',
    status: 'inactive',
    lastActive: '2023-02-28T11:10:00',
    avatar: '/assets/profiles/omar-g.jpg'
  }
];
