
// Mock data for the Super Admin Dashboard

// Site data
export interface Site {
  id: string;
  name: string;
  location: string;
  region: string;
  users: number;
  revenue: number;
  uptime: number;
  issues: number;
  status: 'active' | 'maintenance' | 'offline';
  latitude?: number;
  longitude?: number;
  routerType?: string;
  routerBrand?: string;
  expectedClients?: number;
  contactPhone?: string;
  notes?: string;
}

export const sites: Site[] = [
  {
    id: "1",
    name: "Dakar Central",
    location: "Dakar",
    region: "Dakar",
    users: 1245,
    revenue: 3750000,
    uptime: 99.8,
    issues: 2,
    status: "active",
    latitude: 14.7161,
    longitude: -17.4699,
    routerType: "Fiber",
    routerBrand: "Cisco",
    expectedClients: 2000,
    contactPhone: "+221 78 123 4567",
    notes: "Centre commercial et résidentiel"
  },
  {
    id: "2",
    name: "Thiès Ouest",
    location: "Thiès",
    region: "Thiès",
    users: 875,
    revenue: 2150000,
    uptime: 98.5,
    issues: 5,
    status: "active",
    latitude: 14.7907,
    longitude: -16.9292,
    routerType: "Wireless",
    routerBrand: "Ubiquiti",
    expectedClients: 1500,
    contactPhone: "+221 77 456 7890",
    notes: "Zone universitaire"
  },
  {
    id: "3",
    name: "Saint-Louis Port",
    location: "Saint-Louis",
    region: "Saint-Louis",
    users: 560,
    revenue: 1420000,
    uptime: 99.2,
    issues: 1,
    status: "active",
    latitude: 16.0169,
    longitude: -16.4896,
    routerType: "Fiber",
    routerBrand: "TP-Link",
    expectedClients: 800,
    contactPhone: "+221 76 789 0123",
    notes: "Zone touristique et portuaire"
  },
  {
    id: "4",
    name: "Touba Résidentiel",
    location: "Touba",
    region: "Diourbel",
    users: 910,
    revenue: 2250000,
    uptime: 97.9,
    issues: 3,
    status: "maintenance",
    latitude: 14.8676,
    longitude: -15.8873,
    routerType: "Wireless",
    routerBrand: "Mikrotik",
    expectedClients: 1200,
    contactPhone: "+221 70 123 4567",
    notes: "Zone résidentielle en expansion"
  },
  {
    id: "5",
    name: "Ziguinchor Centre",
    location: "Ziguinchor",
    region: "Ziguinchor",
    users: 425,
    revenue: 1050000,
    uptime: 95.4,
    issues: 7,
    status: "active",
    latitude: 12.5688,
    longitude: -16.2736,
    routerType: "Wireless",
    routerBrand: "Huawei",
    expectedClients: 600,
    contactPhone: "+221 78 987 6543",
    notes: "Zone commerciale et administrative"
  },
  {
    id: "6",
    name: "Mbour Côtier",
    location: "Mbour",
    region: "Thiès",
    users: 680,
    revenue: 1680000,
    uptime: 98.7,
    issues: 2,
    status: "active",
    latitude: 14.4167,
    longitude: -16.9667,
    routerType: "Fiber",
    routerBrand: "Cisco",
    expectedClients: 900,
    contactPhone: "+221 77 654 3210",
    notes: "Zone touristique côtière"
  },
  {
    id: "7",
    name: "Kaolack Est",
    location: "Kaolack",
    region: "Kaolack",
    users: 320,
    revenue: 850000,
    uptime: 96.5,
    issues: 4,
    status: "offline",
    latitude: 14.1527,
    longitude: -16.0726,
    routerType: "Wireless",
    routerBrand: "TP-Link",
    expectedClients: 500,
    contactPhone: "+221 76 543 2109",
    notes: "Zone commerciale émergente"
  }
];

// User data (extended from auth context)
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'marketing' | 'technical';
  lastActive: string;
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  assignedSiteId?: string;
  bio?: string;
  revenue?: number;
  users?: number;
  totalIssues?: number;
  resolvedIssues?: number;
}

