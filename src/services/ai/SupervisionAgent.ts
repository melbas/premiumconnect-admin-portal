
import { networkMCP } from '../mcp/NetworkMCPServer';
import { behaviorMCP } from '../mcp/BehaviorMCPServer';

export interface SupervisionAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  culturalContext?: string;
  recommendations: string[];
  timestamp: Date;
}

export class SupervisionAgent {
  private alerts: Map<string, SupervisionAlert[]> = new Map();

  async analyzeNetworkHealth(siteId: string): Promise<SupervisionAlert[]> {
    const networkContext = await networkMCP.getNetworkContext(siteId);
    const behaviorContext = await behaviorMCP.getBehaviorContext(siteId);
    
    const alerts: SupervisionAlert[] = [];

    // Analyse contextuelle de la performance
    if (networkContext && networkContext.currentLoad > 80) {
      const isPrayerTime = this.isPrayerTime(behaviorContext.culturalPatterns.prayerTimes);
      
      alerts.push({
        id: `load-${Date.now()}`,
        severity: isPrayerTime ? 'medium' : 'high',
        title: isPrayerTime ? 'Pic de charge pendant la prière' : 'Surcharge réseau détectée',
        description: `Charge actuelle: ${networkContext.currentLoad}%`,
        culturalContext: isPrayerTime ? 'Pic normal pendant les heures de prière' : undefined,
        recommendations: isPrayerTime 
          ? ['Maintenir la qualité de service', 'Surveiller les 30 prochaines minutes']
          : ['Redistribuer la charge', 'Activer les APs de secours'],
        timestamp: new Date()
      });
    }

    // Analyse saisonnière
    const season = this.getCurrentSeason();
    if (season === 'rainy' && networkContext) {
      alerts.push({
        id: `weather-${Date.now()}`,
        severity: 'medium',
        title: 'Alerte saison des pluies',
        description: 'Surveillance renforcée des équipements extérieurs',
        culturalContext: 'Période de mousson au Sénégal',
        recommendations: [
          'Vérifier l\'étanchéité des boîtiers',
          'Surveiller la température des équipements',
          'Planifier maintenance préventive'
        ],
        timestamp: new Date()
      });
    }

    this.alerts.set(siteId, alerts);
    console.log(`🔍 SupervisionAgent: Analyzed ${alerts.length} alerts for site ${siteId}`);
    return alerts;
  }

  async getActiveAlerts(siteId: string): Promise<SupervisionAlert[]> {
    return this.alerts.get(siteId) || [];
  }

  private isPrayerTime(prayerTimes: string[]): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return prayerTimes.some(prayerTime => {
      const [hour, minute] = prayerTime.split(':').map(Number);
      const prayerStart = hour * 60 + minute - 15; // 15 min avant
      const prayerEnd = hour * 60 + minute + 45;   // 45 min après
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      return currentMinutes >= prayerStart && currentMinutes <= prayerEnd;
    });
  }

  private getCurrentSeason(): 'dry' | 'rainy' {
    const month = new Date().getMonth();
    return (month >= 5 && month <= 9) ? 'rainy' : 'dry'; // Juin à Octobre = saison des pluies
  }
}

export const supervisionAgent = new SupervisionAgent();
