
import React from "react";
import MetricCard from "./MetricCard";
import ChartComponent from "./ChartComponent";
import Table from "./Table";
import { Users, DollarSign, CreditCard, UserCheck, Phone } from "lucide-react";

const DashboardOverview = () => {
  // Mock data for metrics
  const metrics = [
    {
      title: "Total Users",
      value: "5,283",
      icon: <Users size={24} className="text-primary" />,
      change: { value: 12.5, isPositive: true }
    },
    {
      title: "Daily Sales",
      value: "37",
      icon: <DollarSign size={24} className="text-success" />,
      change: { value: 8.3, isPositive: true }
    },
    {
      title: "Monthly Revenue",
      value: "1,245,000 FCFA",
      icon: <CreditCard size={24} className="text-accent" />,
      change: { value: 4.2, isPositive: true }
    },
    {
      title: "Active Clients",
      value: "3,742",
      icon: <UserCheck size={24} className="text-warning" />,
      change: { value: 2.1, isPositive: false }
    }
  ];

  // Mock data for user activity chart
  const userActivityChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Active Users",
        data: [3200, 3350, 3400, 3650, 3800, 3950, 4100, 4300, 4800, 5000, 5200, 5283],
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

  // Mock data for recent sales
  const recentSales = [
    { id: "S001", client: "Mamadou Diop", plan: "Premium 50", amount: "25,000 FCFA", date: "15/04/2025", status: "Completed" },
    { id: "S002", client: "Fatou Mbaye", plan: "Pro 100", amount: "45,000 FCFA", date: "15/04/2025", status: "Completed" },
    { id: "S003", client: "Ibrahim Seck", plan: "Basic 20", amount: "12,000 FCFA", date: "14/04/2025", status: "Processing" },
    { id: "S004", client: "Aminata Diallo", plan: "Premium 50", amount: "25,000 FCFA", date: "14/04/2025", status: "Completed" },
    { id: "S005", client: "Omar Faye", plan: "Enterprise", amount: "100,000 FCFA", date: "13/04/2025", status: "Completed" },
  ];

  // Mock data for new users
  const newUsers = [
    { id: "U001", name: "Aicha Ndiaye", email: "aicha@example.com", phone: "+221 77 123 4567", date: "15/04/2025", plan: "Basic 20" },
    { id: "U002", name: "Cheikh Diagne", email: "cheikh@example.com", phone: "+221 78 234 5678", date: "14/04/2025", plan: "Pro 100" },
    { id: "U003", name: "Marie Mendy", email: "marie@example.com", phone: "+221 76 345 6789", date: "14/04/2025", plan: "Premium 50" },
    { id: "U004", name: "Abdou Sow", email: "abdou@example.com", phone: "+221 77 456 7890", date: "13/04/2025", plan: "Basic 20" },
    { id: "U005", name: "Rama Gueye", email: "rama@example.com", phone: "+221 70 567 8901", date: "12/04/2025", plan: "Pro 100" },
  ];

  // Recent sales table columns
  const salesColumns = [
    { header: "ID", accessor: "id" },
    { header: "Client", accessor: "client" },
    { header: "Plan", accessor: "plan" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        item.status === "Completed" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
      }`}>
        {item.status}
      </span>
    )},
    { header: "Actions", accessor: () => (
      <div className="flex space-x-2">
        <button className="btn btn-primary py-1 px-2 text-xs">View</button>
        <button className="btn btn-success py-1 px-2 text-xs flex items-center">
          <Phone size={12} className="mr-1" /> WhatsApp
        </button>
      </div>
    )}
  ];

  // New users table columns
  const userColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Date", accessor: "date" },
    { header: "Plan", accessor: "plan" },
    { header: "Actions", accessor: () => (
      <div className="flex space-x-2">
        <button className="btn btn-primary py-1 px-2 text-xs">View</button>
        <button className="btn btn-success py-1 px-2 text-xs flex items-center">
          <Phone size={12} className="mr-1" /> WhatsApp
        </button>
      </div>
    )}
  ];

  // Mock messages for chat
  const messages = [
    { id: 1, content: "Bonjour! Comment puis-je vous aider aujourd'hui?", sender: "admin", timestamp: "10:30" },
    { id: 2, content: "Je rencontre des problèmes avec ma connexion internet.", sender: "user", timestamp: "10:31" },
    { id: 3, content: "Je suis désolé pour ce désagrément. Pouvez-vous me donner plus d'informations sur le problème que vous rencontrez?", sender: "admin", timestamp: "10:32" },
    { id: 4, content: "Ma connexion est très lente depuis 2 jours.", sender: "user", timestamp: "10:33" },
    { id: 5, content: "Avez-vous essayé de redémarrer votre modem?", sender: "admin", timestamp: "10:34" },
  ];

  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log("Message sent:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="animate-enter">
      <h1 className="dashboard-title mb-8">Dashboard Overview</h1>
      
      {/* Metrics */}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart */}
        <div className="lg:col-span-2 dashboard-card">
          <h2 className="font-medium text-lg mb-4">Monthly Active Users</h2>
          <ChartComponent 
            type="line" 
            data={userActivityChartData} 
            height={300}
          />
        </div>
        
        {/* Chat Section */}
        <div className="dashboard-card">
          <h2 className="font-medium text-lg mb-4">Chat Support</h2>
          <div className="flex flex-col h-[300px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex flex-col ${
                    message.sender === "admin" ? "items-start" : "items-end"
                  }`}
                >
                  <div 
                    className={`px-3 py-2 rounded-lg max-w-[85%] ${
                      message.sender === "admin" 
                        ? "bg-muted text-foreground" 
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {message.timestamp}
                  </span>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Sales */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-lg">Recent Sales</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View All
            </button>
          </div>
          <Table 
            columns={salesColumns}
            data={recentSales}
            keyExtractor={(item) => item.id}
          />
        </div>
        
        {/* New Users */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-lg">New Users</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              View All
            </button>
          </div>
          <Table 
            columns={userColumns}
            data={newUsers}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
