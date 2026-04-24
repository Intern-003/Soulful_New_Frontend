import { useState } from "react";
import axiosInstance from "../axiosInstance";

const BASE_URL = import.meta.env.VITE_API_URL;

const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async ({ url, data, headers = {}, config = {} }) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(url, data, {
        ...config,
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...headers,
        },
      });

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Request failed";

      setError(message);
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    postData,
  };
};

export default usePost;