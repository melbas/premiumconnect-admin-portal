import { useState, useEffect } from 'react';
import { UserRole, BusinessWidget } from '@/types/business';

const DEFAULT_WIDGETS: Record<UserRole, BusinessWidget[]> = {
  ceo: [
    {
      id: 'mrr-trend',
      title: 'MRR & Revenus',
      type: 'chart',
      section: 'finance-ventes',
      roles: ['ceo', 'manager'],
      size: 'large',
      priority: 1
    },
    {
      id: 'sites-overview',
      title: 'Vue d\'ensemble Sites',
      type: 'map',
      section: 'sites-infrastructure',
      roles: ['ceo', 'manager'],
      size: 'large',
      priority: 2
    },
    {
      id: 'user-growth',
      title: 'Croissance Utilisateurs',
      type: 'chart',
      section: 'clients-engagement',
      roles: ['ceo', 'manager'],
      size: 'medium',
      priority: 3
    },
    {
      id: 'ai-insights',
      title: 'Insights IA',
      type: 'alert',
      section: 'intelligence',
      roles: ['ceo', 'manager'],
      size: 'medium',
      priority: 4
    }
  ],
  manager: [
    {
      id: 'sites-status',
      title: 'Statut des Sites',
      type: 'table',
      section: 'sites-infrastructure',
      roles: ['manager', 'technicien'],
      size: 'large',
      priority: 1
    },
    {
      id: 'revenue-breakdown',
      title: 'Répartition Revenus',
      type: 'chart',
      section: 'finance-ventes',
      roles: ['manager'],
      size: 'medium',
      priority: 2
    },
    {
      id: 'campaign-performance',
      title: 'Performance Campagnes',
      type: 'metric',
      section: 'clients-engagement',
      roles: ['manager', 'commercial'],
      size: 'medium',
      priority: 3
    }
  ],
  technicien: [
    {
      id: 'network-alerts',
      title: 'Alertes Réseau',
      type: 'alert',
      section: 'sites-infrastructure',
      roles: ['technicien'],
      size: 'large',
      priority: 1
    },
    {
      id: 'equipment-status',
      title: 'Statut Équipements',
      type: 'table',
      section: 'sites-infrastructure',
      roles: ['technicien'],
      size: 'large',
      priority: 2
    },
    {
      id: 'performance-metrics',
      title: 'Métriques Performance',
      type: 'chart',
      section: 'sites-infrastructure',
      roles: ['technicien'],
      size: 'medium',
      priority: 3
    }
  ],
  commercial: [
    {
      id: 'portal-conversion',
      title: 'Conversion Portails',
      type: 'metric',
      section: 'clients-engagement',
      roles: ['commercial'],
      size: 'large',
      priority: 1
    },
    {
      id: 'user-segments',
      title: 'Segments Utilisateurs',
      type: 'chart',
      section: 'clients-engagement',
      roles: ['commercial'],
      size: 'medium',
      priority: 2
    },
    {
      id: 'campaign-roi',
      title: 'ROI Campagnes',
      type: 'metric',
      section: 'clients-engagement',
      roles: ['commercial'],
      size: 'medium',
      priority: 3
    }
  ],
  support: [
    {
      id: 'user-activity',
      title: 'Activité Utilisateurs',
      type: 'table',
      section: 'clients-engagement',
      roles: ['support'],
      size: 'large',
      priority: 1
    },
    {
      id: 'support-tickets',
      title: 'Tickets Support',
      type: 'table',
      section: 'administration',
      roles: ['support'],
      size: 'medium',
      priority: 2
    }
  ]
};

export const useBusinessDashboard = (userRole: UserRole) => {
  const [widgets, setWidgets] = useState<BusinessWidget[]>([]);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load default widgets for role
    const defaultWidgets = DEFAULT_WIDGETS[userRole] || [];
    setWidgets(defaultWidgets);

    // Load user customizations from localStorage
    const saved = localStorage.getItem(`dashboard-${userRole}`);
    if (saved) {
      try {
        setCustomizations(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading dashboard customizations:', error);
      }
    }
  }, [userRole]);

  const addWidget = (widget: BusinessWidget) => {
    setWidgets(prev => [...prev, widget]);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const updateWidget = (widgetId: string, updates: Partial<BusinessWidget>) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  };

  const saveCustomizations = () => {
    const config = {
      widgets: widgets.map(w => ({ id: w.id, size: w.size, priority: w.priority })),
      customizations
    };
    localStorage.setItem(`dashboard-${userRole}`, JSON.stringify(config));
  };

  const resetToDefaults = () => {
    setWidgets(DEFAULT_WIDGETS[userRole] || []);
    setCustomizations({});
    localStorage.removeItem(`dashboard-${userRole}`);
  };

  return {
    widgets: widgets.sort((a, b) => a.priority - b.priority),
    customizations,
    addWidget,
    removeWidget,
    updateWidget,
    saveCustomizations,
    resetToDefaults
  };
};