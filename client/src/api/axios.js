import axios from "axios";

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Response interceptor to automatically handle expired tokens / 401s
Api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isLoginOrRegister =
                error.config?.url?.includes("/auth/login") ||
                error.config?.url?.includes("/auth/register");

            // If an authenticated API call fails with 401 and we aren't on /auth, redirect to login
            if (!isLoginOrRegister && window.location.pathname !== "/auth") {
                window.location.href = "/auth";
            }
        }
        return Promise.reject(error);
    }
);

export default Api;