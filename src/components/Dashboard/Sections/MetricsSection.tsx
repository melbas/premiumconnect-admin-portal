
import React from "react";
import MetricCard from "../MetricCard";
import { Users, DollarSign, CreditCard, UserCheck } from "lucide-react";

interface MetricsSectionProps {
  metrics: {
    title: string;
    value: string;
    icon: React.ReactNode;
    change: { value: number; isPositive: boolean };
  }[];
}

const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={index} 
          title={metric.title} 
          value={metric.value} 
          icon={metric.icon} 
          change={metric.change} 
        />
      ))}
    </div>
  );
};

export default MetricsSection;
