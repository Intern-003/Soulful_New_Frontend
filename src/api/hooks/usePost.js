import { useState } from "react";
import axiosInstance from "../axiosInstance";

const usePost = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (payload, config = {}) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(url, payload, config);
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

  return { data, loading, error, postData };
};

export default usePost;