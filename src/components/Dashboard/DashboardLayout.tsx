
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { MobileNav } from "@/components/ui/mobile-nav";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardLayout = ({ children, activeTab, setActiveTab }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Close sidebar on small screens by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Notify user when they switch tabs
  useEffect(() => {
    if (user) {
      toast({
        title: `Onglet ${activeTab}`,
        description: `Vous avez accédé à l'onglet ${activeTab}`,
        duration: 2000,
      });
    }
  }, [activeTab, user, toast]);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="relative">
          {/* Overlay for small screens */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-10 md:hidden" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar component with z-index to appear above overlay */}
          <div className={`fixed md:relative z-20 h-full transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
          }`}>
            <Sidebar 
              isOpen={sidebarOpen} 
              setIsOpen={setSidebarOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          mobileNav={isMobile ? (
            <MobileNav>
              <Sidebar 
                isOpen={true} 
                setIsOpen={() => {}}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={true}
              />
            </MobileNav>
          ) : undefined}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          {children}
        </main>
        <footer className="text-center py-3 text-xs text-muted-foreground border-t border-border">
          Powered by WifiSénégal.com &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
