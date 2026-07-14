import { KnowledgeBase } from '../models/KnowledgeBase.models.js';

export const createKnowledgeBase = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // req.user is set by the auth middleware
    const userId = req.user.id;

    const kb = new KnowledgeBase({
      name,
      description: description || '',
      userId
    });

    const savedKb = await kb.save();

    res.status(201).json({
      message: 'Knowledge base created successfully',
      data: savedKb
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getKnowledgeBases = async (req, res) => {
  try {
    // Return only the knowledge bases belonging to the authenticated user
    const userId = req.user.id;

    const kbs = await KnowledgeBase.find({ userId });
    res.status(200).json({ data: kbs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getKnowledgeBaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the knowledge base and verify it belongs to the authenticated user
    const kb = await KnowledgeBase.findOne({ _id: id, userId });

    if (!kb) {
      return res.status(404).json({ error: 'Knowledge base not found' });
    }

    res.status(200).json({ data: kb });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
