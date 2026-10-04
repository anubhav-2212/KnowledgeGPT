import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import KBCard from "../components/knowledgeBase/KBCard";
import CreateKBModal from "../components/knowledgeBase/CreateKBModal";
import {
    fetchKnowledgeBases,
    deleteKnowledgeBase,
} from "../store/thunks/knowledgeBase.thunks";
import {
    Database,
    Files,
    MessageSquare,
    Plus,
    ArrowRight,
    AlertTriangle,
    Loader2,
} from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { knowledgeBases, isLoading, isDeleting } = useSelector(
        (state) => state.knowledgeBase
    );

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [kbToDelete, setKbToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchKnowledgeBases());
    }, [dispatch]);

    const handleConfirmDelete = async () => {
        if (!kbToDelete) return;
        try {
            await dispatch(deleteKnowledgeBase(kbToDelete._id)).unwrap();
            setKbToDelete(null);
        } catch (err) {
            console.error("Failed to delete knowledge base:", err);
        }
    };

    const totalDocuments = knowledgeBases.reduce(
        (acc, kb) => acc + (kb.totalSources || 0),
        0
    );

    const firstName = user?.name ? user.name.split(" ")[0] : "there";

    return (
        <AppLayout activePage="dashboard" title="Dashboard">
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                {/* Greeting & Welcome */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#263238]">
                            Good morning, {firstName} 👋
                        </h1>
                        <p className="mt-1 text-sm text-[#64748b]">
                            What would you like to research today?
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 self-start rounded-xl bg-[#3275b3] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#28699f] transition-all hover:shadow"
                    >
                        <Plus size={16} />
                        <span>Create Knowledge Base</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center justify-between rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
                        <div>
                            <p className="text-xs font-medium text-[#64748b]">
                                Knowledge Bases
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-[#263238]">
                                {knowledgeBases.length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3fb] text-[#3275b3]">
                            <Database size={24} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
                        <div>
                            <p className="text-xs font-medium text-[#64748b]">
                                Indexed Documents
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-[#263238]">
                                {totalDocuments}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Files size={24} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs">
                        <div>
                            <p className="text-xs font-medium text-[#64748b]">
                                Conversations
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-[#263238]">
                                0
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                            <MessageSquare size={24} />
                        </div>
                    </div>
                </div>

                {/* Your Knowledge Bases Section */}
                <div className="mt-10">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#263238]">
                                Your Knowledge Bases
                            </h2>
                            <p className="text-xs text-[#64748b]">
                                Recently active collections and sources
                            </p>
                        </div>

                        {knowledgeBases.length > 0 && (
                            <button
                                type="button"
                                onClick={() => navigate("/knowledge-base")}
                                className="inline-flex items-center gap-1 text-xs font-medium text-[#3275b3] hover:underline"
                            >
                                <span>View all ({knowledgeBases.length})</span>
                                <ArrowRight size={13} />
                            </button>
                        )}
                    </div>

                    {isLoading && knowledgeBases.length === 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-44 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-slate-200 mb-4" />
                                    <div className="h-4 w-3/4 rounded bg-slate-200 mb-2" />
                                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    ) : knowledgeBases.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {knowledgeBases.slice(0, 6).map((kb) => (
                                <KBCard
                                    key={kb._id}
                                    kb={kb}
                                    onDelete={(kb) => setKbToDelete(kb)}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="rounded-2xl border border-dashed border-[#d9e0e7] bg-white p-10 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3fb] text-[#3275b3] mb-3">
                                <Database size={24} />
                            </div>

                            <h3 className="text-sm font-semibold text-[#263238]">
                                No knowledge bases yet
                            </h3>

                            <p className="mx-auto mt-1 max-w-sm text-xs text-[#64748b]">
                                Create your first knowledge base to start researching and querying your documents with AI.
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-4 py-2 text-xs font-medium text-white hover:bg-[#28699f] transition-colors shadow-xs"
                            >
                                <Plus size={15} />
                                <span>Create Knowledge Base</span>
                            </button>
                        </div>
                    )}
                </div>
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
};

export default Home;