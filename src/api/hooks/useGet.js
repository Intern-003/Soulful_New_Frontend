import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axiosInstance";

const cache = {};

const useGet = (url, options = {}) => {
  const [data, setData] = useState(cache[url] || null);
  const [loading, setLoading] = useState(!cache[url] && (options.autoFetch ?? true));
  const [error, setError] = useState(null);

  // In your useGet hook, add proper error handling
const fetchData = useCallback(async (customOptions = {}) => {
  try {
    setLoading(true);
    setError(null); // ✅ Clear previous errors

    const finalUrl = customOptions.url || url;
    const force = customOptions.force || false;

    if (!force && cache[finalUrl]) {
      setData(cache[finalUrl]);
      setLoading(false);
      return cache[finalUrl];
    }

    const res = await axiosInstance.get(finalUrl, {
      params: customOptions.params || options.params || {},
    });

    cache[finalUrl] = res.data;
    setData(res.data);
    return res.data;
  } catch (err) {
    setError(err.response?.data || err.message);
    throw err; // ✅ Re-throw so caller knows it failed
  } finally {
    setLoading(false);
  }
},  [url, options.params, options.autoFetch]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [url]); // ✅ FIXED

  return { data, loading, error, refetch: fetchData };
};

export default useGet;