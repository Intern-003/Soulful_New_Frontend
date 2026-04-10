import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

const cache = {};

const useGet = (url, options = {}) => {
  const [data, setData] = useState(cache[url] || null);
  const [loading, setLoading] = useState(!cache[url] && (options.autoFetch ?? true));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customOptions = {}) => {
    try {
      setLoading(true);

      const finalUrl = customOptions.url || url;

      // ✅ cache
      if (cache[finalUrl]) {
        setData(cache[finalUrl]);
        setLoading(false);
        return cache[finalUrl];
      }

      const res = await axiosInstance.get(finalUrl, {
        params: customOptions.params || options.params || {},
      });

      cache[finalUrl] = res.data;

      setData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(res.data)) {
          return prev;
        }
        return res.data;
      });

      return res.data;
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
  }, [url]); // ✅ FIXED

  return { data, loading, error, refetch: fetchData };
};

export default useGet;