export const users: UserData[] = [
  {
    id: "1",
    name: "Amadou Diallo",
    email: "admin@wifisenegal.com",
    role: "superadmin",
    lastActive: "2025-05-01T08:30:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=1",
    phone: "+221 78 123 4567"
  },
  {
    id: "2",
    name: "Fatou Ndiaye",
    email: "marketing@wifisenegal.com",
    role: "marketing",
    lastActive: "2025-05-01T09:45:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=2",
    phone: "+221 77 456 7890"
  },
  {
    id: "3",
    name: "Omar Sow",
    email: "tech@wifisenegal.com",
    role: "technical",
    lastActive: "2025-05-01T07:15:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=3",
    phone: "+221 76 789 0123"
  },
  {
    id: "4",
    name: "Aissatou Bâ",
    email: "aissatou.ba@wifisenegal.com",
    role: "marketing",
    lastActive: "2025-04-30T16:20:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=4",
    phone: "+221 70 123 4567"
  },
  {
    id: "5",
    name: "Moussa Cissé",
    email: "moussa.cisse@wifisenegal.com",
    role: "technical",
    lastActive: "2025-04-29T14:10:00",
    status: "inactive",
    avatar: "https://i.pravatar.cc/150?img=5",
    phone: "+221 78 987 6543"
  }
];

// Campaign data
export interface Campaign {
  id: string;
  name: string;
  type: 'Banner' | 'Audio' | 'Video';
  targetZones: string[];
  budget: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'completed' | 'paused' | 'pending';
  startDate: string;
  endDate?: string;
  mediaUrl?: string;
  description?: string;
  conversionRate?: number;
}

export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Offre Spéciale Été",
    type: "Banner",
    targetZones: ["1", "6"],
    budget: 500000,
    impressions: 24500,
    clicks: 1245,
    conversionRate: 5.1,
    status: "active",
    startDate: "2025-04-01",
    mediaUrl: "https://placehold.co/600x200/007bff/white?text=Offre+Speciale+Ete",
    description: "Promotion spéciale pour la période estivale avec remises exceptionnelles"
  },
  {
    id: "2",
    name: "Nouvel An - Promo 50%",
    type: "Video",
    targetZones: ["1", "2", "3", "4"],
    budget: 750000,
    impressions: 35600,
    clicks: 2340,
    conversionRate: 6.6,
    status: "completed",
    startDate: "2024-12-15",
    endDate: "2025-01-15",
    mediaUrl: "https://example.com/videos/newyear-promo.mp4",
    description: "Campagne de fin d'année avec remises importantes pour attirer de nouveaux clients"
  },
  {
    id: "3",
    name: "Lancement Dakar Sud",
    type: "Banner",
    targetZones: ["1"],
    budget: 1200000,
    impressions: 48200,
    clicks: 3150,
    conversionRate: 6.5,
    status: "active",
    startDate: "2025-03-10",
    mediaUrl: "https://placehold.co/600x200/28a745/white?text=Lancement+Dakar+Sud",
    description: "Campagne pour le lancement du nouveau site dans la zone sud de Dakar"
  },
  {
    id: "4",
    name: "Fidélité Premium",
    type: "Audio",
    targetZones: ["1", "2", "3", "5", "6"],
    budget: 300000,
    impressions: 12800,
    clicks: 950,
    conversionRate: 7.4,
    status: "active",
    startDate: "2025-04-20",
    mediaUrl: "https://example.com/audio/fidelite-premium.mp3",
    description: "Programme de fidélisation pour les clients existants avec avantages exclusifs"
  },
  {
    id: "5",
    name: "Expansion Thiès",
    type: "Video",
    targetZones: ["2", "6"],
    budget: 650000,
    impressions: 18900,
    clicks: 1560,
    conversionRate: 8.3,
    status: "paused",
    startDate: "2025-02-01",
    mediaUrl: "https://example.com/videos/thies-expansion.mp4",
    description: "Campagne pour l'extension du réseau dans la région de Thiès"
  }
];

// Technical issues data
export interface TechnicalIssue {
  id: string;
  description: string;
  siteId: string;
  siteName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  reportedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  deviceType?: 'Router' | 'Server' | 'Switch' | 'Fiber' | 'Power';
}

export const technicalIssues: TechnicalIssue[] = [
  {
    id: "1",
    description: "Instabilité réseau secteur nord",
    siteId: "1",
    siteName: "Dakar Central",
    severity: "medium",
    status: "in-progress",
    reportedAt: "2025-04-30T14:20:00",
    assignedTo: "Omar Sow",
    deviceType: "Router"
  },
  {
    id: "2",
    description: "Panne serveur principal",
    siteId: "4",
    siteName: "Touba Résidentiel",
    severity: "critical",
    status: "open",
    reportedAt: "2025-05-01T08:15:00",
    deviceType: "Server"
  },
  {
    id: "3",
    description: "Problème de routage périphérique",
    siteId: "2",
    siteName: "Thiès Ouest",
    severity: "low",
    status: "resolved",
    reportedAt: "2025-04-29T10:30:00",
    resolvedAt: "2025-04-30T16:45:00",
    assignedTo: "Moussa Cissé",
    deviceType: "Switch"
  },
  {
    id: "4",
    description: "Surchauffe équipement relais",
    siteId: "5",
    siteName: "Ziguinchor Centre",
    severity: "high",
    status: "in-progress",
    reportedAt: "2025-04-30T09:10:00",
    assignedTo: "Omar Sow",
    deviceType: "Router"
  },
  {
    id: "5",
    description: "Interruption fibre optique",
    siteId: "7",
    siteName: "Kaolack Est",
    severity: "critical",
    status: "open",
    reportedAt: "2025-04-30T23:05:00",
    deviceType: "Fiber"
  },
  {
    id: "6",
    description: "Défaillance générateur secours",
    siteId: "3",
    siteName: "Saint-Louis Port",
    severity: "medium",
    status: "open",
    reportedAt: "2025-05-01T06:20:00",
    deviceType: "Power"
  }
];

