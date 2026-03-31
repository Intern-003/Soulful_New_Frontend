// src/api/hooks/useDelete.js

import { useState } from "react"; // ✅ THIS WAS MISSING
import axiosInstance from "../axiosInstance";

const useDelete = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (config = {}) => {
    try {
      setLoading(true);

      const res = await axiosInstance.delete(
        config.url || url, // ✅ FIXED dynamic URL
        config
      );

      return res.data;
    } catch (err) {
      const errorData = err.response?.data || err.message;
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteData };
};

export default useDelete;