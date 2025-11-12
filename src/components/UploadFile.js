import React, { useState, useEffect } from "react";
import api from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadFile() {
  const [filesToUpload, setFilesToUpload] = useState([]); // ✅ multiple files
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch list of uploaded files from backend
  const fetchFiles = async () => {
    if (!token) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    try {
      const res = await api.get("/file/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
      if (err.response?.status === 401 || err.response?.status === 422) {
        alert("Session expired — please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Could not fetch files ❌");
      }
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  // ✅ Handle multiple file upload to S3
  const handleUpload = async () => {
    if (filesToUpload.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    try {
      setLoading(true);

      for (const file of filesToUpload) {
        // 1️⃣ Ask backend for pre-signed upload URL
        const res = await api.post(
          "/file/upload_url",
          { filename: file.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const uploadUrl = res.data.upload_url;

        // 2️⃣ Upload the file directly to S3
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (p) => {
            const progress = Math.round((p.loaded / p.total) * 100);
            console.log(`Uploading ${file.name}: ${progress}%`);
          },
        });

        console.log(`${file.name} uploaded successfully ✅`);
      }

      alert("All files uploaded successfully ✅");

      // ✅ Reset the file input so “No file chosen” appears again
      setFilesToUpload([]);
      document.getElementById("fileInput").value = "";

      fetchFiles();
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.status === 401 || err.response?.status === 422) {
        alert("Session expired — please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("File upload failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle file deletion
  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      await api.post(
        "/file/delete",
        { filename },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("File deleted successfully 🗑️");
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete file ❌");
    }
  };

  // ✅ Handle file download
  const handleDownload = async (filename) => {
    try {
      const res = await api.post(
        "/file/download_url",
        { filename },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const downloadUrl = res.data.download_url;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to generate download URL ❌");
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md transition"
      >
        Logout 🔒
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">
          NimbusVault ☁️ — File Manager
        </h2>

        <div className="flex flex-col items-center space-y-4">
          {/* ✅ Hidden native input for multiple files */}
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={(e) => setFilesToUpload([...e.target.files])}
            className="hidden"
          />

          {/* ✅ Visible custom button */}
          <div>
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-black font-semibold text-lg py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Choose Files
            </label>

            {/* ✅ File name text */}
            <p className="text-gray-800 font-medium text-base mt-2">
              {filesToUpload.length > 0
                ? filesToUpload.map((f) => f.name).join(", ")
                : "No files chosen"}
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition"
          >
            {loading ? "Uploading..." : "Upload Files 🚀"}
          </button>
        </div>

        <hr className="my-6" />

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Files</h3>
        {files.length === 0 ? (
          <p className="text-gray-500 text-center">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
              >
                <span>{f.key || f.name}</span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleDownload(f.key || f.name)}
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(f.key || f.name)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UploadFile;
