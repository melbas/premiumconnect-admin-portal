
import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  ChartType, 
  ChartTypeRegistry,
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
  Filler
} from 'chart.js';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartProvider, useChartContext } from './ChartContext';
import { getDefaultOptions } from './chartOptions';
import { ChartComponentProps } from './chartTypes';

// Register all Chart.js components immediately
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
  Title,
  Filler
);

const ChartRenderer: React.FC<ChartComponentProps> = ({ 
  type, 
  data, 
  options = {}, 
  height = 300 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);
  const { isDarkMode, isMobile } = useChartContext();

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
    
    try {
      // Verify that the chart type is supported
      const supportedTypes = ['line', 'bar', 'doughnut'];
      if (!supportedTypes.includes(type)) {
        throw new Error(`Chart type "${type}" is not supported`);
      }

      // Create new chart with appropriate type assertion
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new ChartJS(ctx, {
          type: type as keyof ChartTypeRegistry,
          data: data as any,
          options: { ...getDefaultOptions(type, isDarkMode, isMobile), ...options },
        });
        console.log(`✅ Chart created successfully with type: ${type}`);
      }
    } catch (error) {
      console.error('Error creating chart:', error);
      // Fallback: show error message in canvas
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
        ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Erreur de graphique: ${error.message}`, 
          chartRef.current.width / 2, 
          chartRef.current.height / 2
        );
      }
    }
    
    // Update chart when dark mode changes
    const observer = new MutationObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        const ctx = chartRef.current?.getContext('2d');
        if (ctx) {
          try {
            chartInstance.current = new ChartJS(ctx, {
              type: type as keyof ChartTypeRegistry,
              data: data as any,
              options: { ...getDefaultOptions(type, isDarkMode, isMobile), ...options },
            });
          } catch (error) {
            console.error('Error updating chart:', error);
          }
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
  }, [type, data, options, isMobile, isDarkMode]);

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const ChartComponent: React.FC<ChartComponentProps> = (props) => {
  const isMobile = useIsMobile();
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <ChartProvider isDarkMode={isDarkMode} isMobile={isMobile}>
      <ChartRenderer {...props} />
    </ChartProvider>
  );
};

export default ChartComponent;
