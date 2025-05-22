
import React from "react";
import { ChartComponent } from "../Chart";
import { ChartData } from "../Chart/chartTypes";

interface UserActivitySectionProps {
  chartData: ChartData;
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
