
import { UserData } from './users';

// Mock wholesalers data
export const mockWholesalers: UserData[] = [
  {
    id: 'w1',
    name: 'Fatou Ndiaye',
    email: 'fatou@wholesale.sn',
    role: 'technical',
    status: 'active',
    lastActive: '2023-03-19T10:15:00',
    assignedSiteId: '1',
    revenue: 1250000,
    users: 75,
    totalIssues: 5,
    resolvedIssues: 3
  },
  {
    id: 'w2',
    name: 'Moussa Sow',
    email: 'moussa@wholesale.sn',
    role: 'technical',
    status: 'active',
    lastActive: '2023-03-18T14:25:00',
    assignedSiteId: '2',
    revenue: 980000,
    users: 62,
    totalIssues: 3,
    resolvedIssues: 3
  },
  {
    id: 'w3',
    name: 'Aida Diop',
    email: 'aida@wholesale.sn',
    role: 'technical',
    status: 'inactive',
    lastActive: '2023-03-10T09:30:00',
    assignedSiteId: '3',
    revenue: 750000,
    users: 48,
    totalIssues: 8,
    resolvedIssues: 4
  }
];
