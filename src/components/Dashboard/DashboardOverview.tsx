
import React from "react";
import MetricsSection from "./Sections/MetricsSection";
import UserActivitySection from "./Sections/UserActivitySection";
import ChatSection from "./Sections/ChatSection";
import RecentSalesSection from "./Sections/RecentSalesSection";
import NewUsersSection from "./Sections/NewUsersSection";
import { 
  dashboardMetrics, 
  userActivityChartData, 
  chatMessages, 
  recentSales, 
  newUsers 
} from "./mockData";

const DashboardOverview = () => {
  return (
    <div className="animate-enter">
      <h1 className="dashboard-title mb-8">Dashboard Overview</h1>
      
      {/* Metrics Section */}
      <MetricsSection metrics={dashboardMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart */}
        <UserActivitySection chartData={userActivityChartData} />
        
        {/* Chat Section */}
        <ChatSection initialMessages={chatMessages} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Sales */}
        <RecentSalesSection sales={recentSales} />
        
        {/* New Users */}
        <NewUsersSection users={newUsers} />
      </div>
    </div>
  );
};

export default DashboardOverview;
