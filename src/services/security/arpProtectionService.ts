import { supabase } from '@/integrations/supabase/client';

export interface ARPEntry {
  ipAddress: string;
  macAddress: string;
  hostname?: string;
  lastSeen: string;
  isStatic: boolean;
  isTrusted: boolean;
}

export interface ARPAnomaly {
  id: string;
  type: 'arp_spoofing' | 'duplicate_ip' | 'unknown_device' | 'mac_flapping';
  sourceIP: string;
  sourceMac: string;
  targetIP?: string;
  targetMac?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  resolved: boolean;
}

export const arpProtectionService = {
  /**
   * Surveille la table ARP pour détecter les anomalies
   */
  async monitorARPTable(): Promise<ARPAnomaly[]> {
    try {
      console.log('🛡️ Monitoring ARP table for anomalies...');
      
      const currentTable = await this.getCurrentARPTable();
      const knownDevices = await this.getKnownDevices();
      const anomalies: ARPAnomaly[] = [];

      // Détection du spoofing ARP
      anomalies.push(...await this.detectARPSpoofing(currentTable, knownDevices));
      
      // Détection des IP dupliquées
      anomalies.push(...await this.detectDuplicateIPs(currentTable));
      
      // Détection des appareils inconnus
      anomalies.push(...await this.detectUnknownDevices(currentTable, knownDevices));
      
      // Détection du MAC flapping
      anomalies.push(...await this.detectMACFlapping(currentTable));

      // Enregistrer les anomalies détectées
      if (anomalies.length > 0) {
        await this.logAnomalies(anomalies);
      }

      return anomalies;
    } catch (error) {
      console.error('❌ Error monitoring ARP table:', error);
      return [];
    }
  },

  /**
   * Obtient la table ARP actuelle (simulation)
   */
  async getCurrentARPTable(): Promise<ARPEntry[]> {
    // En production, cela ferait appel aux équipements réseau
    // Simulation avec des données d'exemple
    return [
      {
        ipAddress: '192.168.1.10',
        macAddress: '00:11:22:33:44:55',
        hostname: 'smartphone-user1',
        lastSeen: new Date().toISOString(),
        isStatic: false,
        isTrusted: true
      },
      {
        ipAddress: '192.168.1.11',
        macAddress: '00:11:22:33:44:56',
        hostname: 'laptop-user2',
        lastSeen: new Date(Date.now() - 60000).toISOString(),
        isStatic: false,
        isTrusted: true
      },
      // Simulation d'une entrée suspecte
      {
        ipAddress: '192.168.1.1', // IP de la passerelle
        macAddress: 'aa:bb:cc:dd:ee:ff', // MAC différente
        lastSeen: new Date().toISOString(),
        isStatic: false,
        isTrusted: false
      }
    ];
  },

  /**
   * Obtient la liste des appareils connus et autorisés
   */
  async getKnownDevices(): Promise<ARPEntry[]> {
    // En production, cela viendrait de la base de données
    return [
      {
        ipAddress: '192.168.1.1',
        macAddress: '00:aa:bb:cc:dd:ee', // MAC légitime de la passerelle
        hostname: 'gateway',
        lastSeen: new Date().toISOString(),
        isStatic: true,
        isTrusted: true
      },
      {
        ipAddress: '192.168.1.10',
        macAddress: '00:11:22:33:44:55',
        hostname: 'smartphone-user1',
        lastSeen: new Date().toISOString(),
        isStatic: false,
        isTrusted: true
      }
    ];
  },

  /**
   * Détecte les tentatives de spoofing ARP
   */
  async detectARPSpoofing(currentTable: ARPEntry[], knownDevices: ARPEntry[]): Promise<ARPAnomaly[]> {
    const anomalies: ARPAnomaly[] = [];

    for (const currentEntry of currentTable) {
      const knownDevice = knownDevices.find(d => d.ipAddress === currentEntry.ipAddress);
      
      if (knownDevice && knownDevice.macAddress !== currentEntry.macAddress) {
        anomalies.push({
          id: `arp-spoof-${Date.now()}-${Math.random()}`,
          type: 'arp_spoofing',
          sourceIP: currentEntry.ipAddress,
          sourceMac: currentEntry.macAddress,
          targetIP: knownDevice.ipAddress,
          targetMac: knownDevice.macAddress,
          severity: knownDevice.isStatic ? 'critical' : 'high',
          description: `Possible ARP spoofing: ${currentEntry.ipAddress} annonce MAC ${currentEntry.macAddress} au lieu de ${knownDevice.macAddress}`,
          detectedAt: new Date().toISOString(),
          resolved: false
        });
      }
    }

    return anomalies;
  },

  /**
   * Détecte les adresses IP dupliquées
   */
  async detectDuplicateIPs(currentTable: ARPEntry[]): Promise<ARPAnomaly[]> {
    const anomalies: ARPAnomaly[] = [];
    const ipCounts = new Map<string, ARPEntry[]>();

    // Grouper par IP
    currentTable.forEach(entry => {
      if (!ipCounts.has(entry.ipAddress)) {
        ipCounts.set(entry.ipAddress, []);
      }
      ipCounts.get(entry.ipAddress)!.push(entry);
    });

    // Détecter les doublons
    for (const [ip, entries] of ipCounts) {
      if (entries.length > 1) {
        anomalies.push({
          id: `dup-ip-${Date.now()}-${Math.random()}`,
          type: 'duplicate_ip',
          sourceIP: ip,
          sourceMac: entries.map(e => e.macAddress).join(', '),
          severity: 'high',
          description: `IP dupliquée détectée: ${ip} utilisée par ${entries.length} appareils différents`,
          detectedAt: new Date().toISOString(),
          resolved: false
        });
      }
    }

    return anomalies;
  },

  /**
   * Détecte les appareils inconnus
   */
  async detectUnknownDevices(currentTable: ARPEntry[], knownDevices: ARPEntry[]): Promise<ARPAnomaly[]> {
    const anomalies: ARPAnomaly[] = [];
    const knownMacs = new Set(knownDevices.map(d => d.macAddress));

    for (const entry of currentTable) {
      if (!knownMacs.has(entry.macAddress) && !entry.isTrusted) {
        anomalies.push({
          id: `unknown-dev-${Date.now()}-${Math.random()}`,
          type: 'unknown_device',
          sourceIP: entry.ipAddress,
          sourceMac: entry.macAddress,
          severity: 'medium',
          description: `Appareil inconnu détecté: ${entry.macAddress} à l'adresse ${entry.ipAddress}`,
          detectedAt: new Date().toISOString(),
          resolved: false
        });
      }
    }

    return anomalies;
  },

  /**
   * Détecte le MAC flapping (changement rapide d'adresse MAC)
   */
  async detectMACFlapping(currentTable: ARPEntry[]): Promise<ARPAnomaly[]> {
    // Implémentation simplifiée - en production, cela nécessiterait un historique
    const anomalies: ARPAnomaly[] = [];
    
    // Cette fonction nécessiterait un historique des tables ARP précédentes
    // Pour l'instant, on simule une détection basique
    
    return anomalies;
  },

  /**
   * Enregistre les anomalies détectées
   */
  async logAnomalies(anomalies: ARPAnomaly[]) {
    for (const anomaly of anomalies) {
      try {
        // Enregistrer en tant qu'événement de sécurité
        await supabase.from('events').insert({
          event_type: 'security',
          event_name: 'arp_anomaly',
          event_data: {
            anomalyType: anomaly.type,
            sourceIP: anomaly.sourceIP,
            sourceMac: anomaly.sourceMac,
            targetIP: anomaly.targetIP,
            targetMac: anomaly.targetMac,
            severity: anomaly.severity,
            description: anomaly.description
          }
        });

        // Créer une alerte de sécurité si c'est critique
        if (anomaly.severity === 'critical' || anomaly.severity === 'high') {
          await supabase.from('security_alerts').insert({
            alert_type: 'arp_protection',
            severity: anomaly.severity === 'critical' ? 'critical' : 'danger',
            title: `Anomalie ARP détectée: ${anomaly.type}`,
            description: anomaly.description,
            metadata: {
              sourceIP: anomaly.sourceIP,
              sourceMac: anomaly.sourceMac,
              targetIP: anomaly.targetIP,
              targetMac: anomaly.targetMac
            }
          });
        }
      } catch (error) {
        console.error('Error logging ARP anomaly:', error);
      }
    }
  },

  /**
   * Obtient les statistiques de protection ARP
   */
  async getProtectionStats(timeRange: 'day' | 'week' | 'month' = 'day') {
    try {
      const startDate = new Date();
      switch (timeRange) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }

      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('event_name', 'arp_anomaly')
        .gte('created_at', startDate.toISOString());

      const stats = {
        totalAnomalies: events?.length || 0,
        byType: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>,
        activeThreats: 0
      };

      events?.forEach(event => {
        const data = event.event_data as any;
        stats.byType[data.anomalyType] = (stats.byType[data.anomalyType] || 0) + 1;
        stats.bySeverity[data.severity] = (stats.bySeverity[data.severity] || 0) + 1;
      });

      // Compter les menaces actives (non résolues)
      const { data: activeAlerts } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('alert_type', 'arp_protection')
        .eq('is_resolved', false);

      stats.activeThreats = activeAlerts?.length || 0;

      return stats;
    } catch (error) {
      console.error('Error getting ARP protection stats:', error);
      return {
        totalAnomalies: 0,
        byType: {},
        bySeverity: {},
        activeThreats: 0
      };
    }
  },

  /**
   * Ajoute un appareil à la liste des appareils de confiance
   */
  async trustDevice(ipAddress: string, macAddress: string, hostname?: string) {
    try {
      // En production, cela ajouterait l'appareil à la whitelist
      console.log('✅ Trusting device:', { ipAddress, macAddress, hostname });
      
      await supabase.from('events').insert({
        event_type: 'security',
        event_name: 'device_trusted',
        event_data: {
          ipAddress,
          macAddress,
          hostname,
          trustedAt: new Date().toISOString()
        }
      });

      return true;
    } catch (error) {
      console.error('Error trusting device:', error);
      return false;
    }
  },

  /**
   * Bloque un appareil suspect
   */
  async blockDevice(ipAddress: string, macAddress: string, reason: string) {
    try {
      console.log('🚫 Blocking device:', { ipAddress, macAddress, reason });
      
      await supabase.from('events').insert({
        event_type: 'security',
        event_name: 'device_blocked',
        event_data: {
          ipAddress,
          macAddress,
          reason,
          blockedAt: new Date().toISOString()
        }
      });

      // Créer une alerte de sécurité
      await supabase.from('security_alerts').insert({
        alert_type: 'device_blocked',
        severity: 'warning',
        title: 'Appareil bloqué',
        description: `Appareil ${macAddress} (${ipAddress}) bloqué: ${reason}`,
        metadata: { ipAddress, macAddress, reason }
      });

      return true;
    } catch (error) {
      console.error('Error blocking device:', error);
      return false;
    }
  }
};