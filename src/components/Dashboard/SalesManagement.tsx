
import React, { useState } from "react";
import Table from "./Table";
import ChartComponent from "./ChartComponent";
import { Search, Filter, RefreshCw, Eye, FileText } from "lucide-react";

const SalesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock sales data
  const sales = [
    { id: "S001", client: "Mamadou Diop", plan: "Premium 50", amount: "25,000 FCFA", date: "15/04/2025", payment: "Mobile Money", status: "completed" },
    { id: "S002", client: "Fatou Mbaye", plan: "Pro 100", amount: "45,000 FCFA", date: "15/04/2025", payment: "Credit Card", status: "completed" },
    { id: "S003", client: "Ibrahim Seck", plan: "Basic 20", amount: "12,000 FCFA", date: "14/04/2025", payment: "Mobile Money", status: "processing" },
    { id: "S004", client: "Aminata Diallo", plan: "Premium 50", amount: "25,000 FCFA", date: "14/04/2025", payment: "Bank Transfer", status: "completed" },
    { id: "S005", client: "Omar Faye", plan: "Enterprise", amount: "100,000 FCFA", date: "13/04/2025", payment: "Credit Card", status: "completed" },
    { id: "S006", client: "Aicha Ndiaye", plan: "Basic 20", amount: "12,000 FCFA", date: "13/04/2025", payment: "Mobile Money", status: "failed" },
    { id: "S007", client: "Cheikh Diagne", plan: "Pro 100", amount: "45,000 FCFA", date: "12/04/2025", payment: "Bank Transfer", status: "completed" },
    { id: "S008", client: "Marie Mendy", plan: "Premium 50", amount: "25,000 FCFA", date: "12/04/2025", payment: "Mobile Money", status: "completed" },
    { id: "S009", client: "Abdou Sow", plan: "Basic 20", amount: "12,000 FCFA", date: "11/04/2025", payment: "Credit Card", status: "processing" },
    { id: "S010", client: "Rama Gueye", plan: "Pro 100", amount: "45,000 FCFA", date: "11/04/2025", payment: "Mobile Money", status: "completed" },
    { id: "S011", client: "Moussa Diallo", plan: "Basic 20", amount: "12,000 FCFA", date: "10/04/2025", payment: "Bank Transfer", status: "completed" },
    { id: "S012", client: "Sophie Fall", plan: "Premium 50", amount: "25,000 FCFA", date: "10/04/2025", payment: "Mobile Money", status: "failed" },
    { id: "S013", client: "Oumar Sy", plan: "Enterprise", amount: "100,000 FCFA", date: "09/04/2025", payment: "Credit Card", status: "completed" },
    { id: "S014", client: "Aissatou Camara", plan: "Pro 100", amount: "45,000 FCFA", date: "09/04/2025", payment: "Mobile Money", status: "completed" },
    { id: "S015", client: "Lamine Gaye", plan: "Basic 20", amount: "12,000 FCFA", date: "08/04/2025", payment: "Bank Transfer", status: "processing" },
  ];

  // Filter sales based on search and status filter
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      searchTerm === "" || 
      sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" || 
      sale.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Sales summary chart data (last 7 days)
  const salesSummaryData = {
    labels: ['09/04', '10/04', '11/04', '12/04', '13/04', '14/04', '15/04'],
    datasets: [
      {
        label: 'Sales Amount (FCFA)',
        data: [145000, 37000, 57000, 70000, 112000, 37000, 70000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      }
    ]
  };

  // Payment method distribution chart data
  const paymentMethodData = {
    labels: ['Mobile Money', 'Credit Card', 'Bank Transfer'],
    datasets: [
      {
        data: [8, 4, 3],
        backgroundColor: [
          'rgba(139, 92, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  // Sales breakdown by plan
  const salesByPlan = [
    { plan: "Basic 20", count: 5, revenue: "60,000 FCFA", percentage: 11.3 },
    { plan: "Premium 50", count: 4, revenue: "100,000 FCFA", percentage: 18.9 },
    { plan: "Pro 100", count: 4, revenue: "180,000 FCFA", percentage: 34.0 },
    { plan: "Enterprise", count: 2, revenue: "200,000 FCFA", percentage: 37.8 },
  ];

  // Sale table columns
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Client", accessor: "client" },
    { header: "Plan", accessor: "plan" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Payment Method", accessor: "payment" },
    { header: "Status", accessor: (sale) => {
      const statusClasses = {
        completed: "bg-success/20 text-success",
        processing: "bg-warning/20 text-warning",
        failed: "bg-danger/20 text-danger"
      };
      
      return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[sale.status as keyof typeof statusClasses]
        }`}>
          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
        </span>
      );
    }},
    { header: "Actions", accessor: () => (
      <div className="flex space-x-2">
        <button className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20">
          <Eye size={16} />
        </button>
        <button className="p-1.5 rounded bg-accent/10 text-accent hover:bg-accent/20">
          <FileText size={16} />
        </button>
      </div>
    )}
  ];

  return (
    <div className="animate-enter">
      <h1 className="dashboard-title">Sales Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales table */}
        <div className="lg:col-span-2 dashboard-card">
          <h2 className="font-medium text-lg mb-4">Sales History</h2>
          
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
                placeholder="Search by client, plan or ID..."
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
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
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
          
          {/* Sales table */}
          <Table
            columns={columns}
            data={filteredSales}
            keyExtractor={(sale) => sale.id}
            itemsPerPage={7}
          />
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Payment method distribution */}
          <div className="dashboard-card">
            <h2 className="font-medium text-lg mb-4">Payment Methods</h2>
            <ChartComponent
              type="doughnut"
              data={paymentMethodData}
              height={200}
            />
          </div>
          
          {/* Sales by plan */}
          <div className="dashboard-card">
            <h2 className="font-medium text-lg mb-4">Sales by Plan</h2>
            <div className="space-y-3">
              {salesByPlan.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{item.plan}</span>
                    <span className="text-sm text-muted-foreground">{item.count} sales</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-muted/40 rounded-full mr-4">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sales summary chart */}
      <div className="dashboard-card">
        <h2 className="font-medium text-lg mb-4">Sales Summary (Last 7 Days)</h2>
        <ChartComponent
          type="bar"
          data={salesSummaryData}
          height={300}
        />
      </div>
    </div>
  );
};

export default SalesManagement;
