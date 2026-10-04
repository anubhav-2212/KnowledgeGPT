import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createKnowledgeBase } from "../../store/thunks/knowledgeBase.thunks";
import { clearKBError } from "../../store/slices/knowledgeBaseSlice";
import { X, Database, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function CreateKBModal({ isOpen, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { isCreating, createError } = useSelector((state) => state.knowledgeBase);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setName("");
            setDescription("");
            setValidationError("");
            dispatch(clearKBError());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isCreating) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isCreating, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            setValidationError("Knowledge base name is required.");
            return;
        }

        setValidationError("");
        try {
            const resultAction = await dispatch(
                createKnowledgeBase({
                    name: trimmedName,
                    description: description.trim(),
                })
            );

            if (createKnowledgeBase.fulfilled.match(resultAction)) {
                onClose();
                if (onSuccess) {
                    onSuccess(resultAction.payload);
                }
            }
        } catch (err) {
            console.error("Failed to create knowledge base:", err);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in-0"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isCreating) {
                    onClose();
                }
            }}
        >
            <div
                className="relative w-full max-w-lg rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-150"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3fb] text-[#3275b3]">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-[#263238]">
                                Create Knowledge Base
                            </h3>
                            <p className="text-xs text-[#64748b]">
                                Organize your documents and connect custom data
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isCreating}
                        className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#263238] transition-colors disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {(validationError || createError) && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600">
                                <AlertCircle size={16} className="shrink-0 text-red-500" />
                                <span>{validationError || createError}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
                                Knowledge Base Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (validationError) setValidationError("");
                                }}
                                placeholder="e.g., Company Handbook, Product Specs, Research 2026"
                                autoFocus
                                required
                                disabled={isCreating}
                                className="w-full rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm text-[#263238] placeholder-slate-400 focus:border-[#3275b3] focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20 disabled:bg-slate-50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
                                Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly describe what information this knowledge base holds..."
                                rows={3}
                                disabled={isCreating}
                                className="w-full resize-none rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm text-[#263238] placeholder-slate-400 focus:border-[#3275b3] focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20 disabled:bg-slate-50 transition-colors"
                            />
                        </div>

                        <div className="rounded-xl border border-[#eaf3fb] bg-[#f8fbfe] p-3.5 flex items-start gap-3 text-xs text-[#475569]">
                            <Sparkles size={16} className="text-[#3275b3] shrink-0 mt-0.5" />
                            <span>
                                Once created, you can upload PDFs, scrape websites, or add custom text documents to power AI chat queries.
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-[#f1f5f9] bg-[#fafafa] px-6 py-4 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isCreating}
                            className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-medium text-[#64748b] hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#3275b3] px-5 py-2 text-xs font-medium text-white shadow-xs hover:bg-[#28699f] transition-colors disabled:opacity-50"
                        >
                            {isCreating && <Loader2 size={14} className="animate-spin" />}
                            <span>{isCreating ? "Creating..." : "Create Knowledge Base"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
