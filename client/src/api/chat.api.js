import api from "./axios";

export const sendChatQuery = (data) => {
    return api.post("/chat", data);
};

export const streamChatQuery = async ({
    knowledgeBaseId,
    question,
    onCitations,
    onChunk,
    onDone,
    onError,
    signal,
}) => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
    const endpoint = `${baseURL}/chat/stream`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ knowledgeBaseId, question }),
            signal,
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error || `Chat request failed with status: ${response.status}`;
            if (onError) onError(errMsg);
            throw new Error(errMsg);
        }

        if (!response.body) {
            throw new Error("ReadableStream not supported by this browser.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                    try {
                        const event = JSON.parse(trimmed.slice(6));
                        if (event.type === "citations" && onCitations) {
                            onCitations(event.citations || []);
                        } else if (event.type === "chunk" && onChunk) {
                            onChunk(event.text || "");
                        } else if (event.type === "done" && onDone) {
                            onDone(event.answer || "");
                        } else if (event.type === "error" && onError) {
                            onError(event.error || "Generation error");
                        }
                    } catch (parseError) {
                        console.error("SSE parse error:", parseError);
                    }
                }
            }
        }
    } catch (err) {
        if (err.name === "AbortError") {
            console.log("Chat streaming aborted by user.");
            return;
        }
        if (onError) onError(err.message || "Failed to stream response");
        throw err;
    }
};
