
// Re-export all data from individual files
export * from './users';
export * from './sites';
export * from './vouchers';
export * from './wholesalers';
export * from './charts';
export * from './campaigns';
export * from './issues';
export * from './metrics';
export * from './network';

// Additional data that might be needed
export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Dakar Central',
      data: [500000, 550000, 600000, 580000, 620000, 670000],
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
    },
    {
      label: 'Thiès Connect',
      data: [300000, 320000, 340000, 360000, 380000, 400000],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
    },
    {
      label: 'Saint-Louis WiFi',
      data: [250000, 260000, 270000, 280000, 300000, 320000],
      backgroundColor: 'rgba(167, 139, 250, 0.8)',
    }
  ]
};
