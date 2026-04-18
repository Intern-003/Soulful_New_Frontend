import { useState } from "react";
import axiosInstance from "../axiosInstance";

const usePost = (baseUrl = "") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (payload = {}, customConfig = {}) => {
    try {
      setLoading(true);
      setError(null);

      // ================= URL =================
      const url = payload?.url || baseUrl;

      // ================= BODY =================
      const body = payload?.data || payload;

      // ================= FORCE POST =================
      const res = await axiosInstance({
        method: "POST", // 🔥 FORCE POST (NO MORE PUT BUG)
        url,
        data: body,

        headers: {
          // auto detect formdata
          ...(body instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
        },

        // allow extra configs but NOT method override
        ...customConfig,
      });

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
    postData,
  };
};

export default usePost;