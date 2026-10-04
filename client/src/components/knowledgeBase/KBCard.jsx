import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Database,
    Files,
    Calendar,
    MessageSquare,
    ArrowRight,
    Trash2,
} from "lucide-react";

export default function KBCard({ kb, onDelete }) {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return "Recently";
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

    return (
        <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-md">
            <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3fb] text-[#3275b3] transition-colors group-hover:bg-[#3275b3] group-hover:text-white">
                        <Database size={22} />
                    </div>

                    <div className="flex items-center gap-1">
                        {onDelete && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(kb);
                                }}
                                title="Delete Knowledge Base"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Title & Description */}
                <div className="mt-4">
                    <h3 
                        onClick={() => navigate(`/knowledge-base/${kb._id}`)}
                        className="cursor-pointer text-base font-semibold text-[#263238] transition-colors hover:text-[#3275b3] line-clamp-1"
                    >
                        {kb.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#64748b] line-clamp-2 min-h-[32px]">
                        {kb.description || "No description provided for this knowledge base."}
                    </p>
                </div>
            </div>

            {/* Meta and Actions */}
            <div className="mt-5 border-t border-[#f1f5f9] pt-4">
                <div className="flex items-center justify-between text-xs text-[#64748b] mb-4">
                    <div className="flex items-center gap-1.5">
                        <Files size={14} className="text-[#94a3b8]" />
                        <span>
                            {kb.totalSources || 0} {kb.totalSources === 1 ? "source" : "sources"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#94a3b8]" />
                        <span>{formatDate(kb.createdAt)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/knowledge-base/${kb._id}`)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#263238] hover:bg-[#f8fafc] hover:border-slate-300 transition-colors"
                    >
                        <span>Manage</span>
                        <ArrowRight size={13} className="text-slate-400" />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/chat/${kb._id}`)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3275b3] px-3 py-2 text-xs font-medium text-white hover:bg-[#28699f] transition-colors shadow-xs"
                    >
                        <MessageSquare size={13} />
                        <span>Chat</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
