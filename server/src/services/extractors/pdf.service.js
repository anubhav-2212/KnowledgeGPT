import fs from "fs";
import pdfParse from "pdf-parse";

export const extractPdfText = async (filePath) => {
  try {
    // Read PDF file as buffer
    const pdfBuffer = fs.readFileSync(filePath);

    // Extract text
    const pdfData = await pdfParse(pdfBuffer);

    return {
      success: true,
      text: pdfData.text,
      pages: pdfData.numpages,
      info: pdfData.info,
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);

    return {
      success: false,
      text: "",
      error: error.message,
    };
  }
};