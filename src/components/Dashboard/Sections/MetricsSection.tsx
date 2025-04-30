
import React from "react";
import MetricCard from "../MetricCard";
import { Users, DollarSign, CreditCard, UserCheck } from "lucide-react";
import { Metric } from "../mockData";

interface MetricsSectionProps {
  metrics: Metric[];
}

const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  // Function to render the appropriate icon based on iconType
  const getIconForType = (iconType: string) => {
    switch (iconType) {
      case "users":
        return <Users size={24} className="text-primary" />;
      case "dollar":
        return <DollarSign size={24} className="text-primary" />;
      case "credit-card":
        return <CreditCard size={24} className="text-primary" />;
      case "user-check":
        return <UserCheck size={24} className="text-primary" />;
      default:
        return <Users size={24} className="text-primary" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((metric, index) => (
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

export default MetricsSection;
