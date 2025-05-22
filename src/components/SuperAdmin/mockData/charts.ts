
// Campaign chart data
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

// Revenue chart data
export const revenueData = {
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

// User growth chart data
export const userGrowthData = {
  labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
  datasets: [
    {
      label: 'Nouveaux utilisateurs',
      data: [120, 150, 180, 210, 290, 350],
      borderColor: "rgba(16, 185, 129, 0.7)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fill: true,
      tension: 0.3
    }
  ]
};

// Device usage chart data
export const deviceUsageData = {
  labels: ["Mobile", "Tablette", "Ordinateur", "Autre"],
  datasets: [
    {
      label: "Utilisations par appareil",
      data: [65, 20, 12, 3],
      backgroundColor: [
        "rgba(37, 99, 235, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(239, 68, 68, 0.7)",
        "rgba(245, 158, 11, 0.7)"
      ]
    }
  ]
};

// Voucher chart data
export const voucherChartData = {
  labels: ['Actifs', 'Utilisés', 'Expirés'],
  datasets: [
    {
      label: 'Status des Coupons',
      data: [3, 1, 1],
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)',
        'rgba(37, 99, 235, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ]
    }
  ]
};
