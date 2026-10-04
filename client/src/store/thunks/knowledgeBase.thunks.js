import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getKnowledgeBases,
    getKnowledgeBaseById,
    createKnowledgeBase as createKBApi,
    deleteKnowledgeBase as deleteKBApi,
} from "../../Api/knowledgeBase.api";
import {
    getSourcesByKb,
    createTextSource,
    createWebsiteSource,
    uploadPdfSource as uploadPdfApi,
    deleteSourceApi,
} from "../../Api/source.api";

// Fetch all Knowledge Bases
export const fetchKnowledgeBases = createAsyncThunk(
    "knowledgeBase/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getKnowledgeBases();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to fetch knowledge bases."
            );
        }
    }
);

// Fetch a single Knowledge Base by ID
export const fetchKnowledgeBaseDetails = createAsyncThunk(
    "knowledgeBase/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getKnowledgeBaseById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to fetch knowledge base details."
            );
        }
    }
);

// Create a new Knowledge Base
export const createKnowledgeBase = createAsyncThunk(
    "knowledgeBase/create",
    async (kbData, { rejectWithValue }) => {
        try {
            const response = await createKBApi(kbData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to create knowledge base."
            );
        }
    }
);

// Delete Knowledge Base
export const deleteKnowledgeBase = createAsyncThunk(
    "knowledgeBase/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteKBApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to delete knowledge base."
            );
        }
    }
);

// Fetch sources for a Knowledge Base
export const fetchSources = createAsyncThunk(
    "knowledgeBase/fetchSources",
    async (knowledgeBaseId, { rejectWithValue }) => {
        try {
            const response = await getSourcesByKb(knowledgeBaseId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to fetch sources."
            );
        }
    }
);

// Add text source
export const addTextSource = createAsyncThunk(
    "knowledgeBase/addTextSource",
    async ({ knowledgeBaseId, content, title }, { rejectWithValue }) => {
        try {
            const response = await createTextSource({ knowledgeBaseId, content, title });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to add text source."
            );
        }
    }
);

// Add website source
export const addWebsiteSource = createAsyncThunk(
    "knowledgeBase/addWebsiteSource",
    async ({ knowledgeBaseId, url }, { rejectWithValue }) => {
        try {
            const response = await createWebsiteSource({ knowledgeBaseId, url });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to add website source."
            );
        }
    }
);

// Upload PDF source
export const uploadPdfSource = createAsyncThunk(
    "knowledgeBase/uploadPdfSource",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await uploadPdfApi(formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to upload PDF source."
            );
        }
    }
);

// Delete source
export const deleteSource = createAsyncThunk(
    "knowledgeBase/deleteSource",
    async (sourceId, { rejectWithValue }) => {
        try {
            await deleteSourceApi(sourceId);
            return sourceId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to delete source."
            );
        }
    }
);
