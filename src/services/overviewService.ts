import axios from "axios";
import { OverviewData, GrowthData, CourseData } from "../types/uiTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getOverviewData = async (): Promise<OverviewData> => {
  const response = await axios.get(`${API_BASE_URL}/overview/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const { data } = response.data;
  return data;
};

export const getGrowthData = async (): Promise<GrowthData> => {
  const response = await axios.get(`${API_BASE_URL}/overview/growth`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const { data } = response.data;
  return data;
};

export const getCourseData = async (): Promise<CourseData> => {
  const response = await axios.get(`${API_BASE_URL}/overview/courses`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const { data } = response.data;
  return data;
};