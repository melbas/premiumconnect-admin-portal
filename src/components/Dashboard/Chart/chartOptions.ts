
import { ChartType, ChartOptions } from 'chart.js';

// Generate default chart options based on chart type, dark mode, and device
export const getDefaultOptions = (
  type: 'line' | 'bar' | 'doughnut', 
  isDarkMode: boolean, 
  isMobile: boolean
): ChartOptions<ChartType> => {
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
  
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: isMobile ? 'bottom' : 'top' as const,
        labels: {
          color: textColor,
          font: {
            family: 'Poppins, sans-serif',
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#ffffff' : '#0f172a',
        bodyColor: isDarkMode ? '#e2e8f0' : '#334155',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        titleFont: {
          family: 'Poppins, sans-serif',
          size: 12,
          weight: 'bold' as const,
        },
        bodyFont: {
          family: 'Poppins, sans-serif',
          size: 11,
        },
      },
    },
  };

  if (type === 'line' || type === 'bar') {
    return {
      ...baseOptions,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Poppins, sans-serif',
            },
            maxRotation: isMobile ? 45 : 0,
          },
        },
        y: {
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Poppins, sans-serif',
            },
            padding: 10,
          },
          beginAtZero: true,
        },
      },
    } as ChartOptions<ChartType>;
  }
  
  if (type === 'doughnut') {
    return {
      ...baseOptions,
      cutout: '65%',
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins.legend,
          position: 'bottom' as const,
        },
      },
    } as ChartOptions<ChartType>;
  }
  
  return baseOptions as ChartOptions<ChartType>;
};
