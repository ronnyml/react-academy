export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});