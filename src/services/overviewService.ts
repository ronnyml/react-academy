import axios from "axios";
import { OverviewData, GrowthData, CourseData } from "../types/uiTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getOverviewData = async (): Promise<OverviewData> => {
  const response = await axios.get(`${API_BASE_URL}/api/overview/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getGrowthData = async (): Promise<GrowthData> => {
  const response = await axios.get(`${API_BASE_URL}/api/overview/growth`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getCourseData = async (): Promise<CourseData> => {
  const response = await axios.get(`${API_BASE_URL}/api/overview/courses`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};