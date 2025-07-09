import pdf from "pdf-parse";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Allow up to 10MB files
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the base64 encoded PDF from request body
    const { pdf: base64Pdf } = req.body;

    if (!base64Pdf) {
      return res.status(400).json({ error: "No PDF data provided" });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Pdf, "base64");

    // Parse PDF using pdf-parse
    const data = await pdf(buffer);

    // Return the extracted text and metadata
    res.status(200).json({
      success: true,
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({
      error: "Failed to parse PDF",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
