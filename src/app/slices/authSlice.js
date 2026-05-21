import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { AUTH } from "../../api/endpoints";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH.LOGIN, data);

      const { access_token, user, role, permissions } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", JSON.stringify(permissions));

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server Error" });
    }
  }
);

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH.GOOGLE, {
        token,
      });

      const { access_token, user, role, permissions } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", JSON.stringify(permissions));

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Google login failed" });
    }
  }
);

// START REGISTRATION (SEND OTP)
export const startRegistration = createAsyncThunk(
  "auth/startRegistration",
  async (data, { rejectWithValue }) => {
    try {
      // FIXED: Match backend expected format correctly
      const payload = {
        name: data.name,
        email: data.email,  // Always send email from form data
        phone: data.phone,  // Always send phone from form data
        password: data.password,
        password_confirmation: data.password_confirmation,
        type: data.type,     // 'email' or 'phone' - determines where to send OTP
      };
      
      const res = await axiosInstance.post(AUTH.REGISTER, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

// VERIFY OTP + CREATE USER
export const completeRegistration = createAsyncThunk(
  "auth/completeRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        AUTH.VERIFY_REGISTER,
        {
          identifier: data.identifier,
          type: data.type,
          otp: data.otp,
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// RESEND OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(AUTH.RESEND_OTP, {
        identifier: data.identifier,
        type: data.type,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to resend OTP" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    permissions: JSON.parse(localStorage.getItem("permissions")) || [],
    otpSent: false,
    loading: false,
    error: null,
    resendCooldown: 0, // Track cooldown in seconds
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("permissions");

      state.user = null;
      state.token = null;
      state.role = null;
      state.permissions = [];
      state.otpSent = false;
      state.resendCooldown = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
    },
    setResendCooldown: (state, action) => {
      state.resendCooldown = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GOOGLE LOGIN
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // START REGISTRATION
      .addCase(startRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startRegistration.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(startRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      // COMPLETE REGISTRATION
      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        // Store token and user data after registration
        if (action.payload.access_token) {
          state.token = action.payload.access_token;
          state.user = action.payload.user;
          localStorage.setItem("token", action.payload.access_token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RESEND OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, resetOtpState, setResendCooldown } = authSlice.actions;
export default authSlice.reducer;