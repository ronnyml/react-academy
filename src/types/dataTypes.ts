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
  categoryId: number;
  isFeatured?: boolean;
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
