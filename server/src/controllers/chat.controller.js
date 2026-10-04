import { ragQuery, ragQueryStream } from "../services/rag.service.js";
import { KnowledgeBase } from "../models/KnowledgeBase.models.js";

// Helper to format citations cleanly for UI
const formatCitations = (results) => {
    if (!Array.isArray(results)) return [];
    return results.map((item, idx) => ({
        id: item.id || `chunk-${idx}`,
        score: item.score || 0,
        content: item.payload?.content || "",
        sourceName: item.payload?.sourceName || "Document",
        sourceType: item.payload?.sourceType || "text",
        sourceId: item.payload?.sourceId || "",
        chunkIndex: item.payload?.chunkIndex ?? idx,
    }));
};

export const chat = async (req, res) => {
    try {
        const { knowledgeBaseId, question, stream = false } = req.body;

        if (!knowledgeBaseId) {
            return res.status(400).json({ error: "Knowledge base ID is required" });
        }
        if (!question || !question.trim()) {
            return res.status(400).json({ error: "Question is required" });
        }

        const knowledgeBase = await KnowledgeBase.findOne({
            _id: knowledgeBaseId,
            userId: req.user.id,
        });

        if (!knowledgeBase) {
            return res.status(404).json({ error: "Knowledge base not found" });
        }

        const trimmedQuestion = question.trim();

        // Check if client requested streaming
        const isStreaming = Boolean(stream || req.query.stream === "true");

        if (isStreaming) {
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache, no-transform");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders?.();

            try {
                const { stream: aiStream, results } = await ragQueryStream(
                    trimmedQuestion,
                    knowledgeBase._id
                );

                const citations = formatCitations(results);

                // 1. Emit citations first so the client UI can immediately show sources
                res.write(`data: ${JSON.stringify({ type: "citations", citations })}\n\n`);

                // 2. Stream tokens from Gemini
                let fullAnswer = "";
                for await (const chunk of aiStream) {
                    const text = chunk.text;
                    if (text) {
                        fullAnswer += text;
                        res.write(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`);
                    }
                }

                // 3. Emit completion event
                res.write(`data: ${JSON.stringify({ type: "done", answer: fullAnswer })}\n\n`);
                return res.end();
            } catch (streamErr) {
                console.error("Streaming error:", streamErr);
                res.write(
                    `data: ${JSON.stringify({
                        type: "error",
                        error: streamErr.message || "Failed to generate answer stream",
                    })}\n\n`
                );
                return res.end();
            }
        }

        // Non-streaming fallback
        const { answer, results } = await ragQuery(trimmedQuestion, knowledgeBase._id);
        const citations = formatCitations(results);

        return res.status(200).json({
            answer,
            results: citations,
            citations,
        });
    } catch (error) {
        console.error("Chat controller error:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const chatStream = (req, res) => {
    req.body.stream = true;
    return chat(req, res);
};