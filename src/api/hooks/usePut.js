import { useState } from "react";
import axiosInstance from "../axiosInstance";

const usePut = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (payload, config = {}) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(url, payload, config);
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