import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const getUsersData = async (page = 1, limit = 30): Promise<UsersResponse> => {
  const response = await axios.get(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const { data } = response.data;
  return data;
};