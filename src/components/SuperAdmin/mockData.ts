
// Mock data for the Super Admin Dashboard

// Site data
export interface Site {
  id: string;
  name: string;
  location: string;
  users: number;
  revenue: number;
  uptime: number;
  issues: number;
  status: 'active' | 'maintenance' | 'offline';
}

export const sites: Site[] = [
  {
    id: "1",
    name: "Dakar Central",
    location: "Dakar",
    users: 1245,
    revenue: 3750000,
    uptime: 99.8,
    issues: 2,
    status: "active"
  },
  {
    id: "2",
    name: "Thiès Ouest",
    location: "Thiès",
    users: 875,
    revenue: 2150000,
    uptime: 98.5,
    issues: 5,
    status: "active"
  },
  {
    id: "3",
    name: "Saint-Louis Port",
    location: "Saint-Louis",
    users: 560,
    revenue: 1420000,
    uptime: 99.2,
    issues: 1,
    status: "active"
  },
  {
    id: "4",
    name: "Touba Résidentiel",
    location: "Touba",
    users: 910,
    revenue: 2250000,
    uptime: 97.9,
    issues: 3,
    status: "maintenance"
  },
  {
    id: "5",
    name: "Ziguinchor Centre",
    location: "Ziguinchor",
    users: 425,
    revenue: 1050000,
    uptime: 95.4,
    issues: 7,
    status: "active"
  },
  {
    id: "6",
    name: "Mbour Côtier",
    location: "Mbour",
    users: 680,
    revenue: 1680000,
    uptime: 98.7,
    issues: 2,
    status: "active"
  },
  {
    id: "7",
    name: "Kaolack Est",
    location: "Kaolack",
    users: 320,
    revenue: 850000,
    uptime: 96.5,
    issues: 4,
    status: "offline"
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
}

export const users: UserData[] = [
  {
    id: "1",
    name: "Amadou Diallo",
    email: "admin@premiumconnect.sn",
    role: "superadmin",
    lastActive: "2025-05-01T08:30:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "Fatou Ndiaye",
    email: "marketing@premiumconnect.sn",
    role: "marketing",
    lastActive: "2025-05-01T09:45:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Omar Sow",
    email: "tech@premiumconnect.sn",
    role: "technical",
    lastActive: "2025-05-01T07:15:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "Aissatou Bâ",
    email: "aissatou.ba@premiumconnect.sn",
    role: "marketing",
    lastActive: "2025-04-30T16:20:00",
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "5",
    name: "Moussa Cissé",
    email: "moussa.cisse@premiumconnect.sn",
    role: "technical",
    lastActive: "2025-04-29T14:10:00",
    status: "inactive",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

// Campaign data
export interface Campaign {
  id: string;
  name: string;
  budget: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
}

export const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Offre Spéciale Été",
    budget: 500000,
    impressions: 24500,
    clicks: 1245,
    status: "active",
    startDate: "2025-04-01"
  },
  {
    id: "2",
    name: "Nouvel An - Promo 50%",
    budget: 750000,
    impressions: 35600,
    clicks: 2340,
    status: "completed",
    startDate: "2024-12-15",
    endDate: "2025-01-15"
  },
  {
    id: "3",
    name: "Lancement Dakar Sud",
    budget: 1200000,
    impressions: 48200,
    clicks: 3150,
    status: "active",
    startDate: "2025-03-10"
  },
  {
    id: "4",
    name: "Fidélité Premium",
    budget: 300000,
    impressions: 12800,
    clicks: 950,
    status: "active",
    startDate: "2025-04-20"
  },
  {
    id: "5",
    name: "Expansion Thiès",
    budget: 650000,
    impressions: 18900,
    clicks: 1560,
    status: "paused",
    startDate: "2025-02-01"
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
}

export const technicalIssues: TechnicalIssue[] = [
  {
    id: "1",
    description: "Instabilité réseau secteur nord",
    siteId: "1",
    siteName: "Dakar Central",
    severity: "medium",
    status: "in-progress",
    reportedAt: "2025-04-30T14:20:00"
  },
  {
    id: "2",
    description: "Panne serveur principal",
    siteId: "4",
    siteName: "Touba Résidentiel",
    severity: "critical",
    status: "open",
    reportedAt: "2025-05-01T08:15:00"
  },
  {
    id: "3",
    description: "Problème de routage périphérique",
    siteId: "2",
    siteName: "Thiès Ouest",
    severity: "low",
    status: "resolved",
    reportedAt: "2025-04-29T10:30:00",
    resolvedAt: "2025-04-30T16:45:00"
  },
  {
    id: "4",
    description: "Surchauffe équipement relais",
    siteId: "5",
    siteName: "Ziguinchor Centre",
    severity: "high",
    status: "in-progress",
    reportedAt: "2025-04-30T09:10:00"
  },
  {
    id: "5",
    description: "Interruption fibre optique",
    siteId: "7",
    siteName: "Kaolack Est",
    severity: "critical",
    status: "open",
    reportedAt: "2025-04-30T23:05:00"
  },
  {
    id: "6",
    description: "Défaillance générateur secours",
    siteId: "3",
    siteName: "Saint-Louis Port",
    severity: "medium",
    status: "open",
    reportedAt: "2025-05-01T06:20:00"
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
