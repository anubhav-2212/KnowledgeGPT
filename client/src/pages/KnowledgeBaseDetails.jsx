import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import SourceManager from "../components/SourceManager";
import {
    fetchKnowledgeBaseDetails,
    fetchSources,
    deleteKnowledgeBase,
} from "../store/thunks/knowledgeBase.thunks";
import { clearCurrentKB } from "../store/slices/knowledgeBaseSlice";
import {
    Database,
    ArrowLeft,
    MessageSquare,
    Trash2,
    Calendar,
    Files,
    Loader2,
    AlertTriangle,
    ExternalLink,
} from "lucide-react";

export default function KnowledgeBaseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentKB, isCurrentKBLoading, isDeleting, error } = useSelector(
        (state) => state.knowledgeBase
    );

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchKnowledgeBaseDetails(id));
            dispatch(fetchSources(id));
        }

        return () => {
            dispatch(clearCurrentKB());
        };
    }, [dispatch, id]);

    const handleDeleteKB = async () => {
        try {
            await dispatch(deleteKnowledgeBase(id)).unwrap();
            navigate("/knowledge-base");
        } catch (err) {
            console.error("Failed to delete knowledge base:", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <AppLayout activePage="knowledge-base" title="Knowledge Base Details">
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                {/* Back button */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => navigate("/knowledge-base")}
                        className="inline-flex items-center gap-2 rounded-xl text-xs font-semibold text-[#64748b] hover:text-[#263238] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Knowledge Bases</span>
                    </button>
                </div>

                {/* Loading State */}
                {isCurrentKBLoading && !currentKB ? (
                    <div className="flex flex-col items-center justify-center py-24 text-[#64748b]">
                        <Loader2 size={36} className="animate-spin text-[#3275b3] mb-3" />
                        <p className="text-sm font-medium">Loading knowledge base...</p>
                    </div>
                ) : !currentKB ? (
                    /* Not Found or Error State */
                    <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4">
                            <AlertTriangle size={28} />
                        </div>
                        <h2 className="text-lg font-semibold text-[#263238]">
                            Knowledge Base Not Found
                        </h2>
                        <p className="mt-1 text-sm text-[#64748b] max-w-md mx-auto">
                            The knowledge base you are trying to view does not exist or you do not have permission to view it.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/knowledge-base")}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#28699f] transition-colors"
                        >
                            <ArrowLeft size={14} />
                            <span>Return to Knowledge Bases</span>
                        </button>
                    </div>
                ) : (
                    /* Knowledge Base Content */
                    <div className="space-y-8">
                        {/* KB Header Banner */}
                        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-8 shadow-xs">
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3fb] text-[#3275b3]">
                                        <Database size={28} />
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-[#263238]">
                                            {currentKB.name}
                                        </h1>
                                        <p className="mt-1.5 text-sm text-[#64748b] max-w-2xl">
                                            {currentKB.description || "No description provided for this knowledge base."}
                                        </p>

                                        {/* Metadata Badges */}
                                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#64748b]">
                                            <span className="flex items-center gap-1.5">
                                                <Files size={14} className="text-[#3275b3]" />
                                                <span className="font-semibold text-[#263238]">
                                                    {currentKB.totalSources || 0}
                                                </span>{" "}
                                                {currentKB.totalSources === 1 ? "source" : "sources"}
                                            </span>

                                            <span className="h-3 w-px bg-slate-200" />

                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-[#94a3b8]" />
                                                Created on {formatDate(currentKB.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Primary Actions */}
                                <div className="flex flex-wrap items-center gap-3 self-start">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/chat/${currentKB._id}`)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#28699f] transition-all hover:shadow"
                                    >
                                        <MessageSquare size={16} />
                                        <span>Start Chat</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        title="Delete Knowledge Base"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={15} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Source Manager Component */}
                        <SourceManager knowledgeBaseId={currentKB._id} />
                    </div>
                )}
            </div>

            {/* Delete Knowledge Base Confirmation Modal */}
            {isDeleteModalOpen && currentKB && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in-0"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isDeleting) setIsDeleteModalOpen(false);
                    }}
                >
                    <div 
                        className="relative w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
                            <AlertTriangle size={24} />
                        </div>

                        <h3 className="text-base font-semibold text-[#263238]">
                            Delete Knowledge Base
                        </h3>

                        <p className="mt-2 text-sm text-[#64748b]">
                            Are you sure you want to permanently delete <span className="font-semibold text-[#263238]">"{currentKB.name}"</span>? All sources and embeddings within this knowledge base will be deleted.
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-medium text-[#64748b] hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteKB}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-xs"
                            >
                                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                                <span>{isDeleting ? "Deleting..." : "Delete Knowledge Base"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
