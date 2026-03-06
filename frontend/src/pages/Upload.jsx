import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, AlertCircle, Trash2, Eye, X } from "lucide-react";
import { COLORS, API_BASE } from "../theme";
import { supabase, saveUploadedFile } from "../supabaseClient";

export default function UploadPage({ onUploadComplete, userId }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => { fetchFiles(); }, []);
  const fetchFiles = async () => { try { const res = await axios.get(`${API_BASE}/files`); setFiles(res.data); } catch { } };

  const handleUpload = async (file) => {
    if (!file) return; setUploadStatus("loading");
    const formData = new FormData(); formData.append("file", file);
    try {
      await axios.post(`${API_BASE}/upload`, formData);
      setUploadStatus("success");

      if (supabase && userId) {
        let fsize = (file.size / 1024).toFixed(1) + " KB";
        if (file.size > 1024 * 1024) fsize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
        const fileExt = file.name.split('.').pop();
        await saveUploadedFile(userId, file.name, file.type || fileExt, fsize);
      }

      fetchFiles();
      if (onUploadComplete) onUploadComplete();
      setTimeout(() => setUploadStatus(null), 3000);
    }
    catch { setUploadStatus("error"); setTimeout(() => setUploadStatus(null), 3000); }
  };

  const handleDelete = async (filename) => { try { await axios.delete(`${API_BASE}/files/${filename}`); fetchFiles(); if (onUploadComplete) onUploadComplete(); } catch { } };

  const handleView = async (filename) => {
    setPreviewLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/preview/${filename}`);
      setPreview(res.data);
    } catch {
      setPreview({ error: true, filename });
    }
    setPreviewLoading(false);
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>📁 Document Manager</h2>
      <p style={{ color: COLORS.textDim, marginBottom: "32px", fontSize: "14px" }}>Upload CSV or Excel files to expand the AI knowledge base 🧠</p>

      <label onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.target.files[0]); }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${dragOver ? COLORS.purple : COLORS.border}`, borderRadius: "24px", padding: "60px 32px", cursor: "pointer", transition: "all 0.3s", background: dragOver ? COLORS.bgActive : COLORS.bgCard, marginBottom: "24px" }}>
        <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e.target.files[0])} accept=".csv, .xlsx, .xls" />
        <div style={{ width: "80px", height: "80px", background: COLORS.gradientCard, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", border: `1px solid ${COLORS.border}`, fontSize: "36px" }}>
          {uploadStatus === "loading" ? "⏳" : "☁️"}
        </div>
        <p style={{ fontSize: "18px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "8px" }}>{uploadStatus === "loading" ? "Processing... ⚙️" : "Feed the AI Brain 🧠"}</p>
        <p style={{ color: COLORS.textDim, fontSize: "13px" }}>or click to browse CSV / Excel files</p>
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
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: COLORS.green, background: "rgba(16,185,129,0.1)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.2)", textTransform: "uppercase" }}>✅ Indexed</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleView(f.name)} title="Preview File"
                    style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: "4px", display: "flex", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.purpleLight} onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}>
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.name)} title="Delete File"
                    style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: "4px", display: "flex", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.red} onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {(preview || previewLoading) && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "40px" }}
          onClick={() => { setPreview(null); }}>
          <div style={{ background: COLORS.bgDark, borderRadius: "24px", border: `1px solid ${COLORS.border}`, width: "90%", maxWidth: "1000px", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "22px" }}>📊</span>
                <div>
                  <h3 style={{ fontWeight: 700, color: COLORS.textPrimary, fontSize: "16px" }}>
                    {previewLoading ? "Loading..." : (preview?.error ? "Error" : preview?.filename)}
                  </h3>
                  {preview && !preview.error && (
                    <p style={{ fontSize: "11px", color: COLORS.textDim }}>
                      Showing {Math.min(preview.rows.length, 100)} of {preview.total_rows} rows • {preview.columns.length} columns
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => setPreview(null)}
                style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "8px", cursor: "pointer", color: COLORS.textSecondary, display: "flex", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.red}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textSecondary}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
              {previewLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: COLORS.textDim, fontSize: "14px" }}>
                  <span className="animate-pulse-slow">⏳ Loading preview...</span>
                </div>
              ) : preview?.error ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: COLORS.red, fontSize: "14px" }}>
                  ❌ Could not preview this file.
                </div>
              ) : preview && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "12px" }}>
                    <thead>
                      <tr>
                        <th style={{ position: "sticky", top: 0, background: COLORS.bgCard, color: COLORS.purpleLight, fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 14px", textAlign: "left", borderBottom: `2px solid ${COLORS.purple}`, whiteSpace: "nowrap" }}>#</th>
                        {preview.columns.map((col, ci) => (
                          <th key={ci} style={{ position: "sticky", top: 0, background: COLORS.bgCard, color: COLORS.purpleLight, fontWeight: 700, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", padding: "12px 14px", textAlign: "left", borderBottom: `2px solid ${COLORS.purple}`, whiteSpace: "nowrap" }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, ri) => (
                        <tr key={ri} style={{ transition: "background 0.15s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bgCardHover}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.borderLight}`, color: COLORS.textMuted, fontWeight: 600 }}>{ri + 1}</td>
                          {preview.columns.map((col, ci) => (
                            <td key={ci} style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.borderLight}`, color: COLORS.textSecondary, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}