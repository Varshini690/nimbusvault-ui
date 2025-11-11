// src/components/DownloadFile.js
import React, { useState } from "react";
import api from "../api";

function DownloadFile() {
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2Mjg2NTg5MSwianRpIjoiN2RkN2ZhOGQtYWFhMS00M2MwLTkzNTUtOGVhYmU5NTVkMDQyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InZhcnNoaW5pMSIsIm5iZiI6MTc2Mjg2NTg5MSwiY3NyZiI6ImJlYjNjODhlLTExZTMtNGFkNS1iMGI2LTk2YTIyYmVhMzQzMyJ9.u8BZ-dHcwwnt_kAwROAqokZRQYGzucrH-qxYwfYIAHk";

  const handleDownload = async () => {
    if (!filename.trim()) {
      setMessage("⚠️ Please enter a filename first!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post(
        "/file/download_url",
        { filename },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const url = res.data.download_url;
      setMessage("✅ Your download is starting!");
      window.open(url, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      setMessage("❌ File not found or download failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "1.3rem",
          color: "#007bff",
          marginBottom: "15px",
        }}
      >
        ⬇️ Download from NimbusVault
      </h2>

      {/* Centered input + button container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Enter filename (e.g. VARSHINI_RESUME.pdf)"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          style={{
            width: "85%", // ✅ makes it centered, not full width
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            fontSize: "0.9rem",
          }}
        />

        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            width: "85%", // ✅ matches input width, both centered
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "#fff",
            fontSize: "1rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          {loading ? "Preparing..." : "📥 Download File"}
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("✅")
              ? "green"
              : message.includes("⚠️")
              ? "#d97706"
              : "red",
            fontSize: "0.9rem",
            wordBreak: "break-word",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default DownloadFile;
