import fs from 'fs';
import Source from '../models/Source.js';
import { KnowledgeBase } from '../models/KnowledgeBase.models.js';
import { extractPdfText } from '../services/extractors/pdf.service.js';


export const createTextSource = async (req, res) => {
  try {
    const { knowledgeBaseId, content } = req.body;
    console.log(knowledgeBaseId,content)

    if (!knowledgeBaseId) {
      return res.status(400).json({
        success: false,
        message: 'Knowledge Base ID is required',
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    const knowledgeBase = await KnowledgeBase.findById(knowledgeBaseId);
    if (!knowledgeBase) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge Base not found',
      });
    }

    const source = await Source.create({
      knowledgeBaseId,
      userId: req.user.id,
      sourceType: 'text',
      sourceName: 'Text Source',
      extractedText: content.trim(),
      status: 'ready',
    });

    await KnowledgeBase.findByIdAndUpdate(knowledgeBaseId, {
      $inc: { totalSources: 1 },
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create source',
    });
  }
};

export const createWebsiteSource = async (req, res) => {
  try {
    const { knowledgeBaseId, url } = req.body;

    if (!knowledgeBaseId) {
      return res.status(400).json({
        success: false,
        message: 'Knowledge Base ID is required',
      });
    }

    if (!url?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    const knowledgeBase = await KnowledgeBase.findById(knowledgeBaseId);
    if (!knowledgeBase) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge Base not found',
      });
    }

    const source = await Source.create({
      knowledgeBaseId,
      userId: req.user.id,
      sourceType: 'website',
      sourceName: url,
      sourceUrl: url,
      status: 'processing',
    });

    await KnowledgeBase.findByIdAndUpdate(knowledgeBaseId, {
      $inc: { totalSources: 1 },
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create website source',
    });
  }
};

export const uploadPdfSource = async (req, res) => {
  const file = req.file;
  try {
    const { knowledgeBaseId } = req.body;

    if (!knowledgeBaseId) {
      return res.status(400).json({
        success: false,
        message: 'Knowledge Base ID is required',
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file required',
      });
    }

    const result = await extractPdfText(file.path);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: `Failed to extract PDF text: ${result.error}`,
      });
    }

    const { text, pages, info } = result;

    const knowledgeBase = await KnowledgeBase.findById(knowledgeBaseId);
    if (!knowledgeBase) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge Base not found',
      });
    }

    const source = await Source.create({
      knowledgeBaseId,
      userId: req.user.id,
      sourceType: 'pdf',
      sourceName: file.originalname,
      status: 'ready', // Text is already extracted synchronously
      extractedText: text,
      pages: pages,
      info: info ? JSON.stringify(info) : undefined,
    });

    await KnowledgeBase.findByIdAndUpdate(knowledgeBaseId, {
      $inc: { totalSources: 1 },
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'PDF upload failed',
    });
  } finally {
    // Delete the temporary file from the disk to prevent space leaks
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete temporary upload file:', err);
      }
    }
  }
};

export const getSourcesByKnowledgeBase = async (req, res) => {
  try {
    const { knowledgeBaseId } = req.params;

    const sources = await Source.find({ knowledgeBaseId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: sources,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sources',
    });
  }
};

export const deleteSource = async (req, res) => {
  try {
    const { sourceId } = req.params;

    const source = await Source.findById(sourceId);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found',
      });
    }

    await Source.findByIdAndDelete(sourceId);

    await KnowledgeBase.findByIdAndUpdate(source.knowledgeBaseId, {
      $inc: { totalSources: -1 },
    });

    return res.status(200).json({
      success: true,
      message: 'Source deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete source',
    });
  }
};
