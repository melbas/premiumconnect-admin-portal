
import { Users, DollarSign, CreditCard, UserCheck } from "lucide-react";
import React from "react";

// Metric cards data
export const dashboardMetrics = [
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

// User activity chart data
export const userActivityChartData = {
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

// Mock messages for chat
export const chatMessages = [
  { id: 1, content: "Bonjour! Comment puis-je vous aider aujourd'hui?", sender: "admin", timestamp: "10:30" },
  { id: 2, content: "Je rencontre des problèmes avec ma connexion internet.", sender: "user", timestamp: "10:31" },
  { id: 3, content: "Je suis désolé pour ce désagrément. Pouvez-vous me donner plus d'informations sur le problème que vous rencontrez?", sender: "admin", timestamp: "10:32" },
  { id: 4, content: "Ma connexion est très lente depuis 2 jours.", sender: "user", timestamp: "10:33" },
  { id: 5, content: "Avez-vous essayé de redémarrer votre modem?", sender: "admin", timestamp: "10:34" },
];

// Mock data for recent sales
export const recentSales = [
  { id: "S001", client: "Mamadou Diop", plan: "Premium 50", amount: "25,000 FCFA", date: "15/04/2025", status: "Completed" },
  { id: "S002", client: "Fatou Mbaye", plan: "Pro 100", amount: "45,000 FCFA", date: "15/04/2025", status: "Completed" },
  { id: "S003", client: "Ibrahim Seck", plan: "Basic 20", amount: "12,000 FCFA", date: "14/04/2025", status: "Processing" },
  { id: "S004", client: "Aminata Diallo", plan: "Premium 50", amount: "25,000 FCFA", date: "14/04/2025", status: "Completed" },
  { id: "S005", client: "Omar Faye", plan: "Enterprise", amount: "100,000 FCFA", date: "13/04/2025", status: "Completed" },
];

// Mock data for new users
export const newUsers = [
  { id: "U001", name: "Aicha Ndiaye", email: "aicha@example.com", phone: "+221 77 123 4567", date: "15/04/2025", plan: "Basic 20" },
  { id: "U002", name: "Cheikh Diagne", email: "cheikh@example.com", phone: "+221 78 234 5678", date: "14/04/2025", plan: "Pro 100" },
  { id: "U003", name: "Marie Mendy", email: "marie@example.com", phone: "+221 76 345 6789", date: "14/04/2025", plan: "Premium 50" },
  { id: "U004", name: "Abdou Sow", email: "abdou@example.com", phone: "+221 77 456 7890", date: "13/04/2025", plan: "Basic 20" },
  { id: "U005", name: "Rama Gueye", email: "rama@example.com", phone: "+221 70 567 8901", date: "12/04/2025", plan: "Pro 100" },
];
