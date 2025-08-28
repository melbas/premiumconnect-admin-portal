import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, BarChart3, MapPin, Users, Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { useBusinessDashboard } from '@/hooks/useBusinessDashboard';
import { useNavigationContext } from '@/hooks/useNavigationContext';
import { UserRole, BusinessWidget } from '@/types/business';

// Widget components imports
import MetricsOverview from './Tabs/OverviewComponents/MetricsOverview';
import RevenueChart from './Tabs/OverviewComponents/RevenueChart';
import SitesMap from './Tabs/SitesComponents/SitesMap';
import SecurityAlerts from '@/components/AI/SecurityAlerts';

interface BusinessDashboardProps {
  userRole: UserRole;
  onSectionChange: (section: string) => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ 
  userRole, 
  onSectionChange 
}) => {
  const { widgets, addWidget, removeWidget, saveCustomizations } = useBusinessDashboard(userRole);
  const { context, navigateToSection } = useNavigationContext();
  const [isCustomizing, setIsCustomizing] = useState(false);

  const renderWidget = (widget: BusinessWidget) => {
    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-2', 
      large: 'col-span-3'
    };

    return (
      <Card key={widget.id} className={`${sizeClasses[widget.size]} relative group`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {widget.section.replace('-', ' ')}
            </Badge>
            {isCustomizing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWidget(widget.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {renderWidgetContent(widget)}
        </CardContent>
      </Card>
    );
  };

  const renderWidgetContent = (widget: BusinessWidget) => {
    switch (widget.id) {
      case 'mrr-trend':
        return <RevenueChart />;
      case 'sites-overview':
      case 'sites-status':
        return (
          <div className="h-48">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Carte des Sites</p>
              </div>
            </div>
          </div>
        );
      case 'network-alerts':
      case 'ai-insights':
        return <SecurityAlerts />;
      case 'revenue-breakdown':
      case 'user-growth':
        return <MetricsOverview />;
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Widget {widget.title}</p>
            </div>
          </div>
        );
    }
  };

  const getWelcomeMessage = () => {
    const roleMessages = {
      ceo: 'Vue d\'ensemble de votre business Wi-Fi',
      manager: 'Pilotage opérationnel et performance',
      technicien: 'Monitoring réseau et infrastructure',
      commercial: 'Conversion et engagement clients',
      support: 'Support client et satisfaction'
    };
    return roleMessages[userRole] || 'Tableau de bord personnalisé';
  };

  const getQuickActions = () => {
    const roleActions = {
      ceo: [
        { label: 'Analyse Financière', icon: TrendingUp, action: () => onSectionChange('finance-ventes') },
        { label: 'Insights IA', icon: Brain, action: () => onSectionChange('intelligence') }
      ],
      manager: [
        { label: 'Gérer Sites', icon: MapPin, action: () => onSectionChange('sites-infrastructure') },
        { label: 'Analytics', icon: BarChart3, action: () => onSectionChange('finance-ventes') }
      ],
      technicien: [
        { label: 'Infrastructure', icon: MapPin, action: () => onSectionChange('sites-infrastructure') },
        { label: 'Alertes', icon: AlertTriangle, action: () => onSectionChange('sites-infrastructure') }
      ],
      commercial: [
        { label: 'Portails Captifs', icon: Users, action: () => onSectionChange('clients-engagement') },
        { label: 'Campagnes', icon: BarChart3, action: () => onSectionChange('clients-engagement') }
      ],
      support: [
        { label: 'Utilisateurs', icon: Users, action: () => onSectionChange('clients-engagement') },
        { label: 'Tickets', icon: AlertTriangle, action: () => onSectionChange('administration') }
      ]
    };
    return roleActions[userRole] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Tableau de Bord {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </h1>
          <p className="text-muted-foreground">{getWelcomeMessage()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isCustomizing ? 'Terminer' : 'Personnaliser'}
          </Button>
          {isCustomizing && (
            <Button onClick={saveCustomizations} size="sm">
              Sauvegarder
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contextual Suggestions */}
      {context.suggestedActions.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Suggestions Contextuelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {context.suggestedActions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={suggestion.action}
                  className="text-xs"
                >
                  {suggestion.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {widgets.map(renderWidget)}
        
        {isCustomizing && (
          <Card className="col-span-1 border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <CardContent className="flex items-center justify-center h-48">
              <Button variant="ghost" className="h-full w-full flex-col gap-2">
                <Plus className="h-8 w-8" />
                <span>Ajouter Widget</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;