
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import ClientsManagement from "@/components/Dashboard/ClientsManagement";
import SalesManagement from "@/components/Dashboard/SalesManagement";
import Statistics from "@/components/Dashboard/Statistics";
import Discussions from "@/components/Dashboard/Discussions";
import Settings from "@/components/Dashboard/Settings";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();

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
        return (
          <>
            <div className="mb-6 flex justify-end gap-3">
              {!isAuthenticated ? (
                <Link to="/login">
                  <Button variant="default">Connexion Admin</Button>
                </Link>
              ) : (
                <Link to="/super-admin">
                  <Button variant="outline">Accéder au Super Admin Dashboard</Button>
                </Link>
              )}
            </div>
            <DashboardOverview />
          </>
        );
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
