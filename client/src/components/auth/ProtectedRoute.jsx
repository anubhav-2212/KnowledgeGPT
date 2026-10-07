import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3B82C4]" />
                    <p className="text-sm font-medium text-slate-500">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3B82C4]" />
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};
