import { useState } from "react";
import axiosInstance from "../axiosInstance";

const usePut = (baseUrl = "") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (config = {}) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `${config.url || url}?_method=PUT`,
        config.data
      );

      setData(res.data);
      return res.data;
    } catch (err) {
      const errorData = err.response?.data || err.message;
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    putData,
  };
};

export default usePut;
