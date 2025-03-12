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
  description: string;
  createdAt: string;
}

export interface CoursesPageListProps {
  title: string;
  description: string;
  courses: Course[];
  isLoading: boolean;
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

export interface PaginatedCourses {
  courses: Course[];
  totalPages: number;
  currentPage: number;
  totalCourses: number;
}