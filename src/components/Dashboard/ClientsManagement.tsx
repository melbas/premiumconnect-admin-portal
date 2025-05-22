
import React, { useState } from "react";
import Table from "./Table";
import { ChartComponent } from "./Chart";
import { Search, Phone, Edit, Eye, Filter, RefreshCw } from "lucide-react";

const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock clients data
  const clients = [
    { id: "C001", name: "Mamadou Diop", email: "mamadou@example.com", phone: "+221 77 123 4567", date: "10/01/2025", plan: "Premium 50", status: "active" },
    { id: "C002", name: "Fatou Mbaye", email: "fatou@example.com", phone: "+221 78 234 5678", date: "15/01/2025", plan: "Pro 100", status: "active" },
    { id: "C003", name: "Ibrahim Seck", email: "ibrahim@example.com", phone: "+221 76 345 6789", date: "22/01/2025", plan: "Basic 20", status: "inactive" },
    { id: "C004", name: "Aminata Diallo", email: "aminata@example.com", phone: "+221 77 456 7890", date: "05/02/2025", plan: "Premium 50", status: "active" },
    { id: "C005", name: "Omar Faye", email: "omar@example.com", phone: "+221 70 567 8901", date: "12/02/2025", plan: "Enterprise", status: "active" },
    { id: "C006", name: "Aicha Ndiaye", email: "aicha@example.com", phone: "+221 77 678 9012", date: "18/02/2025", plan: "Basic 20", status: "inactive" },
    { id: "C007", name: "Cheikh Diagne", email: "cheikh@example.com", phone: "+221 78 789 0123", date: "25/02/2025", plan: "Pro 100", status: "active" },
    { id: "C008", name: "Marie Mendy", email: "marie@example.com", phone: "+221 76 890 1234", date: "03/03/2025", plan: "Premium 50", status: "active" },
    { id: "C009", name: "Abdou Sow", email: "abdou@example.com", phone: "+221 77 901 2345", date: "10/03/2025", plan: "Basic 20", status: "inactive" },
    { id: "C010", name: "Rama Gueye", email: "rama@example.com", phone: "+221 70 012 3456", date: "15/03/2025", plan: "Pro 100", status: "active" },
    { id: "C011", name: "Moussa Diallo", email: "moussa@example.com", phone: "+221 77 123 4567", date: "22/03/2025", plan: "Basic 20", status: "active" },
    { id: "C012", name: "Sophie Fall", email: "sophie@example.com", phone: "+221 78 234 5678", date: "01/04/2025", plan: "Premium 50", status: "inactive" },
    { id: "C013", name: "Oumar Sy", email: "oumar@example.com", phone: "+221 76 345 6789", date: "08/04/2025", plan: "Enterprise", status: "active" },
    { id: "C014", name: "Aissatou Camara", email: "aissatou@example.com", phone: "+221 77 456 7890", date: "12/04/2025", plan: "Pro 100", status: "active" },
    { id: "C015", name: "Lamine Gaye", email: "lamine@example.com", phone: "+221 70 567 8901", date: "15/04/2025", plan: "Basic 20", status: "inactive" },
  ];

  // Filter clients based on search and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      searchTerm === "" || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === "all" || 
      client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Client distribution chart data
  const clientDistributionData = {
    labels: ['Premium 50', 'Pro 100', 'Basic 20', 'Enterprise'],
    datasets: [
      {
        label: 'Client Distribution',
        data: [5, 4, 4, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  // Activity summary data
  const activitySummaryData = {
    active: 10,
    inactive: 5,
    new: 3,
    lost: 1
  };

  // Client table columns
  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Name", accessor: "name" as const },
    { header: "Contact", accessor: (client: any) => (
      <div>
        <div>{client.email}</div>
        <div className="text-sm text-muted-foreground">{client.phone}</div>
      </div>
    )},
    { header: "Registration Date", accessor: "date" as const },
    { header: "Current Plan", accessor: "plan" as const },
    { header: "Status", accessor: (client: any) => (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        client.status === "active" ? "bg-success/20 text-success" : "bg-muted/50 text-muted-foreground"
      }`}>
        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
      </span>
    )},
    { header: "Actions", accessor: () => (
      <div className="flex space-x-2">
        <button className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20">
          <Eye size={16} />
        </button>
        <button className="p-1.5 rounded bg-accent/10 text-accent hover:bg-accent/20">
          <Edit size={16} />
        </button>
        <button className="p-1.5 rounded bg-success/10 text-success hover:bg-success/20">
          <Phone size={16} />
        </button>
      </div>
    )}
  ];

  return (
    <div className="animate-enter">
      <h1 className="dashboard-title">Clients Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 dashboard-card">
          <h2 className="font-medium text-lg mb-4">Client Summary</h2>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full p-2 pl-10 text-sm rounded-md bg-muted/40 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Filter dropdown */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none w-40 p-2 pl-8 pr-8 text-sm rounded-md bg-muted/40 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-muted-foreground">
                  <Filter size={16} />
                </div>
              </div>
              
              <button className="p-2 rounded-md bg-muted/40 border border-border text-muted-foreground hover:text-foreground">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          
          {/* Clients table */}
          <Table
            columns={columns}
            data={filteredClients}
            keyExtractor={(client) => client.id}
            itemsPerPage={7}
          />
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Client distribution */}
          <div className="dashboard-card">
            <h2 className="font-medium text-lg mb-4">Client Distribution</h2>
            <ChartComponent
              type="doughnut"
              data={clientDistributionData}
              height={200}
            />
          </div>
          
          {/* Activity summary */}
          <div className="dashboard-card">
            <h2 className="font-medium text-lg mb-4">Activity Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success/10 rounded-lg p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-success">{activitySummaryData.active}</span>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center">
                <span className="text-2xl font-bold">{activitySummaryData.inactive}</span>
                <span className="text-sm text-muted-foreground">Inactive</span>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-primary">{activitySummaryData.new}</span>
                <span className="text-sm text-muted-foreground">New</span>
              </div>
              <div className="bg-danger/10 rounded-lg p-4 flex flex-col items-center">
                <span className="text-2xl font-bold text-danger">{activitySummaryData.lost}</span>
                <span className="text-sm text-muted-foreground">Lost</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsManagement;
