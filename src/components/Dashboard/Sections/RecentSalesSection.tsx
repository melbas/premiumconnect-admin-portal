
import React from "react";
import Table from "../Table";
import { MessageCircle } from "lucide-react";

interface SaleItem {
  id: string;
  client: string;
  plan: string;
  amount: string;
  date: string;
  status: string;
}

interface RecentSalesSectionProps {
  sales: SaleItem[];
}

const RecentSalesSection = ({ sales }: RecentSalesSectionProps) => {
  const salesColumns = [
    { header: "ID", accessor: "id" as const },
    { header: "Client", accessor: "client" as const },
    { header: "Plan", accessor: "plan" as const },
    { header: "Amount", accessor: "amount" as const },
    { header: "Date", accessor: "date" as const },
    { header: "Status", accessor: (item: SaleItem) => (
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
          <MessageCircle size={12} className="mr-1" /> Chat IA
        </button>
      </div>
    )}
  ];

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-lg">Recent Sales</h2>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>
      <Table 
        columns={salesColumns}
        data={sales}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};

export default RecentSalesSection;
