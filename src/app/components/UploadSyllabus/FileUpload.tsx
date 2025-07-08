import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, File, CheckCircle, AlertCircle } from "lucide-react";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface FileUploadProps {
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onUpload?: (files: FileWithPreview[]) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx", ".txt"],
  onFilesChange,
  onUpload,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File "${file.name}" exceeds ${maxSizeInMB}MB limit`;
    }

    // Check file type
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileName.endsWith(type);
      }
      return fileType.match(type.replace("*", ".*"));
    });

    if (!isValidType) {
      return `File "${file.name}" is not an accepted file type`;
    }

    return null;
  };

  // Process files
  const processFiles = (fileList: FileList | File[]) => {
    const newFiles: FileWithPreview[] = [];
    const newErrors: string[] = [];

    // Convert FileList to Array
    const filesArray = Array.from(fileList);

    // Check max files limit
    if (files.length + filesArray.length > maxFiles) {
      newErrors.push(`Cannot upload more than ${maxFiles} files`);
      setErrors(newErrors);
      return;
    }

    filesArray.forEach((file, index) => {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        newErrors.push(validationError);
        return;
      }

      // Create file with preview
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: `${Date.now()}-${index}`,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      });

      newFiles.push(fileWithPreview);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update files state
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    setErrors([]);

    // Call onChange callback
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => {
      if (file.id === fileId) {
        // Revoke object URL to prevent memory leaks
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
        return false;
      }
      return true;
    });

    setFiles(updatedFiles);

    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  // Clear all files
  const clearFiles = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setErrors([]);
    setUploadStatus("idle");

    if (onFilesChange) {
      onFilesChange([]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadStatus("idle");

    try {
      if (onUpload) {
        await onUpload(files);
        setUploadStatus("success");
      } else {
        // Simulate upload for demo
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setUploadStatus("success");
      }
    } catch (error) {
      setUploadStatus("error");
      setErrors(["Upload failed. Please try again."]);
    } finally {
      setUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">File Upload</h2>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500">
          Max {maxFiles} files, up to {maxSizeInMB}MB each
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Accepted: {acceptedTypes.join(", ")}
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
          </div>
          <ul className="mt-2 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Selected Files ({files.length})
            </h3>
            <button
              onClick={clearFiles}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg border"
              >
                {/* File Preview or Icon */}
                <div className="flex-shrink-0 mr-3">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <File className="h-12 w-12 text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.type || "Unknown type"}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 ml-3 p-1 text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            {uploadStatus === "success" && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Upload successful!</span>
              </div>
            )}
            {uploadStatus === "error" && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Upload failed!</span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className={`px-6 py-2 rounded-md font-medium transition-colors
              ${
                uploading || files.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {uploading
              ? "Uploading..."
              : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
};
export default FileUpload;
