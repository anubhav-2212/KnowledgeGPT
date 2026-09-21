import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/utils/mongoDb.js";

import authRoutes from "./src/routes/auth.routes.js";
import kbRoutes from "./src/routes/knowledgebase.routes.js";
import sourceRoutes from "./src/routes/source.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/knowledge-base", kbRoutes);
app.use("/api/v1/sources", sourceRoutes);
app.use("/api/v1/chat", chatRoutes);

// Health Check
app.get("/api/hello", (req, res) => {
    res.json({
        success: true,
        message: "Hello from the Express backend!",
    });
});

// Database
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});