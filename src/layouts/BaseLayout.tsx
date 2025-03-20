import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { BaseLayoutProps } from "@/types/dataTypes";

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed} 
      />
      
      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;