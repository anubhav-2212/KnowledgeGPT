import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
    const location = useLocation();

    // If session is still verifying on a protected route, show clean spinner
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3B82C4]" />
                    <p className="text-sm font-medium text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    // If definitely not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

export const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Never block /auth with a spinner — always render the login form immediately
    return children;
};