// Network and device metrics
export interface NetworkMetrics {
  siteId: string;
  siteName: string;
  latency: number; // in ms
  bandwidthUsage: number; // in Mbps
  connectedDevices: number;
  deviceCapacity: number;
  lastMaintenanceDate: string;
}

export const networkMetrics: NetworkMetrics[] = sites.map(site => ({
  siteId: site.id,
  siteName: site.name,
  latency: Math.floor(Math.random() * 50) + 10, // 10-60ms
  bandwidthUsage: Math.floor(Math.random() * 500) + 100, // 100-600 Mbps
  connectedDevices: Math.floor(site.users * 0.75), // ~75% of users are connected
  deviceCapacity: site.expectedClients || Math.floor(site.users * 1.5), // 1.5x current users as capacity
  lastMaintenanceDate: new Date(
    Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000 // 0-90 days ago
  ).toISOString().split('T')[0]
}));

// Device distribution data
export interface DeviceDistribution {
  siteId: string;
  mobile: number;
  desktop: number;
  tablet: number;
  iot: number;
}

export const deviceDistribution: DeviceDistribution[] = sites.map(site => {
  const total = site.users;
  const mobile = Math.floor(total * (Math.random() * 0.2 + 0.5)); // 50-70%
  const desktop = Math.floor(total * (Math.random() * 0.1 + 0.2)); // 20-30%
  const tablet = Math.floor(total * (Math.random() * 0.05 + 0.05)); // 5-10%
  const iot = total - mobile - desktop - tablet; // Remainder

  return {
    siteId: site.id,
    mobile,
    desktop,
    tablet,
    iot
  };
});

// Maintenance logs
export interface MaintenanceLog {
  id: string;
  siteId: string;
  siteName: string;
  date: string;
  activityType: 'Router Upgrade' | 'Firmware Update' | 'Cable Repair' | 'Server Maintenance' | 'Power System';
  description: string;
  technician: string;
  duration: number; // in hours
}

export const maintenanceLogs: MaintenanceLog[] = [
  {
    id: "1",
    siteId: "1",
    siteName: "Dakar Central",
    date: "2025-04-25",
    activityType: "Router Upgrade",
    description: "Mise à niveau des routeurs principaux vers le modèle Cisco 4000",
    technician: "Omar Sow",
    duration: 4
  },
  {
    id: "2",
    siteId: "2",
    siteName: "Thiès Ouest",
    date: "2025-04-18",
    activityType: "Firmware Update",
    description: "Mise à jour du firmware des équipements réseau",
    technician: "Moussa Cissé",
    duration: 2.5
  },
  {
    id: "3",
    siteId: "5",
    siteName: "Ziguinchor Centre",
    date: "2025-04-10",
    activityType: "Cable Repair",
    description: "Réparation câble fibre optique endommagé",
    technician: "Omar Sow",
    duration: 3
  },
  {
    id: "4",
    siteId: "3",
    siteName: "Saint-Louis Port",
    date: "2025-04-05",
    activityType: "Server Maintenance",
    description: "Maintenance préventive des serveurs et systèmes de refroidissement",
    technician: "Moussa Cissé",
    duration: 5
  },
  {
    id: "5",
    siteId: "4",
    siteName: "Touba Résidentiel",
    date: "2025-03-28",
    activityType: "Power System",
    description: "Installation d'un nouveau système d'alimentation de secours",
    technician: "Omar Sow",
    duration: 6
  }
];

// Chart data
// Monthly revenue by site (for last 6 months)
export const revenueChartData = {
  labels: ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
  datasets: sites.slice(0, 5).map((site, index) => ({
    label: site.name,
    data: Array(6).fill(0).map(() => Math.floor(Math.random() * 500000) + 800000),
    backgroundColor: [
      'rgba(37, 99, 235, 0.7)',
      'rgba(239, 68, 68, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(245, 158, 11, 0.7)',
      'rgba(139, 92, 246, 0.7)'
    ][index],
    borderWidth: 1
  }))
};

