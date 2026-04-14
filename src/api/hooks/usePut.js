import { useState } from "react";
import axiosInstance from "../axiosInstance";

const usePut = (baseUrl = "") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (config = {}) => {
    try {
      setLoading(true);
      setError(null);

      const url = config.url || baseUrl;
      let payload = config.data || {};

      const isFormData = payload instanceof FormData;

      let res;

      // -----------------------------
      // CASE 1: FormData (Laravel needs POST + _method)
      // -----------------------------
      if (isFormData) {
        payload.append("_method", "PUT");

        res = await axiosInstance.post(url, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // -----------------------------
      // CASE 2: Normal JSON (use PUT)
      // -----------------------------
      else {
        res = await axiosInstance.put(url, payload, config);
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
