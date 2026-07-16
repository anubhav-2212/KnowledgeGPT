import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractPdfText = async (filePath) => {
  let parser;
  try {
    // Read PDF file as buffer
    const pdfBuffer = fs.readFileSync(filePath);

    // Extract text and metadata using the modern pdf-parse API
    parser = new PDFParse({ data: pdfBuffer });
    const textResult = await parser.getText();
    const infoResult = await parser.getInfo();

    return {
      success: true,
      text: textResult.text,
      pages: textResult.total,
      info: infoResult.info,
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);

    return {
      success: false,
      text: "",
      error: error.message,
    };
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (err) {
        console.error("Failed to destroy PDFParse instance:", err);
      }
    }
  }
};