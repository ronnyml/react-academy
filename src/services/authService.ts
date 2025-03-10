import axios from "axios";
import { LoginData, LoginResponse } from "@/types/authTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return response.data;
};
