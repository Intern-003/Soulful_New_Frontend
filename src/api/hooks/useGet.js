// import { useEffect, useState, useCallback, useRef } from "react";
// import axiosInstance from "../axiosInstance";

// const BASE_URL = import.meta.env.VITE_API_URL;

// const cache = {};
// const pendingRequests = {}; // 🔥 prevents duplicate in-flight calls

// const buildKey = (url, params) => {
//   return `${url}?${JSON.stringify(params || {})}`;
// };

// const useGet = (url, options = {}) => {
//   const params = options.params || {};
//   const key = buildKey(url, params);

//   const [data, setData] = useState(cache[key] || null);
//   const [loading, setLoading] = useState(!cache[key] && (options.autoFetch ?? true));
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(
//     async (customOptions = {}) => {
//       try {
//         const finalUrl = customOptions.url || url;
//         const finalParams = customOptions.params || params;
//         const force = customOptions.force || false;

//         const requestKey = buildKey(finalUrl, finalParams);

//         setLoading(true);
//         setError(null);

//         // ✅ return cached result
//         if (!force && cache[requestKey]) {
//           setData(cache[requestKey]);
//           return cache[requestKey];
//         }

//         // ✅ prevent duplicate in-flight requests
//         if (pendingRequests[requestKey]) {
//           return pendingRequests[requestKey];
//         }

//         const promise = axiosInstance
//           .get(finalUrl, { params: finalParams })
//           .then((res) => {
//             cache[requestKey] = res.data;
//             setData(res.data);
//             return res.data;
//           })
//           .catch((err) => {
//             setError(err.response?.data || err.message);
//             throw err;
//           })
//           .finally(() => {
//             delete pendingRequests[requestKey];
//             setLoading(false);
//           });

//         pendingRequests[requestKey] = promise;

//         return promise;
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//         throw err;
//       }
//     },
//     [url, JSON.stringify(params)]
//   );

//   useEffect(() => {
//     if (options.autoFetch !== false) {
//       fetchData();
//     }
//   }, [key]); // 🔥 important fix

//   return { data, loading, error, refetch: fetchData };
// };

// export default useGet;


// FILE: src/api/hooks/useGet.js

import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "../axiosInstance";

const cache = {};
const pendingRequests = {};

const buildKey = (url, params) => {
  return `${url}?${JSON.stringify(params || {})}`;
};

const useGet = (url, options = {}) => {
  const autoFetch = options.autoFetch !== false;
  const params = options.params || {};
  const paramsKey = JSON.stringify(params);

  const key = buildKey(url, params);

  const [data, setData] = useState(cache[key] || null);
  const [loading, setLoading] = useState(autoFetch && !cache[key]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customOptions = {}) => {
    if (!url) return null;

    const finalUrl = customOptions.url || url;
    const finalParams = customOptions.params || params;
    const requestKey = buildKey(finalUrl, finalParams);

    setLoading(true);
    setError(null);

    if (!customOptions.force && cache[requestKey]) {
      setData(cache[requestKey]);
      setLoading(false);
      return cache[requestKey];
    }

    if (pendingRequests[requestKey]) {
      return pendingRequests[requestKey];
    }

    const promise = axiosInstance
      .get(finalUrl, { params: finalParams })
      .then((res) => {
        cache[requestKey] = res.data;
        setData(res.data);
        return res.data;
      })
      .catch((err) => {
        setError(err.response?.data || err.message);
        throw err;
      })
      .finally(() => {
        delete pendingRequests[requestKey];
        setLoading(false);
      });

    pendingRequests[requestKey] = promise;
    return promise;
  }, [url, paramsKey]);

  useEffect(() => {
    if (!url || !autoFetch) return;
    fetchData();
  }, [url, paramsKey, autoFetch]);

  return { data, loading, error, refetch: fetchData };
};

export default useGet;