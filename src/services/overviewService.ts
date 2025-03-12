import axios from "axios";
import { OverviewData, GrowthData, CourseData } from "../types/uiTypes";
import { API_BASE_URL, getAuthHeaders } from "@/utils/api";

export const getOverviewData = async (): Promise<OverviewData> => {
  const response = await axios.get(
    `${API_BASE_URL}/overview/`,
    getAuthHeaders()
  );
  const { data } = response.data;
  return data;
};

export const getGrowthData = async (): Promise<GrowthData> => {
  const response = await axios.get(
    `${API_BASE_URL}/overview/growth`,
    getAuthHeaders()
  );
  const { data } = response.data;
  return data;
};

export const getCourseData = async (): Promise<CourseData> => {
  const response = await axios.get(
    `${API_BASE_URL}/overview/courses`,
    getAuthHeaders()
  );
  const { data } = response.data;
  return data;
};