
import React, { useState } from "react";
import { 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Mail, 
  Save,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  // User profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com"
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: document.documentElement.classList.contains("dark"),
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    salesReports: true
  });
  
  // Form handling
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    
    // Special handling for dark mode
    if (key === "darkMode") {
      const newDarkMode = !preferences.darkMode;
      document.documentElement.classList.toggle("dark", newDarkMode);
      localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    }
  };
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving settings
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    }, 500);
  };

  return (
    <div className="animate-enter">
      <h1 className="dashboard-title">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 dashboard-card">
          <h2 className="font-medium text-lg mb-6">Profile Settings</h2>
          
          <form onSubmit={handleSaveSettings}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center text-muted-foreground">
                    <User size={32} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                    <button 
                      type="button" 
                      className="text-sm text-primary hover:underline mt-1"
                    >
                      Change avatar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full pl-10 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full pl-10 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <button 
                  type="submit"
                  className="btn btn-primary flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Preferences */}
        <div className="dashboard-card">
          <h2 className="font-medium text-lg mb-6">Preferences</h2>
          
          <div className="space-y-6">
            {/* Dark Mode */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-primary/10 mr-3">
                  {preferences.darkMode ? (
                    <Moon size={18} className="text-primary" />
                  ) : (
                    <Sun size={18} className="text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">
                    {preferences.darkMode ? "Dark Mode" : "Light Mode"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {preferences.darkMode 
                      ? "Switch to light theme" 
                      : "Switch to dark theme"
                    }
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("darkMode")}
                className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${
                  preferences.darkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                    preferences.darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            {/* Notifications Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <div className="flex items-center mx-3">
                <Bell size={14} className="mr-2 text-muted-foreground" />
                <span className="text-xs font-medium">Notifications</span>
              </div>
              <div className="flex-grow border-t border-border"></div>
            </div>
            
            {/* Notification Settings */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("emailNotifications")}
                  className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${
                    preferences.emailNotifications ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">SMS Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("smsNotifications")}
                  className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${
                    preferences.smsNotifications ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                      preferences.smsNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Login Alerts</h3>
                  <p className="text-xs text-muted-foreground">
                    Get notified about new logins
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("loginAlerts")}
                  className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${
                    preferences.loginAlerts ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                      preferences.loginAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Sales Reports</h3>
                  <p className="text-xs text-muted-foreground">
                    Daily summary of sales
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("salesReports")}
                  className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${
                    preferences.salesReports ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                      preferences.salesReports ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {/* Save Button */}
            <div>
              <button
                onClick={handleSaveSettings}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <Check size={16} className="mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
