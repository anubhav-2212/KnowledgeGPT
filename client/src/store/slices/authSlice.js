import { createSlice } from "@reduxjs/toolkit";

import {
    login,
    register,
    googleLogin,
    fetchCurrentUser,
    getProfile,
    logout,
} from "../thunks/auth.thunks";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUnauthenticated: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // ---------------- GOOGLE LOGIN ----------------
        builder
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(googleLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload;
                state.error = null;
            })

            .addCase(googleLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });

        // ---------------- LOGIN ----------------
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload;
                state.error = null;
            })

            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });

        // ---------------- REGISTER ----------------
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload;
                state.error = null;
            })

            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });

        // ---------------- CURRENT USER ----------------
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload;
                state.error = null;
            })

            .addCase(fetchCurrentUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isInitialized = true;
                state.user = null;
            });

        // ---------------- GET PROFILE ----------------
        builder
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload;
                state.error = null;
            })

            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // ---------------- LOGOUT ----------------
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.isInitialized = true;
                state.error = null;
            })

            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setUnauthenticated } = authSlice.actions;

export default authSlice.reducer;