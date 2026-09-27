import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";



// Pages
import Home from "./pages/Home";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseDetails from "./pages/KnowledgeBaseDetails";
import Chat from "./pages/Chat";
import AuthPage from "./pages/AuthPage";

const App = () => {
    return (
      
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
       
    );
};

export default App;