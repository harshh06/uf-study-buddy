import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FileUpload from "./FileUpload";

const UploadSyllabus = () => {
  const [extractedText, setExtractedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<Array<{
    week: string;
    topic: string;
    due_items: Array<{ title: string; due_date: string }>;
  }> | null>(null);

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

    const parsedData = JSON.parse(data.formatted);
    setResponse(parsedData || JSON.stringify(data.error));
  };

  const saveSyllabus = async (syllabus: any[]) => {
    const userId = uuidv4();
    const res = await fetch("/api/save-syllabus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syllabus, userId }),
    });
    const data = await res.json();
    if (data.error) {
      console.error("Error saving syllabus:", data.error);
      setError(data.error);
    } else {
      console.log("Syllabus saved successfully:", data);
    }
  };

  useEffect(() => {
    if (response && response.length > 0) {
      console.log("Parsed syllabus response:", response);
      const syllabus = response.map((week: any) => ({
        week: week.week,
        topic: week.topic,
        due_items: week.due_items || [],
      }));
      saveSyllabus(syllabus);
    }
  }, [response]);

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
      {response && response.length > 0 && (
        <div>
          <div>
            Extracted Information:
            <div>{response.length} course topics found.</div>
            <div>Course schedule organized.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSyllabus;
