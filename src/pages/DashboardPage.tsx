import React from "react";
import { useQuery } from "@tanstack/react-query";
import BaseLayout from "@/layouts/BaseLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CourseList } from "@/components/dashboard/CourseList";
import { getOverviewData, getGrowthData, getCourseData } from "@/services/overviewService";
import { useTranslator } from "@/hooks/useTranslator";

const DashboardPage: React.FC = () => {
  const { t } = useTranslator();
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: getOverviewData
  });

  const { data: growthData, isLoading: isGrowthLoading } = useQuery({
    queryKey: ["growth"],
    queryFn: getGrowthData
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourseData
  });

  const chartData = growthData?.growth.map((item) => ({
    month: `${item.month}/${item.year}`,
    studentCount: item.studentCount,
    totalRevenue: item.totalRevenue,
  })) || [];

  return (
    <BaseLayout>
      <h1 className="text-2xl font-bold text-blue-600 mb-6">{t("dashboard.overview")}</h1>

      {isOverviewLoading ? (
        <div>{t("loading")}...</div>
      ) : overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard
            title={t("dashboard.teachers")}
            value={overview.teachers}
            stats={
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  {t("active")}: {overview.active_teachers}
                </span>
                <span className="text-red-600">
                  {t("inactive")}: {overview.inactive_teachers}
                </span>
              </div>
            }
          />

          <StatCard
            title={t("dashboard.students")}
            value={overview.students}
            stats={
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  {t("active")}: {overview.active_students}
                </span>
                <span className="text-red-600">
                  {t("inactive")}: {overview.inactive_students}
                </span>
              </div>
            }
          />

          <StatCard
            title={t("dashboard.revenue")}
            value={`$${overview.total_revenue}`}
            stats={
              <p className="text-sm text-muted-foreground mt-1">
                {t("dashboard.thisMonth")}: ${overview.total_revenue_current_month}
              </p>
            }
          />

          <StatCard
            title={t("dashboard.courses")}
            value={overview.total_courses}
            stats={
              <p className="text-sm text-muted-foreground mt-1">
                {t("dashboard.avgRating")}: {overview.avg_course_rating}/5
              </p>
            }
          />

          <StatCard
            title={t("dashboard.enrollments")}
            value={overview.total_enrollments}
            stats={
              <p className="text-sm text-muted-foreground mt-1">
                {t("dashboard.thisMonth")}: {overview.total_enrollments_current_month}
              </p>
            }
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("dashboard.insights")}</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GrowthChart
              title={t("dashboard.growChartTitle")}
              description={t("dashboard.growChartDescription")}
              data={chartData}
              isLoading={isGrowthLoading}
            />

            <RevenueChart
              title={t("dashboard.revenueChartTitle")}
              description={t("dashboard.revenueChartDescription")}
              data={chartData}
              isLoading={isGrowthLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseList
              title={t("dashboard.mostPopularTitle")}
              description={t("dashboard.mostPopularDescription")}
              courses={courseData?.courses.most_popular || []}
              isLoading={isCourseLoading}
            />

            <CourseList
              title={t("dashboard.topRatedTitle")}
              description={t("dashboard.topRatedDescription")}
              courses={courseData?.courses.top_rated || []}
              isLoading={isCourseLoading}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default DashboardPage;