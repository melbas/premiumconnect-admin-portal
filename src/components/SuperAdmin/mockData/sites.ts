
// Site interface
export interface Site {
  id: string;
  name: string;
  location: string;
  users?: number;
  revenue?: number;
  status: 'active' | 'inactive';
  uptime: number;
  issues: number;
  latitude?: number;
  longitude?: number;
}

// Mock sites data
export const sites: Site[] = [
  {
    id: '1',
    name: 'Dakar Central',
    location: 'Dakar',
    users: 1200,
    revenue: 3500000,
    status: 'active',
    uptime: 99.8,
    issues: 2,
    latitude: 14.7167,
    longitude: -17.4677
  },
  {
    id: '2',
    name: 'Thiès Connect',
    location: 'Thiès',
    users: 800,
    revenue: 1800000,
    status: 'active',
    uptime: 98.2,
    issues: 4,
    latitude: 14.7910,
    longitude: -16.9359
  },
  {
    id: '3',
    name: 'Saint-Louis WiFi',
    location: 'Saint-Louis',
    users: 600,
    revenue: 1400000,
    status: 'active',
    uptime: 97.5,
    issues: 5,
    latitude: 16.0182,
    longitude: -16.4896
  },
  {
    id: '4',
    name: 'Ziguinchor Net',
    location: 'Ziguinchor',
    users: 450,
    revenue: 950000,
    status: 'inactive',
    uptime: 89.3,
    issues: 12,
    latitude: 12.5823,
    longitude: -16.2719
  },
  {
    id: '5',
    name: 'Touba Online',
    location: 'Touba',
    users: 550,
    revenue: 1200000,
    status: 'active',
    uptime: 95.7,
    issues: 7,
    latitude: 14.8676,
    longitude: -15.8830
  }
];
