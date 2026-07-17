import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const createChunks = async (
  text,
  chunkSize = 1000,
  chunkOverlap = 150
) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  return splitter.splitText(text);
};