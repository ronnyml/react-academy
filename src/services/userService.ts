import axios from "axios";
import { UsersResponse } from "@/types/dataTypes";
import { API_BASE_URL, getAuthHeaders } from "@/utils/api";

export const getUsersData = async (page = 1, limit = 30): Promise<UsersResponse> => {
  const response = await axios.get(
    `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
    getAuthHeaders()
  );
  const { data } = response.data;
  return data;
};