
import React from "react";
import ChartComponent from "./ChartComponent";
import { Activity, Clock, Laptop, Smartphone, Tablet, MapPin } from "lucide-react";

const Statistics = () => {
  // Mock data for user activity chart
  const userActivityData = {
    labels: ["01/04", "02/04", "03/04", "04/04", "05/04", "06/04", "07/04", "08/04", "09/04", "10/04", "11/04", "12/04", "13/04", "14/04", "15/04"],
    datasets: [
      {
        label: "Daily Active Users",
        data: [1200, 1150, 1300, 1250, 1400, 1350, 1300, 1450, 1500, 1400, 1600, 1550, 1700, 1650, 1800],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };
  
  // Mock data for device distribution chart
  const deviceDistributionData = {
    labels: ["Smartphone", "Desktop", "Tablet", "Other"],
    datasets: [
      {
        data: [65, 25, 8, 2],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", 
          "rgba(139, 92, 246, 0.7)", 
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)"
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };
  
  // Mock data for location distribution chart
  const locationDistributionData = {
    labels: ["Dakar", "Thiès", "Saint-Louis", "Kaolack", "Ziguinchor", "Other"],
    datasets: [
      {
        label: "User Distribution (%)",
        data: [45, 18, 12, 10, 8, 7],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", 
          "rgba(99, 102, 241, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)"
        ],
        borderWidth: 0,
      }
    ]
  };
  
  // Mock data for hourly activity chart
  const hourlyActivityData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Hourly Activity",
        data: [120, 80, 350, 400, 420, 280],
        backgroundColor: "rgba(139, 92, 246, 0.5)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 2,
        tension: 0.4,
      }
    ]
  };

  // Performance indicators
  const kpis = [
    { 
      title: "Unique Users", 
      value: "3,742", 
      trend: "+12.5%", 
      isPositive: true 
    },
    { 
      title: "Total Sessions", 
      value: "5,891", 
      trend: "+8.2%", 
      isPositive: true 
    },
    { 
      title: "Avg. Session Duration", 
      value: "12m 24s", 
      trend: "+2.3%", 
      isPositive: true 
    },
    { 
      title: "Bounce Rate", 
      value: "23.5%", 
      trend: "-5.1%", 
      isPositive: true 
    },
  ];

  // Most visited pages data
  const mostVisitedPages = [
    { page: "/dashboard", views: 2850, unique: 1420, bounceRate: "21.3%", avgTime: "5m 12s" },
    { page: "/plans", views: 1980, unique: 1650, bounceRate: "18.7%", avgTime: "4m 45s" },
    { page: "/support", views: 1540, unique: 1320, bounceRate: "24.5%", avgTime: "6m 30s" },
    { page: "/profile", views: 1280, unique: 1100, bounceRate: "12.8%", avgTime: "7m 15s" },
    { page: "/billing", views: 950, unique: 820, bounceRate: "19.2%", avgTime: "3m 50s" },
  ];

  return (
    <div className="animate-enter">
      <h1 className="dashboard-title">Statistics</h1>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="dashboard-card card-hover">
            <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">{kpi.value}</h3>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                kpi.isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
              }`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* User Activity Chart (30 Days) */}
      <div className="dashboard-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-lg">User Activity (Last 15 Days)</h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Activity size={18} className="text-primary mr-2" />
              <span className="text-sm font-medium">Daily trend</span>
            </div>
            <select className="text-sm bg-muted/40 border border-border rounded-md px-2 py-1">
              <option value="7">Last 7 days</option>
              <option value="15" selected>Last 15 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
        <ChartComponent 
          type="line" 
          data={userActivityData} 
          height={300}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Device Distribution */}
        <div className="dashboard-card">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-primary/10 mr-3">
              <Laptop size={18} className="text-primary" />
            </div>
            <h2 className="font-medium text-lg">Device Distribution</h2>
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <ChartComponent 
                type="doughnut" 
                data={deviceDistributionData} 
                height={220}
              />
            </div>
            <div className="col-span-1 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[rgba(59,130,246,0.7)] mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Smartphone</span>
                      <span className="text-sm">65%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Smartphone size={12} className="mr-1" />
                      <span>Mobile web & app</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[rgba(139,92,246,0.7)] mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Desktop</span>
                      <span className="text-sm">25%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Laptop size={12} className="mr-1" />
                      <span>Windows & Mac</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[rgba(16,185,129,0.7)] mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Tablet</span>
                      <span className="text-sm">8%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Tablet size={12} className="mr-1" />
                      <span>iPad & Android</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hourly Activity */}
        <div className="dashboard-card">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-accent/10 mr-3">
              <Clock size={18} className="text-accent" />
            </div>
            <h2 className="font-medium text-lg">Hourly Activity</h2>
          </div>
          <ChartComponent 
            type="line" 
            data={hourlyActivityData} 
            height={220}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Location Distribution */}
        <div className="dashboard-card">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-success/10 mr-3">
              <MapPin size={18} className="text-success" />
            </div>
            <h2 className="font-medium text-lg">Location Distribution</h2>
          </div>
          <ChartComponent 
            type="bar" 
            data={locationDistributionData} 
            height={250}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              indexAxis: 'y' as const,
            }}
          />
        </div>
        
        {/* Most Visited Pages */}
        <div className="dashboard-card md:col-span-2">
          <h2 className="font-medium text-lg mb-4">Most Visited Pages</h2>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead className="bg-muted/40">
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Unique Visitors</th>
                  <th>Bounce Rate</th>
                  <th>Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {mostVisitedPages.map((page, index) => (
                  <tr key={index}>
                    <td className="font-medium">{page.page}</td>
                    <td>{page.views.toLocaleString()}</td>
                    <td>{page.unique.toLocaleString()}</td>
                    <td>{page.bounceRate}</td>
                    <td>{page.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
