import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser,
} from "../../Api/auth.api";

// Login
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUser(credentials);
            console.log(response);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    "Login failed. Please try again."
            );
        }
    }
);

// Register
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    "Registration failed. Please try again."
            );
        }
    }
);

// Get current user
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();

            return response.data.data;
        } catch (error) {
            return rejectWithValue(null);
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await logoutUser();

            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || "Logout failed."
            );
        }
    }
);