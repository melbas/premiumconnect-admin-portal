
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  DollarSign,
  AlertTriangle,
  LayoutDashboard as Layout
} from 'lucide-react';
import { overviewMetrics } from '../../mockData';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

// Component to render individual metric card
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold mt-1">{value}</h2>
            {change && (
              <p className={`text-xs flex items-center mt-1 ${change.isPositive ? "text-success" : "text-danger"}`}>
                {change.isPositive ? "↑" : "↓"} {change.value}%
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to render metrics overview
const MetricsOverview: React.FC = () => {
  // Function to render the appropriate icon based on iconType
  const getIconForType = (iconType: string) => {
    switch (iconType) {
      case "layout":
        return <Layout size={24} className="text-primary" />;
      case "dollar":
        return <DollarSign size={24} className="text-primary" />;
      case "users":
        return <Users size={24} className="text-primary" />;
      case "alert-triangle":
        return <AlertTriangle size={24} className="text-primary" />;
      default:
        return <Users size={24} className="text-primary" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {overviewMetrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={getIconForType(metric.iconType)}
          change={metric.change}
        />
      ))}
    </div>
  );
};

export default MetricsOverview;
