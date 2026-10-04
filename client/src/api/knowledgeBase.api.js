import api from "./axios";

export const getKnowledgeBases = () => {
    return api.get("/knowledge-base");
};


export const getKnowledgeBaseById = (id) => {
    return api.get(`/knowledge-base/${id}`);
};

export const createKnowledgeBase = (data) => {
    return api.post("/knowledge-base", data);
};

export const deleteKnowledgeBase = (id) => {
    return api.delete(`/knowledge-base/${id}`);
};