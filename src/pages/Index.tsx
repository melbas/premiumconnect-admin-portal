
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import ClientsManagement from "@/components/Dashboard/ClientsManagement";
import SalesManagement from "@/components/Dashboard/SalesManagement";
import Statistics from "@/components/Dashboard/Statistics";
import Discussions from "@/components/Dashboard/Discussions";
import Settings from "@/components/Dashboard/Settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  // Handle initial theme setup
  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Don't render until after client-side hydration
  if (!mounted) {
    return null;
  }

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "clients":
        return <ClientsManagement />;
      case "sales":
        return <SalesManagement />;
      case "statistics":
        return <Statistics />;
      case "discussions":
        return <Discussions />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Index;
