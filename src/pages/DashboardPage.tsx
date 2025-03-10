import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getOverviewData, getGrowthData, getCourseData } from "@/services/overviewService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: getOverviewData,
  });

  const { data: growthData, isLoading: isGrowthLoading } = useQuery({
    queryKey: ["growth"],
    queryFn: getGrowthData,
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourseData,
  });

  const sidebarItems = [
    { icon: <Menu />, label: "Dashboard", path: "/dashboard" },
    { icon: <Users />, label: "Users", path: "/users" },
    { icon: <BookOpen />, label: "Courses", path: "/courses" },
    { icon: <UserCheck />, label: "Enrollments", path: "/enrollments" },
    { icon: <DollarSign />, label: "Payments", path: "/payments" },
    { icon: <Award />, label: "Certifications", path: "/certifications" },
    { icon: <Settings />, label: "Settings", path: "/settings" },
  ];

  const chartData = growthData?.growth.map((item) => ({
    month: `${item.month}/${item.year}`,
    studentCount: item.studentCount,
    totalRevenue: item.totalRevenue,
  })) || [];

  return (
    <div className="flex min-h-screen">
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
            <a
              key={item.label}
              href={item.path}
              className={`flex items-center p-4 hover:bg-[#2B4FC9] ${
                item.label === "Dashboard" ? "bg-[#2B4FC9]" : ""
              }`}
            >
              <span className="w-6 h-6">{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
            </a>
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

      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Overview</h1>

        {isOverviewLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.teachers}</div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-green-600">
                    Active: {overview?.active_teachers}
                  </span>
                  <span className="text-red-600">
                    Inactive: {overview?.inactive_teachers}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.students}</div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-green-600">
                    Active: {overview?.active_students}
                  </span>
                  <span className="text-red-600">
                    Inactive: {overview?.inactive_students}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${overview?.total_revenue}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This month: ${overview?.total_revenue_current_month}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview?.total_courses}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Avg Rating: {overview?.avg_course_rating}/5
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview?.total_enrollments}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This month: {overview?.total_enrollments_current_month}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Insights</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Track the growth of students over time in 2025.
                  </p>
                </CardHeader>
                <CardContent>
                  {isGrowthLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="studentCount"
                            fill="#1E3A8A"
                            name="Student Growth"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monthly revenue growth in 2025.
                  </p>
                </CardHeader>
                <CardContent>
                  {isGrowthLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => ['$' + (Number(value)).toFixed(2), 'Revenue']} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="totalRevenue"
                            stroke="#2E7D32"
                            strokeWidth={2}
                            name="Revenue ($)"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Most Popular Courses</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Top 5 courses by enrollment.
                  </p>
                </CardHeader>
                <CardContent>
                  {isCourseLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="space-y-2">
                      {courseData?.courses.most_popular
                        .map((course) => (
                          <a
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="text-sm font-medium">{course.title}</div>
                            <div className="text-xs text-gray-500">
                              Enrollments: {course.enrollment_count}
                            </div>
                          </a>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Top Rated Courses</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Top 5 courses by good reviews.
                  </p>
                </CardHeader>
                <CardContent>
                  {isCourseLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="space-y-2">
                      {courseData?.courses.top_rated
                        .map((course) => (
                          <a
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="text-sm font-medium">{course.title}</div>
                            <div className="text-xs text-gray-500">
                              Reviews: {course.review_count}
                            </div>
                          </a>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;