import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    uploadPdfSource,
    addWebsiteSource,
    addTextSource,
    deleteSource,
    fetchSources,
} from "../store/thunks/knowledgeBase.thunks";
import {
    FileText,
    Globe,
    FileUp,
    Trash2,
    Plus,
    Clock,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Files,
    RefreshCw,
    ExternalLink,
    Layers,
} from "lucide-react";

export default function SourceManager({ knowledgeBaseId }) {
    const dispatch = useDispatch();
    const { sources, isSourcesLoading, isAddingSource, sourceError } = useSelector(
        (state) => state.knowledgeBase
    );

    const [activeTab, setActiveTab] = useState("pdf");
    const [dragActive, setDragActive] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [textTitle, setTextTitle] = useState("");
    const [textContent, setTextContent] = useState("");
    const [localError, setLocalError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fileInputRef = useRef(null);

    const tabs = [
        { id: "pdf", label: "PDF Document", icon: FileUp },
        { id: "website", label: "Website URL", icon: Globe },
        { id: "text", label: "Raw Text", icon: FileText },
    ];

    // Drag handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handlePdfFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handlePdfFile(e.target.files[0]);
        }
    };

    const handlePdfFile = async (file) => {
        if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
            setLocalError("Please select a PDF file (.pdf).");
            return;
        }

        setLocalError("");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("knowledgeBaseId", knowledgeBaseId);

        try {
            await dispatch(uploadPdfSource(formData)).unwrap();
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("PDF upload failed:", err);
        }
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        let trimmedUrl = urlInput.trim();
        if (!trimmedUrl) return;

        if (!/^https?:\/\//i.test(trimmedUrl)) {
            trimmedUrl = `https://${trimmedUrl}`;
        }

        try {
            new URL(trimmedUrl);
        } catch {
            setLocalError("Please enter a valid website URL.");
            return;
        }

        setLocalError("");
        try {
            await dispatch(
                addWebsiteSource({
                    knowledgeBaseId,
                    url: trimmedUrl,
                })
            ).unwrap();
            setUrlInput("");
        } catch (err) {
            console.error("Website source import failed:", err);
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        const content = textContent.trim();
        if (!content) {
            setLocalError("Please provide content for this text source.");
            return;
        }

        setLocalError("");
        try {
            await dispatch(
                addTextSource({
                    knowledgeBaseId,
                    content,
                    title: textTitle.trim(),
                })
            ).unwrap();
            setTextTitle("");
            setTextContent("");
        } catch (err) {
            console.error("Text source creation failed:", err);
        }
    };

    const handleDeleteSource = async (sourceId) => {
        setDeletingId(sourceId);
        try {
            await dispatch(deleteSource(sourceId)).unwrap();
        } catch (err) {
            console.error("Failed to delete source:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleRefresh = () => {
        if (knowledgeBaseId) {
            dispatch(fetchSources(knowledgeBaseId));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const getSourceIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FileUp size={18} className="text-red-500" />;
            case "website":
                return <Globe size={18} className="text-blue-500" />;
            default:
                return <FileText size={18} className="text-emerald-500" />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "ready":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Ready
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 border border-red-200">
                        <AlertCircle size={12} className="text-red-500" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
                        <Loader2 size={12} className="animate-spin text-amber-600" />
                        {status || "Processing"}
                    </span>
                );
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Add Source Card (Left/Top) */}
            <div className="lg:col-span-5 flex flex-col rounded-2xl border border-[#e5e7eb] bg-white shadow-xs">
                {/* Header */}
                <div className="border-b border-[#f1f5f9] p-5">
                    <h2 className="text-base font-semibold text-[#263238] flex items-center gap-2">
                        <Plus size={18} className="text-[#3275b3]" />
                        Add New Source
                    </h2>
                    <p className="mt-1 text-xs text-[#64748b]">
                        Choose a source type to ingest and vectorize into this knowledge base.
                    </p>
                </div>

                {/* Tabs */}
                <div className="p-4 border-b border-[#f1f5f9]">
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setLocalError("");
                                    }}
                                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                                        isActive
                                            ? "bg-white text-[#3275b3] shadow-xs"
                                            : "text-[#64748b] hover:text-[#263238]"
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-5 flex-1">
                    {(localError || sourceError) && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                            <AlertCircle size={15} className="shrink-0" />
                            <span>{localError || sourceError}</span>
                        </div>
                    )}

                    {/* PDF Upload */}
                    {activeTab === "pdf" && (
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                                dragActive
                                    ? "border-[#3275b3] bg-[#eaf3fb]/40"
                                    : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isAddingSource}
                            />
                            {isAddingSource ? (
                                <div className="flex flex-col items-center gap-2.5">
                                    <Loader2 size={32} className="animate-spin text-[#3275b3]" />
                                    <p className="text-sm font-medium text-[#263238]">
                                        Uploading & processing PDF...
                                    </p>
                                    <p className="text-xs text-[#64748b]">
                                        Extracting text and generating embeddings
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3fb] text-[#3275b3] mb-3">
                                        <FileUp size={24} />
                                    </div>
                                    <p className="text-sm font-semibold text-[#263238]">
                                        Click to upload or drag & drop PDF
                                    </p>
                                    <p className="mt-1 text-xs text-[#64748b]">
                                        PDF files up to 50MB supported
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {/* Website Import */}
                    {activeTab === "website" && (
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
                                    Website URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://docs.example.com/guide"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    disabled={isAddingSource}
                                    className="w-full rounded-xl border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#263238] placeholder-slate-400 focus:border-[#3275b3] focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20 disabled:bg-slate-50"
                                />
                            </div>

                            <p className="text-xs text-[#64748b]">
                                Scrapes web page text and stores chunked embeddings for this knowledge base.
                            </p>

                            <button
                                type="submit"
                                disabled={isAddingSource || !urlInput.trim()}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3275b3] py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#28699f] transition-colors disabled:opacity-50"
                            >
                                {isAddingSource && <Loader2 size={14} className="animate-spin" />}
                                <span>{isAddingSource ? "Scraping & Indexing..." : "Import Website"}</span>
                            </button>
                        </form>
                    )}

                    {/* Raw Text */}
                    {activeTab === "text" && (
                        <form onSubmit={handleTextSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
                                    Source Title <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., API Reference, Project Rules, Summary"
                                    value={textTitle}
                                    onChange={(e) => setTextTitle(e.target.value)}
                                    disabled={isAddingSource}
                                    className="w-full rounded-xl border border-[#e5e7eb] px-3.5 py-2 text-sm text-[#263238] placeholder-slate-400 focus:border-[#3275b3] focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20 disabled:bg-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
                                    Text Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Paste or write notes, guidelines, or reference text here..."
                                    rows={4}
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    disabled={isAddingSource}
                                    required
                                    className="w-full resize-none rounded-xl border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#263238] placeholder-slate-400 focus:border-[#3275b3] focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20 disabled:bg-slate-50"
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-[#64748b]">
                                <span>{textContent.trim().length} characters</span>
                                <button
                                    type="submit"
                                    disabled={isAddingSource || !textContent.trim()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-[#28699f] transition-colors disabled:opacity-50"
                                >
                                    {isAddingSource && <Loader2 size={14} className="animate-spin" />}
                                    <span>{isAddingSource ? "Processing..." : "Add Text Source"}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Sources List Card (Right/Bottom) */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#e5e7eb] bg-white shadow-xs">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#f1f5f9] p-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                            <Files size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-[#263238]">
                                Knowledge Sources
                            </h2>
                            <p className="text-xs text-[#64748b]">
                                {sources.length} total {sources.length === 1 ? "source" : "sources"} indexed
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        title="Refresh Sources"
                        disabled={isSourcesLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[#64748b] hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={isSourcesLoading ? "animate-spin text-[#3275b3]" : ""} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Sources list */}
                <div className="p-5 flex-1 overflow-y-auto max-h-[550px]">
                    {isSourcesLoading && sources.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Loader2 size={28} className="animate-spin text-[#3275b3] mb-2" />
                            <p className="text-xs">Loading sources...</p>
                        </div>
                    ) : sources.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-[#64748b]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                                <Files size={24} />
                            </div>
                            <p className="text-sm font-semibold text-[#263238]">
                                No sources added yet
                            </p>
                            <p className="mt-1 max-w-xs text-xs text-[#64748b]">
                                Upload a PDF document, import a website URL, or paste custom text to add knowledge.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sources.map((source) => (
                                <div
                                    key={source._id}
                                    className="group flex items-start justify-between gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4 transition-all hover:border-[#cbd5e1] hover:bg-white hover:shadow-xs"
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
                                            {getSourceIcon(source.sourceType)}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-[#263238] truncate max-w-sm">
                                                    {source.sourceName || source.sourceUrl || "Document Source"}
                                                </h4>
                                                {source.sourceUrl && (
                                                    <a
                                                        href={source.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-slate-400 hover:text-[#3275b3]"
                                                        title="Open URL"
                                                    >
                                                        <ExternalLink size={13} />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
                                                {getStatusBadge(source.status)}

                                                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                                                    <Layers size={12} className="text-slate-400" />
                                                    {source.totalChunks || 0} chunks
                                                </span>

                                                <span className="flex items-center gap-1 text-[11px]">
                                                    <Clock size={12} className="text-slate-400" />
                                                    {formatDate(source.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSource(source._id)}
                                        disabled={deletingId === source._id}
                                        title="Delete Source"
                                        className="shrink-0 rounded-lg p-2 text-slate-400 opacity-60 transition-all hover:bg-red-50 hover:text-red-600 hover:opacity-100 disabled:opacity-40"
                                    >
                                        {deletingId === source._id ? (
                                            <Loader2 size={16} className="animate-spin text-red-500" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
