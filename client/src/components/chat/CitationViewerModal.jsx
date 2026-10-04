import React from "react";
import { X, FileText, Globe, FileUp, Percent, Layers, Quote } from "lucide-react";


export default function CitationViewerModal({ citation, onClose }) {
    if (!citation) return null;

    const getIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FileUp size={18} className="text-red-500" />;
            case "website":
                return <Globe size={18} className="text-blue-500" />;
            default:
                return <FileText size={18} className="text-emerald-500" />;
        }
    };

    const similarityPercent = Math.round((citation.score || 0) * 100);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in-0"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="relative w-full max-w-xl rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-150"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3fb] text-[#3275b3]">
                            {getIcon(citation.sourceType)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-[#263238] truncate max-w-xs sm:max-w-md">
                                {citation.sourceName}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#64748b]">
                                <span className="capitalize">{citation.sourceType} Source</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono text-[11px]">
                                    <Layers size={12} />
                                    Chunk #{citation.chunkIndex ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#263238] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Similarity Badge */}
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5">
                        <span className="text-xs font-medium text-[#64748b]">
                            RAG Semantic Relevance Score
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#3275b3]">
                            <Percent size={13} />
                            {similarityPercent > 0 ? `${similarityPercent}% match` : "Referenced"}
                        </span>
                    </div>

                    {/* Quoted Text */}
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-2">
                            <Quote size={14} className="text-[#3275b3]" />
                            <span>Referenced Source Text</span>
                        </div>

                        <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-[#3275b3]/20">
                            {citation.content || "No raw text available for this chunk."}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-[#f1f5f9] bg-[#fafafa] px-6 py-3.5 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[#3275b3] px-4 py-2 text-xs font-medium text-white hover:bg-[#28699f] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
