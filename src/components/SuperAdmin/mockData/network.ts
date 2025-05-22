
// Network statistics data
export const networkStats = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Trafic (GB)",
      data: [120, 180, 200, 170, 220, 250, 210],
      borderColor: "rgba(37, 99, 235, 0.7)",
      backgroundColor: "rgba(37, 99, 235, 0.2)",
      fill: true,
      tension: 0.4
    },
    {
      label: "Latence (ms)",
      data: [25, 30, 28, 32, 27, 25, 26],
      borderColor: "rgba(239, 68, 68, 0.7)",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      fill: true,
      tension: 0.4
    }
  ]
};

// Device data
export const deviceData = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Appareils connectés",
      data: [450, 520, 580, 540, 610, 720, 680],
      backgroundColor: "rgba(16, 185, 129, 0.6)"
    }
  ]
};
