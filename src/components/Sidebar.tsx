import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Users,
  BookOpen,
  UserCheck,
  DollarSign,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed 
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { icon: <Menu />, label: "Dashboard", path: "/dashboard" },
    { icon: <Users />, label: "Users", path: "/users" },
    { icon: <BookOpen />, label: "Courses", path: "/courses" },
    { icon: <UserCheck />, label: "Enrollments", path: "/enrollments" },
    { icon: <DollarSign />, label: "Payments", path: "/payments" },
    { icon: <Award />, label: "Certifications", path: "/certifications" },
    { icon: <Settings />, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={`bg-[#1E3A8A] text-white transition-all duration-300 flex flex-col ${
        isSidebarCollapsed ? "w-16" : "w-64"
      } h-screen fixed left-0 z-10`}
    >
      <div className="relative border-b border-[#2B4FC9]">
        <div className="p-4 flex items-center">
          {!isSidebarCollapsed && (
            <h2 className="text-lg font-semibold mr-2">React Academy</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#2B4FC9] p-1 absolute right-2"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        {!isSidebarCollapsed && (
          <p className="text-sm px-4 pb-3 text-gray-300">
            {user?.firstName} {user?.lastName}
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center p-4 hover:bg-[#2B4FC9] ${
              isActive(item.path) ? "bg-[#2B4FC9]" : ""
            }`}
          >
            <span className="w-6 h-6">{item.icon}</span>
            {!isSidebarCollapsed && (
              <span className="ml-3 text-sm">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2B4FC9] mt-auto">
        <button
          onClick={logout}
          className="flex items-center p-4 w-full hover:bg-[#2B4FC9] text-sm"
        >
          <LogOut className="w-6 h-6" />
          {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;