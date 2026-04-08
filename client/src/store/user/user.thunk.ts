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