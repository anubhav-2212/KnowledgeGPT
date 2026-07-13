export const createKnowledgeBase = async (req, res) => {
  try {
    res.status(201).json({ message: 'Knowledge base created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getKnowledgeBases = async (req, res) => {
  try {
    res.status(200).json({ data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
