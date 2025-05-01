
// User data interface
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'marketing' | 'technical';
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

// Mock users data
export const users: UserData[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'amadou@wifisenegal.com',
    role: 'superadmin',
    status: 'active',
    lastActive: '2023-03-20T14:30:00',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'fatou@wifisenegal.com',
    role: 'marketing',
    status: 'active',
    lastActive: '2023-03-19T10:15:00',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Moussa Sow',
    email: 'moussa@wifisenegal.com',
    role: 'technical',
    status: 'active',
    lastActive: '2023-03-15T09:45:00',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '4',
    name: 'Aissatou Diop',
    email: 'aissatou@wifisenegal.com',
    role: 'marketing',
    status: 'active',
    lastActive: '2023-03-18T16:20:00',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: '5',
    name: 'Omar Gueye',
    email: 'omar@wifisenegal.com',
    role: 'technical',
    status: 'inactive',
    lastActive: '2023-02-28T11:10:00',
    avatar: 'https://i.pravatar.cc/150?img=15'
  }
];

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

// Chart data for campaigns
export const campaignChartData = {
  labels: ['Promotion Été', 'Ramadan Spécial', 'Business Premium', 'Dakar Connect'],
  datasets: [
    {
      label: 'Clics',
      data: [2450, 1200, 800, 650],
      backgroundColor: [
        'rgba(37, 99, 235, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)'
      ],
      borderWidth: 1
    }
  ]
};

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

// Mock issues data
export const issues = [
  {
    id: '1',
    siteId: '1',
    title: 'Connexion intermittente',
    description: 'Les utilisateurs signalent des déconnexions fréquentes',
    severity: 'high',
    status: 'open',
    reportedDate: '2023-03-18T09:30:00',
    assignedTo: '3'
  },
  {
    id: '2',
    siteId: '2',
    title: 'Bande passante réduite',
    description: 'Vitesse réduite pendant les heures de pointe',
    severity: 'medium',
    status: 'in-progress',
    reportedDate: '2023-03-15T14:20:00',
    assignedTo: '5'
  },
  {
    id: '3',
    siteId: '3',
    title: 'Problème de routeur',
    description: 'Le routeur principal doit être redémarré manuellement',
    severity: 'low',
    status: 'resolved',
    reportedDate: '2023-03-10T11:45:00',
    assignedTo: '3'
  },
  {
    id: '4',
    siteId: '4',
    title: 'Panne électrique',
    description: 'Site hors ligne en raison d\'une panne électrique prolongée',
    severity: 'critical',
    status: 'open',
    reportedDate: '2023-03-19T08:15:00',
    assignedTo: null
  },
  {
    id: '5',
    siteId: '5',
    title: 'Problème de DNS',
    description: 'Résolution DNS intermittente pour certains sites',
    severity: 'medium',
    status: 'in-progress',
    reportedDate: '2023-03-17T16:30:00',
    assignedTo: '5'
  }
];

// Add missing data for overview tab
export const overviewMetrics = [
  {
    title: "Sites totaux",
    value: "5",
    iconType: "layout",
    change: "+1 cette semaine"
  },
  {
    title: "Revenu global",
    value: "8,850,000 FCFA",
    iconType: "dollar",
    change: "+12% ce mois"
  },
  {
    title: "Utilisateurs",
    value: "3,600",
    iconType: "users",
    change: "+85 ce mois"
  },
  {
    title: "Problèmes Actifs",
    value: "8",
    iconType: "alert-triangle",
    change: "-2 cette semaine"
  }
];

// Add revenue chart data
export const revenueChartData = {
  labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"],
  datasets: [
    {
      label: "Dakar Central",
      data: [2800000, 3100000, 2900000, 3300000, 3500000, 3800000],
      backgroundColor: "rgba(37, 99, 235, 0.5)"
    },
    {
      label: "Thiès Connect",
      data: [1500000, 1600000, 1700000, 1750000, 1800000, 1950000],
      backgroundColor: "rgba(239, 68, 68, 0.5)"
    },
    {
      label: "Saint-Louis WiFi",
      data: [1200000, 1300000, 1250000, 1350000, 1400000, 1450000],
      backgroundColor: "rgba(16, 185, 129, 0.5)"
    }
  ]
};

// Add technical issues data
export const technicalIssues = [
  {
    id: "T1",
    description: "Instabilité réseau - Dakar Central",
    siteId: "1",
    siteName: "Dakar Central",
    severity: "medium",
    status: "open",
    reportedAt: "2023-04-28T09:15:00",
    resolvedAt: null
  },
  {
    id: "T2",
    description: "Problème d'alimentation - Thiès Connect",
    siteId: "2", 
    siteName: "Thiès Connect",
    severity: "high",
    status: "in-progress",
    reportedAt: "2023-04-27T14:30:00",
    resolvedAt: null
  },
  {
    id: "T3",
    description: "Interruption fibre - Saint-Louis WiFi",
    siteId: "3",
    siteName: "Saint-Louis WiFi",
    severity: "critical",
    status: "open",
    reportedAt: "2023-04-29T08:45:00",
    resolvedAt: null
  },
  {
    id: "T4", 
    description: "Pic de latence - Ziguinchor Net",
    siteId: "4",
    siteName: "Ziguinchor Net",
    severity: "low",
    status: "resolved",
    reportedAt: "2023-04-25T10:20:00",
    resolvedAt: "2023-04-26T11:30:00"
  }
];

// Add uptime chart data
export const uptimeChartData = {
  labels: ["1", "5", "10", "15", "20", "25", "30"],
  datasets: [
    {
      label: "Dakar Central",
      data: [99.9, 99.8, 99.9, 99.7, 99.8, 99.9, 99.8],
      borderColor: "rgba(37, 99, 235, 0.7)",
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      fill: true,
      tension: 0.3
    },
    {
      label: "Thiès Connect",
      data: [99.5, 98.9, 99.2, 98.7, 98.1, 98.4, 98.2],
      borderColor: "rgba(239, 68, 68, 0.7)",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      fill: true,
      tension: 0.3
    },
    {
      label: "Saint-Louis WiFi",
      data: [98.5, 97.9, 97.4, 97.8, 97.3, 97.6, 97.5],
      borderColor: "rgba(16, 185, 129, 0.7)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fill: true,
      tension: 0.3
    }
  ]
};
