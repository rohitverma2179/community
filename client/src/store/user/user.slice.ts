import { createSlice } from "@reduxjs/toolkit";
import { signupUser, loginUser, googleLogin, facebookLogin } from "./user.thunk";

interface UserState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Helper to handle loading/success/error
    const handleAuthCases = (thunk: any) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.data?.user || action.payload.user;
          state.success = true;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        });
    };

    // Traditional Auth
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login handlers
    handleAuthCases(loginUser);
    handleAuthCases(googleLogin);
    handleAuthCases(facebookLogin);
  },
});

export const { clearError, resetSuccess } = userSlice.actions;
export default userSlice.reducer;
