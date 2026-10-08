import api from "./axios";

export const registerUser = (data) => {
    return api.post("/auth/register", data);
};

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

export const googleLoginApi = (credential) => {
    return api.post("/auth/google", { credential });
};

export const logoutUser = () => {
    return api.post("/auth/logout");
};

export const getCurrentUser = () => {
    return api.get("/auth/me");
};

export const getUserProfile = () => {
    return api.get("/auth/profile");
};