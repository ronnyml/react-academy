import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
      <Button onClick={logout} className="mt-4 bg-blue-600 hover:bg-blue-700">
        Logout
      </Button>
    </div>
  );
};

export default DashboardPage;
