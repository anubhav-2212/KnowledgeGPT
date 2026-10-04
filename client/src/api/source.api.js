import api from "./axios";

export const getSourcesByKb = (kbId) => {
    return api.get(`/sources/kb/${kbId}`);
};

export const createTextSource = ({ knowledgeBaseId, content }) => {
    return api.post("/sources/text", { knowledgeBaseId, content });
};

export const createWebsiteSource = ({ knowledgeBaseId, url }) => {
    return api.post("/sources/website", { knowledgeBaseId, url });
};

export const uploadPdfSource = (formData) => {
    return api.post("/sources/pdf", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteSourceApi = (sourceId) => {
    return api.delete(`/sources/${sourceId}`);
};
