
// Campaign interface
export interface Campaign {
  id: string;
  name: string;
  budget: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  type: 'banner' | 'audio' | 'video';
  targetZones: string[];
}

// Mock campaigns data
export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Promotion Été',
    budget: 1500000,
    impressions: 15000,
    clicks: 2450,
    status: 'active',
    startDate: '2023-02-15',
    type: 'banner',
    targetZones: ['1', '3']
  },
  {
    id: '2',
    name: 'Ramadan Spécial',
    budget: 900000,
    impressions: 8000,
    clicks: 1200,
    status: 'completed',
    startDate: '2023-01-10',
    type: 'video',
    targetZones: ['2', '4']
  },
  {
    id: '3',
    name: 'Business Premium',
    budget: 2000000,
    impressions: 12000,
    clicks: 800,
    status: 'paused',
    startDate: '2023-03-01',
    type: 'audio',
    targetZones: ['1', '5']
  },
  {
    id: '4',
    name: 'Dakar Connect',
    budget: 1200000,
    impressions: 5000,
    clicks: 650,
    status: 'active',
    startDate: '2023-03-10',
    type: 'banner',
    targetZones: ['1']
  }
];
