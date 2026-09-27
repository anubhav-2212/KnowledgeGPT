import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import AuthLayout from "./layouts/AuthLayout";
import AuthForms from "./components/auth/AuthForms";

// Pages
import Home from "./pages/Home";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseDetails from "./pages/KnowledgeBaseDetails";
import Chat from "./pages/Chat";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* -------------------------------- */}
                {/* Authentication */}
                {/* -------------------------------- */}

                <Route
                    path="/auth"
                    element={<AuthPage />}
                />

                {/* -------------------------------- */}
                {/* Main Application */}
                {/* -------------------------------- */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/knowledge-base"
                    element={<KnowledgeBase />}
                />

                <Route
                    path="/knowledge-base/:id"
                    element={<KnowledgeBaseDetails />}
                />

                <Route
                    path="/chat/:id"
                    element={<Chat />}
                />

                {/* -------------------------------- */}
                {/* Fallback */}
                {/* -------------------------------- */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default App;