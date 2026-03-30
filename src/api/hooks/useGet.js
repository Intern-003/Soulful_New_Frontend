import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

const useGet = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.autoFetch ?? true);
  const [error, setError] = useState(null);

const fetchData = useCallback(async (customOptions = {}) => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(
      customOptions.url || url,
      {
        params: customOptions.params || options.params || {},
      }
    );

    setData(res.data);
  } catch (err) {
    setError(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
}, [url]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useGet;