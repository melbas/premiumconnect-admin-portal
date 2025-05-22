
// Network configuration data for different sites and regions
export const networkConfigurations = [
  {
    id: "dakar-central",
    name: "Dakar Central",
    bandwidth: 100,
    devices: 45,
    status: "active",
    lastUpdate: new Date().toISOString()
  },
  {
    id: "thies-connect",
    name: "Thiès Connect",
    bandwidth: 75,
    devices: 28,
    status: "active",
    lastUpdate: new Date().toISOString()
  },
  {
    id: "saint-louis",
    name: "Saint-Louis WiFi",
    bandwidth: 50,
    devices: 32,
    status: "warning",
    lastUpdate: new Date().toISOString()
  },
  {
    id: "mbour-beach",
    name: "Mbour Beach",
    bandwidth: 60,
    devices: 22,
    status: "active",
    lastUpdate: new Date().toISOString()
  },
  {
    id: "touba-connect",
    name: "Touba Connect",
    bandwidth: 40,
    devices: 18,
    status: "error",
    lastUpdate: new Date().toISOString()
  }
];

// Server status and monitoring data
export const serverStatus = {
  uptime: 99.8,
  latency: 27,
  activeSessions: 287,
  peakHours: [
    { hour: "08:00", connections: 156 },
    { hour: "12:00", connections: 235 },
    { hour: "16:00", connections: 312 },
    { hour: "20:00", connections: 278 }
  ]
};
