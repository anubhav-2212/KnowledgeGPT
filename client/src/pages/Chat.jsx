import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import MarkdownRenderer from "../components/chat/MarkdownRenderer";
import CitationViewerModal from "../components/chat/CitationViewerModal";
import { fetchKnowledgeBases } from "../store/thunks/knowledgeBase.thunks";
import { streamChatQuery } from "../Api/chat.api";
import {
    Send,
    Bot,
    Sparkles,
    Database,
    BookOpen,
    Loader2,
    Square,
    RotateCcw,
    Copy,
    Check,
    Files,
    ExternalLink,
    ChevronDown,
    Plus,
    FileText,
    Globe,
    FileUp,
    AlertCircle,
} from "lucide-react";

export default function Chat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { knowledgeBases, isLoading: isKBsLoading } = useSelector(
        (state) => state.knowledgeBase
    );

    const [selectedKbId, setSelectedKbId] = useState(id || "");
    const [messages, setMessages] = useState([]);
    const [inputPrompt, setInputPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeCitation, setActiveCitation] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Fetch KBs on mount if not loaded
    useEffect(() => {
        dispatch(fetchKnowledgeBases());
    }, [dispatch]);

    // Keep selectedKbId synchronized with URL or available KBs
    useEffect(() => {
        if (id) {
            setSelectedKbId(id);
        } else if (!selectedKbId && knowledgeBases.length > 0) {
            setSelectedKbId(knowledgeBases[0]._id);
        }
    }, [id, knowledgeBases, selectedKbId]);

    // Scroll to bottom on new messages or generation updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isGenerating]);

    const activeKB = knowledgeBases.find((kb) => kb._id === selectedKbId);

    const starterPrompts = [
        "What are the main concepts and key findings across these documents?",
        "Can you provide a structured executive summary of this knowledge base?",
        "What specific procedures or guidelines are outlined in these sources?",
    ];

    const handleSendMessage = async (promptToSend) => {
        const queryText = (promptToSend || inputPrompt).trim();
        if (!queryText || isGenerating) return;

        if (!selectedKbId) {
            setErrorMessage("Please select a knowledge base before asking questions.");
            return;
        }

        setErrorMessage("");
        setInputPrompt("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        const userMsgId = `user-${Date.now()}`;
        const assistantMsgId = `assistant-${Date.now()}`;

        const newUserMessage = {
            id: userMsgId,
            sender: "user",
            text: queryText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const newAssistantPlaceholder = {
            id: assistantMsgId,
            sender: "assistant",
            text: "",
            citations: [],
            isStreaming: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, newUserMessage, newAssistantPlaceholder]);
        setIsGenerating(true);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            await streamChatQuery({
                knowledgeBaseId: selectedKbId,
                question: queryText,
                signal: abortController.signal,
                onCitations: (citations) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, citations: citations || [] }
                                : msg
                        )
                    );
                },
                onChunk: (chunkText) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? { ...msg, text: msg.text + chunkText }
                                : msg
                        )
                    );
                },
                onDone: (finalAnswer) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? {
                                      ...msg,
                                      text: finalAnswer || msg.text,
                                      isStreaming: false,
                                  }
                                : msg
                        )
                    );
                    setIsGenerating(false);
                },
                onError: (err) => {
                    let friendlyError = "Failed to get an answer. Please try again.";
                    if (typeof err === "string") {
                        try {
                            const parsed = JSON.parse(err);
                            if (parsed.error?.message) {
                                try {
                                    const nested = JSON.parse(parsed.error.message);
                                    friendlyError = nested.error?.message || parsed.error.message;
                                } catch {
                                    friendlyError = parsed.error.message;
                                }
                            } else if (parsed.message) {
                                friendlyError = parsed.message;
                            } else {
                                friendlyError = err;
                            }
                        } catch {
                            friendlyError = err;
                        }
                    } else if (err?.message) {
                        friendlyError = err.message;
                    }

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId
                                ? {
                                      ...msg,
                                      text:
                                          msg.text ||
                                          `⚠️ ${friendlyError}`,
                                      isStreaming: false,
                                      isError: true,
                                  }
                                : msg
                        )
                    );
                    setIsGenerating(false);
                },

            });
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Chat streaming failed:", error);
            }
            setIsGenerating(false);
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
        setMessages((prev) =>
            prev.map((msg) =>
                msg.isStreaming ? { ...msg, isStreaming: false } : msg
            )
        );
    };

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTextareaInput = (e) => {
        setInputPrompt(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
    };

    const getCitationIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FileUp size={12} className="text-red-500" />;
            case "website":
                return <Globe size={12} className="text-blue-500" />;
            default:
                return <FileText size={12} className="text-emerald-500" />;
        }
    };

    return (
        <AppLayout title="Knowledge Chat">
            <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full">
                {/* Top Control Bar: KB Selector & Active KB details */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] bg-white px-6 py-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf3fb] text-[#3275b3]">
                            <Database size={18} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                                    Knowledge Base:
                                </span>
                                {knowledgeBases.length > 0 ? (
                                    <div className="relative inline-block">
                                        <select
                                            value={selectedKbId}
                                            onChange={(e) => {
                                                const newId = e.target.value;
                                                setSelectedKbId(newId);
                                                navigate(`/chat/${newId}`);
                                            }}
                                            className="appearance-none rounded-lg border border-[#e5e7eb] bg-[#f8fafc] py-1 pl-3 pr-8 text-xs font-semibold text-[#263238] focus:border-[#3275b3] focus:outline-none focus:ring-1 focus:ring-[#3275b3] cursor-pointer"
                                        >
                                            {knowledgeBases.map((kb) => (
                                                <option key={kb._id} value={kb._id}>
                                                    {kb.name} ({kb.totalSources || 0} sources)
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            size={13}
                                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs text-red-500">
                                        No knowledge bases created yet
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        {activeKB && (
                            <button
                                type="button"
                                onClick={() => navigate(`/knowledge-base/${activeKB._id}`)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1 text-xs font-medium text-[#64748b] hover:bg-slate-50 transition-colors"
                            >
                                <Files size={13} className="text-[#3275b3]" />
                                <span>Manage Sources</span>
                                <ExternalLink size={11} className="text-slate-400" />
                            </button>
                        )}

                        {messages.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setMessages([])}
                                title="Clear conversation"
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                                <RotateCcw size={13} />
                                <span className="hidden sm:inline">Clear Chat</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Chat Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
                    {/* Zero State if no KBs */}
                    {knowledgeBases.length === 0 && !isKBsLoading ? (
                        <div className="my-auto flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3fb] text-[#3275b3] mb-4">
                                <Database size={28} />
                            </div>
                            <h3 className="text-base font-semibold text-[#263238]">
                                Create a Knowledge Base First
                            </h3>
                            <p className="mt-1.5 max-w-sm text-xs text-[#64748b]">
                                To query documents with RAG and citations, you need to create a Knowledge Base and upload PDFs, websites, or text documents.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/knowledge-base")}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#28699f] transition-colors"
                            >
                                <Plus size={15} />
                                <span>Go to Knowledge Bases</span>
                            </button>
                        </div>
                    ) : messages.length === 0 ? (
                        /* Welcome & Suggested Prompts */
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center my-auto">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#3275b3] to-[#58a1dd] text-white shadow-md shadow-[#3275b3]/20 mb-4">
                                <Sparkles size={30} />
                            </div>

                            <h2 className="text-xl font-bold tracking-tight text-[#263238]">
                                Research Assistant for {activeKB?.name || "your Knowledge Base"}
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-[#64748b]">
                                Ask questions, extract structured insights, and verify facts with direct citations from your uploaded documents.
                            </p>

                            {/* Starter question pills */}
                            <div className="mt-8 grid gap-2.5 max-w-lg w-full">
                                {starterPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSendMessage(prompt)}
                                        className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-left text-xs font-medium text-[#263238] shadow-2xs hover:border-[#3275b3] hover:bg-[#eaf3fb]/30 hover:shadow-xs transition-all flex items-center justify-between group"
                                    >
                                        <span className="line-clamp-1">{prompt}</span>
                                        <Sparkles size={14} className="text-[#3275b3] shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Messages List */
                        <div className="space-y-6">
                            {messages.map((message) => {
                                const isUser = message.sender === "user";

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3.5 ${
                                            isUser ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        {/* Assistant Avatar */}
                                        {!isUser && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3275b3] to-[#4fa0e4] text-white shadow-xs">
                                                <Bot size={18} />
                                            </div>
                                        )}

                                        <div
                                            className={`flex flex-col max-w-[85%] md:max-w-[75%] ${
                                                isUser ? "items-end" : "items-start"
                                            }`}
                                        >
                                            {/* Message Bubble */}
                                            <div
                                                className={`rounded-2xl px-5 py-4 text-sm ${
                                                    isUser
                                                        ? "bg-[#3275b3] text-white rounded-br-xs shadow-xs"
                                                        : "bg-white text-slate-800 border border-[#e5e7eb] rounded-tl-xs shadow-xs"
                                                }`}
                                            >
                                                {isUser ? (
                                                    <p className="whitespace-pre-wrap leading-relaxed">
                                                        {message.text}
                                                    </p>
                                                ) : (
                                                    <div>
                                                        {message.text ? (
                                                            <MarkdownRenderer content={message.text} />
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                                                                <Loader2 size={15} className="animate-spin text-[#3275b3]" />
                                                                <span>Searching vector embeddings & generating answer...</span>
                                                            </div>
                                                        )}

                                                        {/* Streaming typing cursor */}
                                                        {message.isStreaming && message.text && (
                                                            <span className="inline-block h-4 w-1.5 bg-[#3275b3] ml-1 animate-pulse align-middle" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Sources & Citations section below assistant message */}
                                            {!isUser && message.citations && message.citations.length > 0 && (
                                                <div className="mt-3 w-full rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs">
                                                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold mb-2">
                                                        <BookOpen size={13} className="text-[#3275b3]" />
                                                        <span>Sources & Citations ({message.citations.length})</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {message.citations.map((citation, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => setActiveCitation(citation)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-[#3275b3] hover:text-[#3275b3] hover:shadow-2xs transition-all max-w-[240px]"
                                                                title="Click to view quoted context chunk"
                                                            >
                                                                {getCitationIcon(citation.sourceType)}
                                                                <span className="truncate">{citation.sourceName}</span>
                                                                <span className="font-mono text-[10px] text-slate-400">
                                                                    #{citation.chunkIndex ?? idx}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Message Footer: Timestamp & Copy */}
                                            <div className="mt-1 flex items-center gap-2 px-1 text-[11px] text-[#64748b]">
                                                <span>{message.timestamp}</span>

                                                {!isUser && message.text && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(message.id, message.text)}
                                                        className="hover:text-slate-900 transition-colors p-0.5"
                                                        title="Copy response"
                                                    >
                                                        {copiedId === message.id ? (
                                                            <Check size={12} className="text-emerald-600" />
                                                        ) : (
                                                            <Copy size={12} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* User Avatar */}
                                        {isUser && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf3fb] text-sm font-semibold text-[#3275b3] shadow-xs">
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Bar & Controls */}
                <div className="border-t border-[#e5e7eb] bg-white p-4 md:p-6 shrink-0">
                    {errorMessage && (
                        <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="relative flex items-end gap-2 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-2 focus-within:border-[#3275b3] focus-within:ring-2 focus-within:ring-[#3275b3]/15 transition-all">
                        <textarea
                            ref={textareaRef}
                            value={inputPrompt}
                            onChange={handleTextareaInput}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                activeKB
                                    ? `Ask a question grounded in ${activeKB.name}...`
                                    : "Type your query..."
                            }
                            rows={1}
                            disabled={isGenerating || knowledgeBases.length === 0}
                            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[#263238] placeholder-slate-400 focus:outline-none max-h-44 disabled:opacity-50"
                        />

                        {isGenerating ? (
                            <button
                                type="button"
                                onClick={handleStopGeneration}
                                title="Stop Generation"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                            >
                                <Square size={16} fill="currentColor" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleSendMessage()}
                                disabled={!inputPrompt.trim() || knowledgeBases.length === 0}
                                title="Send message (Enter)"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3275b3] text-white hover:bg-[#28699f] transition-colors disabled:opacity-40 shadow-xs"
                            >
                                <Send size={16} />
                            </button>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748b] px-1">
                        <span>
                            Press <kbd className="rounded bg-slate-100 px-1 py-0.5 border border-slate-200 font-mono">Enter</kbd> to send, <kbd className="rounded bg-slate-100 px-1 py-0.5 border border-slate-200 font-mono">Shift + Enter</kbd> for newline
                        </span>

                        <span className="flex items-center gap-1 text-[#3275b3]">
                            <Sparkles size={11} />
                            RAG Powered by Gemini & Qdrant
                        </span>
                    </div>
                </div>
            </div>

            {/* Citation Viewer Modal */}
            <CitationViewerModal
                citation={activeCitation}
                onClose={() => setActiveCitation(null)}
            />
        </AppLayout>
    );
}