// Campaign performance (clicks)
export const campaignChartData = {
  labels: campaigns.map(campaign => campaign.name),
  datasets: [{
    label: 'Clicks',
    data: campaigns.map(campaign => campaign.clicks),
    backgroundColor: [
      'rgba(37, 99, 235, 0.7)',
      'rgba(239, 68, 68, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(245, 158, 11, 0.7)',
      'rgba(139, 92, 246, 0.7)'
    ],
    borderWidth: 1,
    hoverOffset: 10
  }]
};

// Campaign performance by type
export const campaignTypeChartData = {
  labels: ['Banner', 'Audio', 'Video'],
  datasets: [{
    label: 'Clicks par Type',
    data: [
      campaigns.filter(c => c.type === 'Banner').reduce((sum, c) => sum + c.clicks, 0),
      campaigns.filter(c => c.type === 'Audio').reduce((sum, c) => sum + c.clicks, 0),
      campaigns.filter(c => c.type === 'Video').reduce((sum, c) => sum + c.clicks, 0)
    ],
    backgroundColor: [
      'rgba(37, 99, 235, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(245, 158, 11, 0.7)'
    ],
    hoverOffset: 10
  }]
};

// Site uptime data (last 30 days)
export const uptimeChartData = {
  labels: Array(30).fill(0).map((_, i) => `${i+1}`),
  datasets: sites.slice(0, 3).map((site, index) => ({
    label: site.name,
    data: Array(30).fill(0).map(() => Math.random() * 2 + 98), // Random uptime between 98-100%
    borderColor: [
      'rgba(37, 99, 235, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)'
    ][index],
    backgroundColor: [
      'rgba(37, 99, 235, 0.1)',
      'rgba(16, 185, 129, 0.1)',
      'rgba(245, 158, 11, 0.1)'
    ][index],
    tension: 0.3,
    fill: true
  }))
};

// User growth over time
export const userGrowthChartData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [{
    label: 'Utilisateurs',
    data: [
      3200, 3350, 3480, 3600, 3750, 3920, 4050, 4180, 4300, 4450, 4680, 5015
    ],
    borderColor: 'rgba(16, 185, 129, 1)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    tension: 0.3,
    fill: true
  }]
};

// Device distribution chart data
export const deviceDistributionChartData = {
  labels: ['Mobile', 'Desktop', 'Tablet', 'IoT'],
  datasets: [{
    label: 'Appareils',
    data: [
      deviceDistribution.reduce((sum, site) => sum + site.mobile, 0),
      deviceDistribution.reduce((sum, site) => sum + site.desktop, 0),
      deviceDistribution.reduce((sum, site) => sum + site.tablet, 0),
      deviceDistribution.reduce((sum, site) => sum + site.iot, 0)
    ],
    backgroundColor: [
      'rgba(37, 99, 235, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(245, 158, 11, 0.7)',
      'rgba(139, 92, 246, 0.7)'
    ],
    borderWidth: 1,
    hoverOffset: 10
  }]
};

// Issue severity distribution
export const issueSeverityChartData = {
  labels: ['Critique', 'Élevé', 'Moyen', 'Faible'],
  datasets: [{
    label: 'Problèmes par Sévérité',
    data: [
      technicalIssues.filter(issue => issue.severity === 'critical').length,
      technicalIssues.filter(issue => issue.severity === 'high').length,
      technicalIssues.filter(issue => issue.severity === 'medium').length,
      technicalIssues.filter(issue => issue.severity === 'low').length
    ],
    backgroundColor: [
      'rgba(239, 68, 68, 0.7)',
      'rgba(245, 158, 11, 0.7)',
      'rgba(37, 99, 235, 0.7)',
      'rgba(16, 185, 129, 0.7)'
    ],
    borderWidth: 1,
    hoverOffset: 10
  }]
};

// Overview metrics
export const overviewMetrics = [
  {
    title: "Total Sites",
    value: sites.length.toString(),
    iconType: "layout",
    change: { value: 16.7, isPositive: true }
  },
  {
    title: "Revenu Mensuel",
    value: `${(sites.reduce((total, site) => total + site.revenue, 0) / 1000000).toFixed(2)}M FCFA`,
    iconType: "dollar",
    change: { value: 8.2, isPositive: true }
  },
  {
    title: "Utilisateurs Actifs",
    value: sites.reduce((total, site) => total + site.users, 0).toString(),
    iconType: "users",
    change: { value: 12.5, isPositive: true }
  },
  {
    title: "Problèmes Critiques",
    value: technicalIssues.filter(issue => issue.severity === 'critical' && issue.status !== 'resolved').length.toString(),
    iconType: "alert-triangle",
    change: { value: 33.3, isPositive: false }
  }
];
