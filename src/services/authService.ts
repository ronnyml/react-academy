import axios from "axios";
import { LoginData, LoginResponse } from "@/types/authTypes";
import { API_BASE_URL } from "@/utils/api";

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return response.data;
};
