import { useState, useCallback } from 'react';
import { BusinessSection, NavigationContext } from '@/types/business';

const SECTION_LABELS: Record<BusinessSection, string> = {
  'dashboard': 'Tableau de Bord',
  'sites-infrastructure': 'Sites & Infrastructure',
  'clients-engagement': 'Clients & Engagement',
  'finance-ventes': 'Finance & Ventes',
  'intelligence': 'Intelligence',
  'administration': 'Administration'
};

export const useNavigationContext = () => {
  const [context, setContext] = useState<NavigationContext>({
    currentSection: 'dashboard',
    breadcrumb: [],
    suggestedActions: []
  });

  const navigateToSection = useCallback((section: BusinessSection, subsection?: string) => {
    const breadcrumb = [
      { label: 'Accueil', section: 'dashboard' as BusinessSection },
      { label: SECTION_LABELS[section], section, subsection }
    ];

    // Generate contextual suggestions based on current section
    const suggestedActions = getSuggestedActions(section);

    setContext({
      currentSection: section,
      breadcrumb,
      suggestedActions
    });
  }, []);

  const getSuggestedActions = (section: BusinessSection) => {
    switch (section) {
      case 'sites-infrastructure':
        return [
          {
            label: 'Voir Analytics Site',
            action: () => navigateToSection('finance-ventes', 'analytics'),
            section: 'finance-ventes' as BusinessSection
          },
          {
            label: 'Configurer Portail',
            action: () => navigateToSection('clients-engagement', 'portals'),
            section: 'clients-engagement' as BusinessSection
          }
        ];
      case 'clients-engagement':
        return [
          {
            label: 'Analyser Revenus',
            action: () => navigateToSection('finance-ventes', 'analytics'),
            section: 'finance-ventes' as BusinessSection
          },
          {
            label: 'Optimiser avec IA',
            action: () => navigateToSection('intelligence', 'marketing'),
            section: 'intelligence' as BusinessSection
          }
        ];
      case 'finance-ventes':
        return [
          {
            label: 'Gérer Sites Sources',
            action: () => navigateToSection('sites-infrastructure', 'sites'),
            section: 'sites-infrastructure' as BusinessSection
          },
          {
            label: 'Insights IA',
            action: () => navigateToSection('intelligence', 'business'),
            section: 'intelligence' as BusinessSection
          }
        ];
      case 'intelligence':
        return [
          {
            label: 'Appliquer aux Sites',
            action: () => navigateToSection('sites-infrastructure', 'monitoring'),
            section: 'sites-infrastructure' as BusinessSection
          },
          {
            label: 'Créer Campagne',
            action: () => navigateToSection('clients-engagement', 'campaigns'),
            section: 'clients-engagement' as BusinessSection
          }
        ];
      default:
        return [];
    }
  };

  const addBreadcrumbItem = useCallback((label: string, section: BusinessSection, subsection?: string) => {
    setContext(prev => ({
      ...prev,
      breadcrumb: [...prev.breadcrumb, { label, section, subsection }]
    }));
  }, []);

  return {
    context,
    navigateToSection,
    addBreadcrumbItem,
    getSectionLabel: (section: BusinessSection) => SECTION_LABELS[section]
  };
};