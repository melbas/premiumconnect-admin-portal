
import React from "react";
import ChartComponent from "../ChartComponent";
import { ChartTypeRegistry } from 'chart.js';

interface UserActivityData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
  }>;
}

interface UserActivitySectionProps {
  chartData: UserActivityData;
}

const UserActivitySection = ({ chartData }: UserActivitySectionProps) => {
  return (
    <div className="lg:col-span-2 dashboard-card">
      <h2 className="font-medium text-lg mb-4">Monthly Active Users</h2>
      <ChartComponent 
        type="line" 
        data={chartData} 
        height={300}
      />
    </div>
  );
};

export default UserActivitySection;
