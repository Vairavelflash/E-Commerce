"use client"
import api from "@/lib/api";
import axios from "axios";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size must be less than 2MB");
      e.target.value = "";
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }
    try {
      setUploading(true);

      // Get presigned url
      const bodyObj = {
        fileName: file.name,
        contentType: file.type,
      };
      const response = await api.post("/uploads/presigned-url", bodyObj);
      if (response.status !== 200) {
        throw new Error("Failed to get presigned url");
      }

      const data = await response?.data;
      console.log(data)

      // Upload to S3
      const uploadResponse = await axios.put(data?.uploadUrl, file);
      if(uploadResponse.status!== 200){
        throw new Error("Upload Failed");
      }

      setFile(data.fileUrl);

      alert("Upload successful")
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {file && (
        <div className="mt-3">
          <p>Name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 px-4 py-2 border rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <div className="mt-6">
          <p className="font-semibold">Uploaded File URL:</p>

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 break-all"
          >
            {fileUrl}
          </a>

          <img src={fileUrl} alt="Uploaded" className="mt-4 w-64 border" />
        </div>
      )}
    </div>
  );
}
