import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const createChunks = async (text) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    return await splitter.splitText(text);
};