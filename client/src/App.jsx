import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/thunks/auth.thunks";
import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseDetails from "./pages/KnowledgeBaseDetails";
import Chat from "./pages/Chat";
import AuthPage from "./pages/AuthPage";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <Routes>
            {/* -------------------------------- */}
            {/* Authentication (Public Only) */}
            {/* -------------------------------- */}
            <Route
                path="/auth"
                element={
                    <PublicRoute>
                        <AuthPage />
                    </PublicRoute>
                }
            />

            {/* -------------------------------- */}
            {/* Main Application (Protected) */}
            {/* -------------------------------- */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/knowledge-base"
                element={
                    <ProtectedRoute>
                        <KnowledgeBase />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/knowledge-base/:id"
                element={
                    <ProtectedRoute>
                        <KnowledgeBaseDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/chat/:id"
                element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                }
            />

            {/* -------------------------------- */}
            {/* Fallback */}
            {/* -------------------------------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;