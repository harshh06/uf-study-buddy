import { useState } from "react";
import FileUpload from "./FileUpload";

const UploadSyllabus = () => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:application/pdf;base64, prefix
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setLoading(true);
    setError("");
    setExtractedText("");

    try {
      // Convert file to base64
      const base64Pdf = await fileToBase64(file);

      // Send to API endpoint
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdf: base64Pdf }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to parse PDF");
      }

      if (result.success) {
        setExtractedText(result.text);
        console.log("Successfully extracted text from PDF");
        console.log("Number of pages:", result.numPages);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error processing PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async () => {
    const res = await fetch("/api/parse-syllabus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parsedText: extractedText }),
    });

    const data = await res.json();

    const schedule = JSON.parse(data.formatted);
    setResponse(data.formatted || JSON.stringify(data.error));
  };

  return (
    <div>
      <h1>Upload Syllabus</h1>
      <p>Upload your syllabus here.</p>
      <FileUpload
        maxFiles={5}
        maxSizeInMB={10}
        acceptedTypes={["application/pdf"]}
        onFilesChange={(files) => {
          handleFileUpload(files);
        }}
        onUpload={onUpload}
      />
    </div>
  );
};

export default UploadSyllabus;
