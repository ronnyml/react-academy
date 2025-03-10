export interface OverviewData {
  teachers: number;
  active_teachers: number;
  inactive_teachers: number;
  students: number;
  active_students: number;
  inactive_students: number;
  total_revenue: string;
  total_revenue_current_month: string;
  total_courses: number;
  avg_course_rating: number;
  total_enrollments: number;
  total_enrollments_current_month: number;
}

export interface GrowthData {
  growth: Array<{
    month: number;
    year: number;
    studentCount: number;
  }>;
}

export interface CourseData {
  courses: {
    most_popular: Array<{
      id: number;
      title: string;
      enrollment_count: number;
    }>;
    top_rated: Array<{
      id: number;
      title: string;
      review_count: number;
    }>;
  };
}