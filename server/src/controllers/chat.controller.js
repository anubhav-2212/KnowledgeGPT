export const sendMessage = async (req, res) => {
  try {
    res.status(200).json({ response: 'This is a placeholder response from the chat assistant.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
