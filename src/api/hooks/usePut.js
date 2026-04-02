// src/api/hooks/usePut.js

import { useState } from "react"; // ✅ FIX
import axiosInstance from "../axiosInstance";

const usePut = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (config = {}) => {
    try {
      setLoading(true);

      const res = await axiosInstance.put(
        config.url || url,   // ✅ dynamic URL fix
        config.data,
        config
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

  return { data, loading, error, putData };
};

export default usePut;