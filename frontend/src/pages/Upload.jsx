import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { COLORS, API_BASE } from "../theme";

export default function UploadPage({ onUploadComplete }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { fetchFiles(); }, []);
  const fetchFiles = async () => { try { const res = await axios.get(`${API_BASE}/files`); setFiles(res.data); } catch {} };

  const handleUpload = async (file) => {
    if (!file) return; setUploadStatus("loading");
    const formData = new FormData(); formData.append("file", file);
    try { await axios.post(`${API_BASE}/upload`, formData); setUploadStatus("success"); fetchFiles(); if (onUploadComplete) onUploadComplete(); setTimeout(() => setUploadStatus(null), 3000); }
    catch { setUploadStatus("error"); setTimeout(() => setUploadStatus(null), 3000); }
  };

  const handleDelete = async (filename) => { try { await axios.delete(`${API_BASE}/files/${filename}`); fetchFiles(); if (onUploadComplete) onUploadComplete(); } catch {} };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>📁 Document Manager</h2>
      <p style={{ color: COLORS.textDim, marginBottom: "32px", fontSize: "14px" }}>Upload CSV files to expand the AI knowledge base 🧠</p>
      <label onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${dragOver ? COLORS.purple : COLORS.border}`, borderRadius: "24px", padding: "60px 32px", cursor: "pointer", transition: "all 0.3s", background: dragOver ? COLORS.bgActive : COLORS.bgCard, marginBottom: "24px" }}>
        <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e.target.files[0])} accept=".csv" />
        <div style={{ width: "80px", height: "80px", background: COLORS.gradientCard, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", border: `1px solid ${COLORS.border}`, fontSize: "36px" }}>
          {uploadStatus === "loading" ? "⏳" : "☁️"}
        </div>
        <p style={{ fontSize: "18px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "8px" }}>{uploadStatus === "loading" ? "Processing... ⚙️" : "Feed the AI Brain 🧠"}</p>
        <p style={{ color: COLORS.textDim, fontSize: "13px" }}>or click to browse CSV files</p>
      </label>

      {uploadStatus === "success" && <div className="animate-slide-up" style={{ padding: "14px 18px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", color: COLORS.green, fontWeight: 600, fontSize: "13px", marginBottom: "24px" }}><CheckCircle2 size={18} /> ✅ File successfully indexed!</div>}
      {uploadStatus === "error" && <div className="animate-slide-up" style={{ padding: "14px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", color: COLORS.red, fontWeight: 600, fontSize: "13px", marginBottom: "24px" }}><AlertCircle size={18} /> ❌ Upload failed.</div>}

      {files.length > 0 && (
        <div style={{ background: COLORS.bgCard, borderRadius: "20px", border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 700, color: COLORS.textPrimary, fontSize: "15px" }}>📚 Indexed Files</h3>
            <span style={{ fontSize: "11px", background: COLORS.bgActive, color: COLORS.purpleLight, padding: "4px 12px", borderRadius: "20px", fontWeight: 700 }}>{files.length} files</span>
          </div>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: i < files.length - 1 ? `1px solid ${COLORS.borderLight}` : "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bgCardHover} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>📄</span>
                <div>
                  <p style={{ fontWeight: 600, color: COLORS.textPrimary, fontSize: "13px" }}>{f.name}</p>
                  <p style={{ fontSize: "11px", color: COLORS.textDim }}>{f.size} • {f.date}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: COLORS.green, background: "rgba(16,185,129,0.1)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.2)", textTransform: "uppercase" }}>✅ Indexed</span>
                <button onClick={() => handleDelete(f.name)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: "4px", display: "flex" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.red} onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}