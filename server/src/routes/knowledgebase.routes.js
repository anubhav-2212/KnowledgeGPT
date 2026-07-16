import { Source } from "../models/source.model.js";
import { KnowledgeBase } from "../models/knowledge-base.model.js";

export const createTextSource = async (req, res) => {
  try {
    const { knowledgeBaseId, content } = req.body;

    if (!knowledgeBaseId) {
      return res.status(400).json({
        success: false,
        message: "Knowledge Base ID is required",
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const knowledgeBase = await KnowledgeBase.findById(
      knowledgeBaseId
    );

    if (!knowledgeBase) {
      return res.status(404).json({
        success: false,
        message: "Knowledge Base not found",
      });
    }

    const source = await Source.create({
      knowledgeBaseId,
      userId: req.user._id,
      sourceType: "text",
      sourceName: "Text Source",
      extractedText: content.trim(),
      status: "ready",
    });

    await KnowledgeBase.findByIdAndUpdate(
      knowledgeBaseId,
      {
        $inc: { totalSources: 1 },
      }
    );

    return res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create source",
    });
  }
};

export const createWebsiteSource = async (
  req,
  res
) => {
  try {
    const { knowledgeBaseId, url } = req.body;

    if (!url?.trim()) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const source = await Source.create({
      knowledgeBaseId,
      userId: req.user._id,
      sourceType: "website",
      sourceName: url,
      sourceUrl: url,
      status: "processing",
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create website source",
    });
  }
};
export const uploadPdfSource = async (
  req,
  res
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "PDF file required",
      });
    }

    const source = await Source.create({
      knowledgeBaseId: req.body.knowledgeBaseId,
      userId: req.user._id,
      sourceType: "pdf",
      sourceName: file.originalname,
      status: "processing",
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "PDF upload failed",
    });
  }
};
export const getSourcesByKnowledgeBase =
  async (req, res) => {
    try {
      const { knowledgeBaseId } = req.params;

      const sources = await Source.find({
        knowledgeBaseId,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        data: sources,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch sources",
      });
    }
  };
  export const deleteSource = async (
  req,
  res
) => {
  try {
    const { sourceId } = req.params;

    const source = await Source.findById(
      sourceId
    );

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }

    await Source.findByIdAndDelete(sourceId);

    await KnowledgeBase.findByIdAndUpdate(
      source.knowledgeBaseId,
      {
        $inc: {
          totalSources: -1,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Source deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete source",
    });
  }
};