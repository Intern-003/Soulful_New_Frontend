import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

const useGet = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.autoFetch ?? true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(url, {
        params: options.params || {},
      });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options.params)]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useGet;