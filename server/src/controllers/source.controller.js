export const uploadSource = async (req, res) => {
  try {
    res.status(201).json({ message: 'Source uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSources = async (req, res) => {
  try {
    res.status(200).json({ data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
