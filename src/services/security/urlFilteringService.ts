import { supabase } from '@/integrations/supabase/client';

export interface URLFilterRule {
  id: string;
  category: 'malware' | 'phishing' | 'adult' | 'gambling' | 'social' | 'gaming' | 'custom';
  pattern: string;
  action: 'block' | 'warn' | 'monitor';
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilteredRequest {
  id: string;
  userId: string;
  url: string;
  category: string;
  action: string;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

export const urlFilteringService = {
  /**
   * Vérifie si une URL doit être filtrée selon les règles actives
   */
  async checkURL(url: string, userId?: string): Promise<{
    blocked: boolean;
    category?: string;
    reason?: string;
    ruleId?: string;
  }> {
    try {
      const rules = await this.getActiveRules();
      
      for (const rule of rules) {
        if (this.matchesPattern(url, rule.pattern)) {
          // Log la tentative d'accès
          if (userId) {
            await this.logFilteredRequest({
              userId,
              url,
              category: rule.category,
              action: rule.action,
              ruleId: rule.id
            });
          }

          return {
            blocked: rule.action === 'block',
            category: rule.category,
            reason: rule.description,
            ruleId: rule.id
          };
        }
      }

      return { blocked: false };
    } catch (error) {
      console.error('❌ Error checking URL:', error);
      return { blocked: false };
    }
  },

  /**
   * Obtient toutes les règles actives de filtrage
   */
  async getActiveRules(): Promise<URLFilterRule[]> {
    // En production, ces règles viendraient de la base de données
    // Pour l'instant, on utilise des règles par défaut
    return this.getDefaultRules().filter(rule => rule.isActive);
  },

  /**
   * Règles par défaut adaptées au contexte sénégalais
   */
  getDefaultRules(): URLFilterRule[] {
    return [
      // Sécurité - Malware
      {
        id: 'malware-1',
        category: 'malware',
        pattern: '.*\\.(exe|bat|scr|pif|com)$',
        action: 'block',
        isActive: true,
        description: 'Fichiers exécutables potentiellement dangereux',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      
      // Phishing
      {
        id: 'phishing-1',
        category: 'phishing',
        pattern: '.*(paypal-secure|bank-verify|login-security).*',
        action: 'block',
        isActive: true,
        description: 'Sites de phishing courants',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Contenu adulte (optionnel selon la politique)
      {
        id: 'adult-1',
        category: 'adult',
        pattern: '.*(adult|xxx|porn).*',
        action: 'warn',
        isActive: false, // Désactivé par défaut
        description: 'Contenu réservé aux adultes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Réseaux sociaux (gestion de bande passante)
      {
        id: 'social-1',
        category: 'social',
        pattern: '.*(facebook|twitter|instagram|tiktok).*',
        action: 'monitor',
        isActive: true,
        description: 'Réseaux sociaux - monitoring de bande passante',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Gaming/Streaming (gestion de bande passante)
      {
        id: 'gaming-1',
        category: 'gaming',
        pattern: '.*(twitch|youtube|netflix|steam).*',
        action: 'monitor',
        isActive: true,
        description: 'Streaming et gaming - gestion bande passante',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  },

  /**
   * Vérifie si une URL correspond à un pattern
   */
  matchesPattern(url: string, pattern: string): boolean {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(url);
    } catch (error) {
      console.error('Invalid regex pattern:', pattern);
      return false;
    }
  },

  /**
   * Enregistre une requête filtrée
   */
  async logFilteredRequest(data: {
    userId: string;
    url: string;
    category: string;
    action: string;
    ruleId: string;
  }) {
    try {
      await supabase.from('events').insert({
        event_type: 'security',
        event_name: 'url_filtered',
        user_id: data.userId,
        event_data: {
          url: data.url,
          category: data.category,
          action: data.action,
          ruleId: data.ruleId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging filtered request:', error);
    }
  },

  /**
   * Obtient les statistiques de filtrage
   */
  async getFilteringStats(timeRange: 'day' | 'week' | 'month' = 'day') {
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
        .eq('event_name', 'url_filtered')
        .gte('created_at', startDate.toISOString());

      const stats = {
        totalFiltered: events?.length || 0,
        byCategory: {} as Record<string, number>,
        byAction: {} as Record<string, number>,
        topBlockedSites: [] as { url: string; count: number }[]
      };

      events?.forEach(event => {
        const data = event.event_data as any;
        stats.byCategory[data.category] = (stats.byCategory[data.category] || 0) + 1;
        stats.byAction[data.action] = (stats.byAction[data.action] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting filtering stats:', error);
      return {
        totalFiltered: 0,
        byCategory: {},
        byAction: {},
        topBlockedSites: []
      };
    }
  },

  /**
   * Met à jour une règle de filtrage
   */
  async updateRule(ruleId: string, updates: Partial<URLFilterRule>) {
    // En production, cela mettrait à jour la base de données
    console.log('🔧 Updating filter rule:', ruleId, updates);
    return true;
  },

  /**
   * Crée une nouvelle règle de filtrage
   */
  async createRule(rule: Omit<URLFilterRule, 'id' | 'createdAt' | 'updatedAt'>) {
    const newRule: URLFilterRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // En production, cela sauvegarderait en base
    console.log('🆕 Creating new filter rule:', newRule);
    return newRule;
  },

  /**
   * Supprime une règle de filtrage
   */
  async deleteRule(ruleId: string) {
    // En production, cela supprimerait de la base
    console.log('🗑️ Deleting filter rule:', ruleId);
    return true;
  }
};