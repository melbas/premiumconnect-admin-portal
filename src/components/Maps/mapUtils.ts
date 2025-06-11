
// Coordonnées des principales villes du Sénégal
export const senegalCities = {
  'Dakar': { lat: 14.7167, lng: -17.4677 },
  'Thiès': { lat: 14.7833, lng: -16.9667 },
  'Saint-Louis': { lat: 16.0377, lng: -16.5083 },
  'Touba': { lat: 14.8667, lng: -15.8833 },
  'Ziguinchor': { lat: 12.5667, lng: -16.2667 },
  'Kaolack': { lat: 14.1333, lng: -16.0667 },
  'Tambacounda': { lat: 13.7667, lng: -13.6667 },
  'Kolda': { lat: 12.9000, lng: -14.9500 },
};

// Fonction pour convertir un nom de site en coordonnées
export const getSiteCoordinates = (siteName: string): { lat: number; lng: number } | null => {
  // Recherche directe dans les villes connues
  for (const [city, coords] of Object.entries(senegalCities)) {
    if (siteName.toLowerCase().includes(city.toLowerCase())) {
      return coords;
    }
  }
  
  // Logique pour les sites avec des noms spécifiques
  const siteMapping: { [key: string]: { lat: number; lng: number } } = {
    'Coumba Lamb': { lat: 14.7500, lng: -17.4200 },
    'Liberté 6': { lat: 14.7200, lng: -17.4800 },
    'Centre Ville': { lat: 14.7833, lng: -16.9667 },
  };
  
  for (const [pattern, coords] of Object.entries(siteMapping)) {
    if (siteName.includes(pattern)) {
      return coords;
    }
  }
  
  // Coordonnées par défaut (centre du Sénégal)
  return { lat: 14.4974, lng: -14.4524 };
};

// Génération de données de heatmap simulées
export const generateHeatmapData = (sites: any[]) => {
  return sites.map(site => {
    const coords = getSiteCoordinates(site.name);
    if (!coords) return null;
    
    // Intensité basée sur l'activité du site
    const intensity = Math.random() * 0.8 + 0.2; // Entre 0.2 et 1.0
    
    return [coords.lat, coords.lng, intensity];
  }).filter(Boolean);
};

// Styles de carte personnalisés
export const mapStyles = {
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

export const getMapStyle = (isDarkMode: boolean) => {
  return isDarkMode ? mapStyles.dark : mapStyles.light;
};
