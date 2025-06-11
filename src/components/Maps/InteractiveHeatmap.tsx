
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapContext } from './MapProvider';
import { getMapStyle, generateHeatmapData } from './mapUtils';

// Import leaflet.heat dynamiquement pour éviter les problèmes d'importation
let heatLayerLoaded = false;

interface InteractiveHeatmapProps {
  sites?: any[];
  height?: number;
  className?: string;
}

// Déclaration du type pour leaflet.heat
declare module 'leaflet' {
  function heatLayer(latlngs: [number, number, number][], options?: any): any;
}

const InteractiveHeatmap: React.FC<InteractiveHeatmapProps> = ({
  sites = [],
  height = 350,
  className = ''
}) => {
  const { defaultCenter, defaultZoom, isDarkMode } = useMapContext();
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);

  // Charger leaflet.heat dynamiquement
  useEffect(() => {
    const loadHeatLayer = async () => {
      if (!heatLayerLoaded) {
        try {
          await import('leaflet.heat');
          heatLayerLoaded = true;
        } catch (error) {
          console.warn('Failed to load leaflet.heat:', error);
        }
      }
    };
    loadHeatLayer();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !heatLayerLoaded) return;

    // Supprimer l'ancien layer de heatmap s'il existe
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    // Générer les données de heatmap
    const heatmapData = generateHeatmapData(sites);
    
    if (heatmapData.length > 0 && L.heatLayer) {
      // Créer le nouveau layer de heatmap
      heatLayerRef.current = L.heatLayer(heatmapData as [number, number, number][], {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      });

      heatLayerRef.current.addTo(mapRef.current);
    }
  }, [sites, heatLayerLoaded]);

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={(mapInstance) => {
          if (mapInstance) {
            mapRef.current = mapInstance;
          }
        }}
      >
        <TileLayer
          url={getMapStyle(isDarkMode)}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default InteractiveHeatmap;
