import axios from "axios";
import { ApiResponse, Settings } from "@/types/dataTypes";
import { API_BASE_URL, getAuthHeaders } from "@/utils/api";

export const settingsService = {
  getSettings: async (): Promise<Settings> => {
    const response = await axios.get<ApiResponse<Settings>>(
      `${API_BASE_URL}/settings/`,
      getAuthHeaders()
    );
    const { data } = response.data;
    return data;
  },

  updateSettings: async (
    settingsData: Partial<Omit<Settings, "id" | "createdAt">>
  ): Promise<Settings> => {
    const response = await axios.put<Settings>(
      `${API_BASE_URL}/settings/`,
      settingsData,
      getAuthHeaders()
    );
    return response.data;
  }
};