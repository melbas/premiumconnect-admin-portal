export type BusinessSection = 
  | 'dashboard'
  | 'sites-infrastructure' 
  | 'clients-engagement'
  | 'finance-ventes'
  | 'intelligence'
  | 'administration';

export type UserRole = 'ceo' | 'manager' | 'technicien' | 'commercial' | 'support';

export interface BusinessWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'map' | 'alert';
  section: BusinessSection;
  roles: UserRole[];
  size: 'small' | 'medium' | 'large';
  priority: number;
}

export interface NavigationContext {
  currentSection: BusinessSection;
  breadcrumb: Array<{
    label: string;
    section: BusinessSection;
    subsection?: string;
  }>;
  suggestedActions: Array<{
    label: string;
    action: () => void;
    section: BusinessSection;
  }>;
}

export interface BusinessMenuItem {
  id: string;
  label: string;
  section: BusinessSection;
  icon: any;
  description: string;
  subsections?: Array<{
    id: string;
    label: string;
    path: string;
    icon?: any;
  }>;
}