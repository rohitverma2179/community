import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/signup", userData);
      console.log("Signup response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/google-login", { accessToken });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Google Login failed");
    }
  }
);

export const facebookLogin = createAsyncThunk(
  "user/facebookLogin",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/facebook-login", { accessToken });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Facebook Login failed");
    }
  }
);

export const getMe = createAsyncThunk(
  "user/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Session expired");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get("/users/logout");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);