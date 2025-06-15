
import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartType, ChartTypeRegistry } from 'chart.js';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartProvider, useChartContext } from './ChartContext';
import { getDefaultOptions } from './chartOptions';
import { ChartComponentProps } from './chartTypes';
import './chartRegistration';

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
    
    // Vérifier que Chart.js est correctement initialisé
    if (!ChartJS.registry.controllers.has(type)) {
      console.error(`Chart type "${type}" is not registered. Available types:`, 
        Array.from(ChartJS.registry.controllers.keys()));
      return;
    }
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    try {
      // Create new chart with appropriate type assertion
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new ChartJS(ctx, {
          type: type as keyof ChartTypeRegistry,
          data: data as any,
          options: { ...getDefaultOptions(type, isDarkMode, isMobile), ...options },
        });
      }
    } catch (error) {
      console.error('Error creating chart:', error);
      return;
    }
    
    // Update chart when dark mode changes
    const observer = new MutationObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          if (ctx) {
            try {
              chartInstance.current = new ChartJS(ctx, {
                type: type as keyof ChartTypeRegistry,
                data: data as any,
                options: { ...getDefaultOptions(type, isDarkMode, isMobile), ...options },
              });
            } catch (error) {
              console.error('Error recreating chart:', error);
            }
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

  // Fallback si le type de graphique n'est pas supporté
  if (!ChartJS.registry.controllers.has(type)) {
    return (
      <div 
        style={{ height: `${height}px` }} 
        className="flex items-center justify-center bg-muted rounded-lg"
      >
        <p className="text-muted-foreground">
          Type de graphique "{type}" non supporté
        </p>
      </div>
    );
  }

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
