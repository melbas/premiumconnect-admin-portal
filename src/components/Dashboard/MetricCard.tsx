
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  change,
  bgColor = "bg-card"
}: MetricCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg shadow p-5 card-hover`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          <div className="flex items-center mt-2">
            <div className={`flex items-center ${change.isPositive ? 'text-success' : 'text-danger'}`}>
              {change.isPositive ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="text-xs font-medium">
                {change.value}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              vs last month
            </span>
          </div>
        </div>
        
        <div className="p-3 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
