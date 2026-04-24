import { useState } from "react";
import axiosInstance from "../axiosInstance";

const BASE_URL = import.meta.env.VITE_API_URL;


const usePut = (baseUrl = "") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (config = {}) => {
    try {
      setLoading(true);

      const url = config.url || baseUrl;
      let payload = config.data || {};

      const method = config.method || "PUT"; // ✅ dynamic method
      const isFormData = payload instanceof FormData;

      let res;

      // -----------------------------
      // ✅ FormData (Laravel support)
      // -----------------------------
      if (isFormData) {
        payload.append("_method", method); // PUT or PATCH

        res = await axiosInstance.post(url, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // -----------------------------
      // ✅ JSON
      // -----------------------------
      else {
        if (method === "PATCH") {
          res = await axiosInstance.patch(url, payload, config);
        } else {
          res = await axiosInstance.put(url, payload, config);
        }
      }

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