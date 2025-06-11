
import React, { createContext, useContext, ReactNode } from 'react';
import './maps.css';

interface MapContextType {
  defaultCenter: [number, number];
  defaultZoom: number;
  isDarkMode: boolean;
}

const MapContext = createContext<MapContextType | null>(null);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

interface MapProviderProps {
  children: ReactNode;
  isDarkMode?: boolean;
}

export const MapProvider: React.FC<MapProviderProps> = ({ 
  children, 
  isDarkMode = false 
}) => {
  // Centre sur le Sénégal (Dakar)
  const defaultCenter: [number, number] = [14.7167, -17.4677];
  const defaultZoom = 10;

  return (
    <MapContext.Provider value={{
      defaultCenter,
      defaultZoom,
      isDarkMode
    }}>
      {children}
    </MapContext.Provider>
  );
};
