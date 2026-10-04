import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import KBCard from "../components/knowledgeBase/KBCard";
import CreateKBModal from "../components/knowledgeBase/CreateKBModal";
import {
    fetchKnowledgeBases,
    deleteKnowledgeBase,
} from "../store/thunks/knowledgeBase.thunks";
import {
    Plus,
    Search,
    Loader2,
    FolderKanban,
    AlertTriangle,
    X,
} from "lucide-react";

export default function KnowledgeBase() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { knowledgeBases, isLoading, isDeleting, error } = useSelector(
        (state) => state.knowledgeBase
    );

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [kbToDelete, setKbToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchKnowledgeBases());
    }, [dispatch]);

    const filteredKBs = knowledgeBases.filter((kb) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const nameMatch = kb.name?.toLowerCase().includes(query);
        const descMatch = kb.description?.toLowerCase().includes(query);
        return nameMatch || descMatch;
    });

    const handleConfirmDelete = async () => {
        if (!kbToDelete) return;
        try {
            await dispatch(deleteKnowledgeBase(kbToDelete._id)).unwrap();
            setKbToDelete(null);
        } catch (err) {
            console.error("Failed to delete knowledge base:", err);
        }
    };

    return (
        <AppLayout activePage="knowledge-base" title="Knowledge Bases">
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                {/* Page Title & Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#263238]">
                            Knowledge Bases
                        </h1>
                        <p className="mt-1 text-sm text-[#64748b]">
                            Manage your collections of documents and data sources for AI analysis.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-[#28699f] transition-all hover:shadow"
                    >
                        <Plus size={18} />
                        <span>New Knowledge Base</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search knowledge bases by name or description..."
                            className="w-full rounded-xl border border-[#e5e7eb] bg-white py-2.5 pl-10 pr-4 text-sm text-[#263238] placeholder-slate-400 focus:border-[#3275b3] focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="text-xs text-[#64748b] self-end sm:self-center">
                        Showing <span className="font-semibold text-[#263238]">{filteredKBs.length}</span> of {knowledgeBases.length}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Content: Loading / Empty / Grid */}
                {isLoading && knowledgeBases.length === 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-48 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
                            >
                                <div className="h-10 w-10 rounded-xl bg-slate-200 mb-4" />
                                <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
                                <div className="h-3 w-1/2 rounded bg-slate-100 mb-6" />
                                <div className="h-8 rounded-xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : filteredKBs.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredKBs.map((kb) => (
                            <KBCard
                                key={kb._id}
                                kb={kb}
                                onDelete={(kb) => setKbToDelete(kb)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="rounded-2xl border border-dashed border-[#d9e0e7] bg-white p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3fb] text-[#3275b3]">
                            <FolderKanban size={28} />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-[#263238]">
                            {searchQuery ? "No matching knowledge bases found" : "No knowledge bases yet"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-[#64748b]">
                            {searchQuery
                                ? `No results matched "${searchQuery}". Try a different search query.`
                                : "Create your first knowledge base to organize your documents and begin chatting with your data."}
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-3">
                            {searchQuery ? (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-medium text-[#263238] hover:bg-slate-50 transition-colors"
                                >
                                    Clear Search
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#28699f] transition-colors"
                                >
                                    <Plus size={16} />
                                    <span>Create Knowledge Base</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Knowledge Base Modal */}
            <CreateKBModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newKB) => {
                    navigate(`/knowledge-base/${newKB._id}`);
                }}
            />

            {/* Delete Confirmation Modal */}
            {kbToDelete && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in-0"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isDeleting) setKbToDelete(null);
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
                            Are you sure you want to delete <span className="font-semibold text-[#263238]">"{kbToDelete.name}"</span>? All associated sources, embeddings, and chat history will be permanently deleted.
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setKbToDelete(null)}
                                disabled={isDeleting}
                                className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-medium text-[#64748b] hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmDelete}
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
