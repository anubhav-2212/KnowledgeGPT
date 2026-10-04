import { createSlice } from "@reduxjs/toolkit";
import {
    fetchKnowledgeBases,
    fetchKnowledgeBaseDetails,
    createKnowledgeBase,
    deleteKnowledgeBase,
    fetchSources,
    addTextSource,
    addWebsiteSource,
    uploadPdfSource,
    deleteSource,
} from "../thunks/knowledgeBase.thunks";

const initialState = {
    knowledgeBases: [],
    currentKB: null,
    sources: [],
    isLoading: false,
    isCurrentKBLoading: false,
    isCreating: false,
    isDeleting: false,
    isSourcesLoading: false,
    isAddingSource: false,
    error: null,
    createError: null,
    sourceError: null,
};

const knowledgeBaseSlice = createSlice({
    name: "knowledgeBase",
    initialState,
    reducers: {
        clearCurrentKB: (state) => {
            state.currentKB = null;
            state.sources = [];
            state.sourceError = null;
        },
        clearKBError: (state) => {
            state.error = null;
            state.createError = null;
            state.sourceError = null;
        },
    },
    extraReducers: (builder) => {
        // ---------- FETCH ALL KBS ----------
        builder
            .addCase(fetchKnowledgeBases.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchKnowledgeBases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.knowledgeBases = action.payload || [];
                state.error = null;
            })
            .addCase(fetchKnowledgeBases.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // ---------- FETCH KB BY ID ----------
        builder
            .addCase(fetchKnowledgeBaseDetails.pending, (state) => {
                state.isCurrentKBLoading = true;
                state.error = null;
            })
            .addCase(fetchKnowledgeBaseDetails.fulfilled, (state, action) => {
                state.isCurrentKBLoading = false;
                state.currentKB = action.payload;
                state.error = null;
            })
            .addCase(fetchKnowledgeBaseDetails.rejected, (state, action) => {
                state.isCurrentKBLoading = false;
                state.error = action.payload;
            });

        // ---------- CREATE KB ----------
        builder
            .addCase(createKnowledgeBase.pending, (state) => {
                state.isCreating = true;
                state.createError = null;
            })
            .addCase(createKnowledgeBase.fulfilled, (state, action) => {
                state.isCreating = false;
                state.knowledgeBases.unshift(action.payload);
                state.createError = null;
            })
            .addCase(createKnowledgeBase.rejected, (state, action) => {
                state.isCreating = false;
                state.createError = action.payload;
            });

        // ---------- DELETE KB ----------
        builder
            .addCase(deleteKnowledgeBase.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteKnowledgeBase.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.knowledgeBases = state.knowledgeBases.filter(
                    (kb) => kb._id !== action.payload
                );
                if (state.currentKB?._id === action.payload) {
                    state.currentKB = null;
                    state.sources = [];
                }
            })
            .addCase(deleteKnowledgeBase.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload;
            });

        // ---------- FETCH SOURCES ----------
        builder
            .addCase(fetchSources.pending, (state) => {
                state.isSourcesLoading = true;
                state.sourceError = null;
            })
            .addCase(fetchSources.fulfilled, (state, action) => {
                state.isSourcesLoading = false;
                state.sources = action.payload || [];
                state.sourceError = null;
            })
            .addCase(fetchSources.rejected, (state, action) => {
                state.isSourcesLoading = false;
                state.sourceError = action.payload;
            });

        // ---------- ADD SOURCES (TEXT, WEBSITE, PDF) ----------
        const sourcePending = (state) => {
            state.isAddingSource = true;
            state.sourceError = null;
        };

        const sourceFulfilled = (state, action) => {
            state.isAddingSource = false;
            state.sources.unshift(action.payload);
            if (state.currentKB) {
                state.currentKB.totalSources = (state.currentKB.totalSources || 0) + 1;
            }
            // Update totalSources in knowledgeBases list if present
            const kbInList = state.knowledgeBases.find(
                (k) => k._id === (state.currentKB?._id || action.payload?.knowledgeBaseId)
            );
            if (kbInList) {
                kbInList.totalSources = (kbInList.totalSources || 0) + 1;
            }
        };

        const sourceRejected = (state, action) => {
            state.isAddingSource = false;
            state.sourceError = action.payload;
        };

        builder
            .addCase(addTextSource.pending, sourcePending)
            .addCase(addTextSource.fulfilled, sourceFulfilled)
            .addCase(addTextSource.rejected, sourceRejected)

            .addCase(addWebsiteSource.pending, sourcePending)
            .addCase(addWebsiteSource.fulfilled, sourceFulfilled)
            .addCase(addWebsiteSource.rejected, sourceRejected)

            .addCase(uploadPdfSource.pending, sourcePending)
            .addCase(uploadPdfSource.fulfilled, sourceFulfilled)
            .addCase(uploadPdfSource.rejected, sourceRejected);

        // ---------- DELETE SOURCE ----------
        builder.addCase(deleteSource.fulfilled, (state, action) => {
            state.sources = state.sources.filter(
                (s) => s._id !== action.payload
            );
            if (state.currentKB && state.currentKB.totalSources > 0) {
                state.currentKB.totalSources -= 1;
            }
            const kbInList = state.knowledgeBases.find(
                (k) => k._id === state.currentKB?._id
            );
            if (kbInList && kbInList.totalSources > 0) {
                kbInList.totalSources -= 1;
            }
        });
    },
});

export const { clearCurrentKB, clearKBError } = knowledgeBaseSlice.actions;

export default knowledgeBaseSlice.reducer;
