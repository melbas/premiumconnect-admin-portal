
import React from "react";
import Table from "../Table";
import { MessageCircle } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  plan: string;
}

interface NewUsersSectionProps {
  users: UserItem[];
}

const NewUsersSection = ({ users }: NewUsersSectionProps) => {
  const userColumns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    { header: "Phone", accessor: "phone" as const },
    { header: "Date", accessor: "date" as const },
    { header: "Plan", accessor: "plan" as const },
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
        <h2 className="font-medium text-lg">New Users</h2>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>
      <Table 
        columns={userColumns}
        data={users}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};

export default NewUsersSection;
