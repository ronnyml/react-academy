import axios from "axios";
import { Course, Category, PaginatedCourses, ApiResponse } from "@/types/dataTypes";
import { API_BASE_URL, getAuthHeaders } from "@/utils/api";

export const courseService = {
  getCourses: async (categoryId?: number): Promise<PaginatedCourses> => {
    const url = categoryId
      ? `${API_BASE_URL}/courses?categoryId=${categoryId}`
      : `${API_BASE_URL}/courses/`;
    const response = await axios.get<ApiResponse<PaginatedCourses>>(url, getAuthHeaders());
    const { data } = response.data;
    return data;
  },

  getCourseById: async (courseId: number): Promise<Course> => {
    const response = await axios.get<Course>(
      `${API_BASE_URL}/courses/${courseId}/`,
      getAuthHeaders()
    );
    return response.data;
  },

  createCourse: async (courseData: Omit<Course, "id" | "createdAt">): Promise<Course> => {
    const response = await axios.post<Course>(
      `${API_BASE_URL}/courses/`,
      courseData,
      getAuthHeaders()
    );
    return response.data;
  },

  updateCourse: async (
    courseId: number,
    courseData: Partial<Omit<Course, "id" | "createdAt">>
  ): Promise<Course> => {
    const response = await axios.put<Course>(
      `${API_BASE_URL}/courses/${courseId}/`,
      courseData,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteCourse: async (courseId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${courseId}/`, getAuthHeaders());
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await axios.get<ApiResponse<Category[]>>(
      `${API_BASE_URL}/categories/`,
      getAuthHeaders()
    );
    const { data } = response.data;
    return data;
  },
};