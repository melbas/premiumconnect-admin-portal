
import { supabase } from "@/integrations/supabase/client";

export interface SecurityThreat {
  id: string;
  userId: string;
  threatType: 'unusual_activity' | 'fraud' | 'abuse' | 'spam' | 'multiple_accounts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  details: string;
  recommendations: string[];
  detectedAt: string;
  africaSpecific: boolean;
}

export interface BehaviorPattern {
  connectionFrequency: number;
  averageSessionDuration: number;
  deviceFingerprint: string;
  locationPattern: string[];
  paymentPattern: string[];
  timePattern: string[];
}

export const fraudDetectionService = {
  /**
   * Analyse les comportements suspects adaptée aux patterns africains
   */
  async detectAnomalies(userId: string): Promise<SecurityThreat[]> {
    try {
      console.log('🛡️ Analyzing user behavior for anomalies:', userId);

      const userPattern = await this.analyzeUserBehavior(userId);
      const localNorms = await this.getLocalBehaviorNorms();
      
      const threats: SecurityThreat[] = [];

      // Vérifications spécifiques au contexte africain
      threats.push(...await this.checkConnectionPatterns(userId, userPattern, localNorms));
      threats.push(...await this.checkPaymentAnomalies(userId, userPattern));
      threats.push(...await this.checkDeviceAnomalies(userId, userPattern));
      threats.push(...await this.checkLocationAnomalies(userId, userPattern));

      const filteredThreats = threats.filter(threat => threat.confidence > 0.6);
      
      if (filteredThreats.length > 0) {
        await this.logSecurityEvents(filteredThreats);
      }

      console.log('✅ Anomaly detection completed:', filteredThreats.length, 'threats found');
      return filteredThreats;
    } catch (error) {
      console.error('❌ Error in fraud detection:', error);
      return [];
    }
  },

  /**
   * Analyse le comportement utilisateur
   */
  async analyzeUserBehavior(userId: string): Promise<BehaviorPattern> {
    const { data: sessions } = await supabase
      .from('wifi_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(100);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const sessionsData = sessions || [];
    const transactionsData = transactions || [];

    return {
      connectionFrequency: this.calculateConnectionFrequency(sessionsData),
      averageSessionDuration: this.calculateAverageSessionDuration(sessionsData),
      deviceFingerprint: this.extractDeviceFingerprint(sessionsData),
      locationPattern: this.extractLocationPattern(sessionsData),
      paymentPattern: this.extractPaymentPattern(transactionsData),
      timePattern: this.extractTimePattern(sessionsData)
    };
  },

  /**
   * Vérifie les patterns de connexion suspects
   */
  async checkConnectionPatterns(
    userId: string, 
    pattern: BehaviorPattern, 
    localNorms: any
  ): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Connexions trop fréquentes (pattern inhabituel au Sénégal)
    if (pattern.connectionFrequency > localNorms.maxDailyConnections * 3) {
      threats.push({
        id: `conn-freq-${Date.now()}`,
        userId,
        threatType: 'unusual_activity',
        severity: 'medium',
        confidence: 0.8,
        details: 'Fréquence de connexion anormalement élevée pour le contexte local',
        recommendations: ['Vérifier l\'authenticité de l\'utilisateur', 'Limiter temporairement l\'accès'],
        detectedAt: new Date().toISOString(),
        africaSpecific: true
      });
    }

    // Sessions trop courtes (possibles tests automatisés)
    if (pattern.averageSessionDuration < 2 && pattern.connectionFrequency > 10) {
      threats.push({
        id: `short-sessions-${Date.now()}`,
        userId,
        threatType: 'abuse',
        severity: 'high',
        confidence: 0.9,
        details: 'Sessions très courtes avec connexions fréquentes - possible automation',
        recommendations: ['Implémenter CAPTCHA', 'Surveiller les patterns de navigation'],
        detectedAt: new Date().toISOString(),
        africaSpecific: false
      });
    }

    return threats;
  },

  /**
   * Vérifie les anomalies de paiement
   */
  async checkPaymentAnomalies(userId: string, pattern: BehaviorPattern): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Patterns de paiement suspects pour l'Afrique
    const suspiciousPaymentPatterns = [
      'paiements_multiples_rapides',
      'montants_inhabituels',
      'methodes_non_locales'
    ];

    if (pattern.paymentPattern.some(p => suspiciousPaymentPatterns.includes(p))) {
      threats.push({
        id: `payment-anomaly-${Date.now()}`,
        userId,
        threatType: 'fraud',
        severity: 'high',
        confidence: 0.85,
        details: 'Pattern de paiement inhabituel détecté',
        recommendations: [
          'Vérifier la source des fonds',
          'Contacter l\'utilisateur',
          'Suspendre temporairement les transactions'
        ],
        detectedAt: new Date().toISOString(),
        africaSpecific: true
      });
    }

    return threats;
  },

  /**
   * Vérifie les anomalies d'appareils
   */
  async checkDeviceAnomalies(userId: string, pattern: BehaviorPattern): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Trop d'appareils différents (partage de compte)
    const deviceCount = this.extractUniqueDeviceCount(pattern.deviceFingerprint);
    if (deviceCount > 5) {
      threats.push({
        id: `device-anomaly-${Date.now()}`,
        userId,
        threatType: 'multiple_accounts',
        severity: 'medium',
        confidence: 0.7,
        details: `Trop d'appareils différents détectés: ${deviceCount}`,
        recommendations: ['Vérifier l\'utilisation partagée', 'Limiter le nombre d\'appareils'],
        detectedAt: new Date().toISOString(),
        africaSpecific: true
      });
    }

    return threats;
  },

  /**
   * Vérifie les anomalies de localisation
   */
  async checkLocationAnomalies(userId: string, pattern: BehaviorPattern): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Connexions depuis des locations géographiquement impossibles
    const suspiciousLocations = this.detectImpossibleTravel(pattern.locationPattern);
    if (suspiciousLocations.length > 0) {
      threats.push({
        id: `location-anomaly-${Date.now()}`,
        userId,
        threatType: 'fraud',
        severity: 'critical',
        confidence: 0.95,
        details: 'Connexions depuis des locations géographiquement impossibles',
        recommendations: ['Bloquer l\'accès immédiatement', 'Exiger une re-authentification'],
        detectedAt: new Date().toISOString(),
        africaSpecific: false
      });
    }

    return threats;
  },

  /**
   * Obtient les normes comportementales locales
   */
  async getLocalBehaviorNorms() {
    // Normes adaptées au contexte sénégalais
    return {
      maxDailyConnections: 8, // Connexions typiques au Sénégal
      averageSessionDuration: 45, // minutes
      typicalDeviceTypes: ['mobile', 'smartphone'],
      commonPaymentMethods: ['orange_money', 'wave', 'cash'],
      peakHours: ['18:00-22:00', '12:00-14:00'],
      weekendUsage: 1.5 // multiplicateur pour les weekends
    };
  },

  /**
   * Enregistre les événements de sécurité
   */
  async logSecurityEvents(threats: SecurityThreat[]) {
    for (const threat of threats) {
      await supabase.from('events').insert({
        event_type: 'security',
        event_name: threat.threatType,
        user_id: threat.userId,
        event_data: {
          threatId: threat.id,
          severity: threat.severity,
          confidence: threat.confidence,
          details: threat.details,
          africaSpecific: threat.africaSpecific
        }
      });
    }
  },

  // Fonctions utilitaires
  calculateConnectionFrequency(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    const daysDiff = Math.max(1, Math.ceil(
      (Date.now() - new Date(sessions[sessions.length - 1].started_at).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return sessions.length / daysDiff;
  },

  calculateAverageSessionDuration(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
    return totalDuration / sessions.length;
  },

  extractDeviceFingerprint(sessions: any[]): string {
    const devices = sessions.map(s => s.device_info || {}).filter(d => Object.keys(d).length > 0);
    return JSON.stringify(devices);
  },

  extractLocationPattern(sessions: any[]): string[] {
    return sessions.map(s => s.device_info?.location || 'unknown').filter(l => l !== 'unknown');
  },

  extractPaymentPattern(transactions: any[]): string[] {
    return transactions.map(t => `${t.amount}_${t.status}_${t.payment_method_id}`);
  },

  extractTimePattern(sessions: any[]): string[] {
    return sessions.map(s => new Date(s.started_at).getHours().toString());
  },

  extractUniqueDeviceCount(deviceFingerprint: string): number {
    try {
      const devices = JSON.parse(deviceFingerprint);
      const uniqueDevices = new Set(devices.map((d: any) => `${d.userAgent}_${d.screen}`));
      return uniqueDevices.size;
    } catch {
      return 1;
    }
  },

  detectImpossibleTravel(locations: string[]): string[] {
    // Implémentation simplifiée - à enrichir avec la géolocalisation réelle
    const uniqueLocations = [...new Set(locations)];
    if (uniqueLocations.length > 3) {
      return uniqueLocations.slice(3); // Retourne les locations suspectes
    }
    return [];
  }
};
