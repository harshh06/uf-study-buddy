import FileUpload from "./FileUpload";

const UploadSyllabus = () => {
  return (
    <div>
      <h1>Upload Syllabus</h1>
      <p>Upload your syllabus here.</p>
      <FileUpload
        maxFiles={5}
        maxSizeInMB={10}
        acceptedTypes={["application/pdf"]}
        onFilesChange={(files) => console.log("Files:", files)}
        onUpload={async (files) => {
          // Your upload logic here
          //   const formData = new FormData();
          //   files.forEach((file) => formData.append("files", file));
          //   await fetch("/api/upload", { method: "POST", body: formData });
        }}
      />
    </div>
  );
};

export default UploadSyllabus;
