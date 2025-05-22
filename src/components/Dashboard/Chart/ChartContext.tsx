
import React, { createContext, useContext } from 'react';
import { ChartTypeRegistry } from 'chart.js';

interface ChartContextType {
  isDarkMode: boolean;
  isMobile: boolean;
}

const ChartContext = createContext<ChartContextType | null>(null);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChartContext must be used within a ChartProvider');
  }
  return context;
};

export const ChartProvider: React.FC<{
  children: React.ReactNode;
  isDarkMode: boolean;
  isMobile: boolean;
}> = ({ children, isDarkMode, isMobile }) => {
  return (
    <ChartContext.Provider value={{ isDarkMode, isMobile }}>
      {children}
    </ChartContext.Provider>
  );
};
