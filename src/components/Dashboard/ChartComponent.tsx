
import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip, 
  Legend,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  ChartTypeRegistry
} from 'chart.js';
import { useIsMobile } from '@/hooks/use-mobile';

// Register Chart.js components
ChartJS.register(
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Tooltip, 
  Legend,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Title
);

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    hoverOffset?: number;
  }>;
}

interface ChartComponentProps {
  type: 'line' | 'bar' | 'doughnut';
  data: ChartData;
  options?: any;
  height?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ 
  type, 
  data, 
  options = {}, 
  height = 300 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const isMobile = useIsMobile();
  
  // Default options based on chart type
  const getDefaultOptions = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
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
      };
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
      };
    }
    
    return baseOptions;
  };

  // Clean up chart on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  // Initialize or update chart when data or options change
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart with appropriate type assertion
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new ChartJS(ctx, {
        type: type as keyof ChartTypeRegistry,
        data: data as any,
        options: { ...getDefaultOptions(), ...options },
      });
    }
    
    // Update chart when dark mode changes
    const observer = new MutationObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        if (ctx) {
          chartInstance.current = new ChartJS(ctx, {
            type: type as keyof ChartTypeRegistry,
            data: data as any,
            options: { ...getDefaultOptions(), ...options },
          });
        }
      }
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => {
      observer.disconnect();
    };
  }, [type, data, options, isMobile]);

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
