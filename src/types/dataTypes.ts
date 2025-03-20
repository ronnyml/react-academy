import { ReactNode } from "react";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  createdAt?: string;
  categoryId?: number;
  isFeatured?: boolean;
  enrollment_count?: number;
  review_count?: number;
}

export interface CourseListProps {
  title: string;
  description: string;
  courses: Course[];
  isLoading: boolean;
}

export interface CoursesPageListProps {
  courses: Course[];
  isLoading: boolean;
  totalCourses: number;
}

export interface PaginatedCourses {
  courses: Course[];
  totalPages: number;
  currentPage: number;
  totalCourses: number;
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  createdAt: string;
  active: boolean;
}

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export interface ChartDataItem {
  month: string;
  studentCount: number;
  [key: string]: string | number;
}

export interface GrowthChartProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  isLoading: boolean;
}

export interface RevenueChartProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  isLoading: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  stats?: ReactNode;
}

export interface BaseLayoutProps {
  children: ReactNode;
}