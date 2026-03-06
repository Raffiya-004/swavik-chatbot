import React, { useState, useEffect } from "react";
import { COLORS } from "../theme";
import { Linkedin } from "lucide-react";

export default function DashboardPage({ stats, username, fileList = [] }) {

  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    // Count conversations from localStorage (real user data)
    const convs = JSON.parse(localStorage.getItem("sw_conversations") || "[]");
    const totalMessages = convs.reduce((acc, c) => acc + (c.messages ? c.messages.length : 0), 0);
    setChatCount(totalMessages);
  }, []);

  // Count registered users from localStorage
  const users = JSON.parse(localStorage.getItem("sw_users") || "{}");
  const userCount = Object.keys(users).length;

  const statCards = [
    { icon: "📄", label: "Total Documents", value: stats.total_docs, sub: "Uploaded to RAG", color: COLORS.purpleLight, glow: COLORS.purpleGlow },
    { icon: "💬", label: "Total Conversations", value: chatCount, sub: "Messages exchanged", color: COLORS.violet, glow: COLORS.purpleGlow },
    { icon: "👥", label: "Registered Users", value: userCount, sub: "On this portal", color: COLORS.amber, glow: COLORS.purpleGlow },
  ];

  const teamMembers = [
    { name: "Raffiya Banu", linkedin: "https://www.linkedin.com/in/raffiya-banu-833420326" },
    { name: "Komala B M", linkedin: "https://linkedin.com/in/komala-b-m-b521b6333" },
    { name: "Supritha Tosikane", linkedin: "https://www.linkedin.com/in/supritha-tosikane" },
    { name: "Poornima K B", linkedin: "https://www.linkedin.com/in/poornima-k-b-179452299" },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 80px)" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>
          Welcome {username}
        </h1>
        <p style={{ color: COLORS.textDim, fontWeight: 500, fontSize: "15px" }}>
          📡 Enterprise Knowledge Intelligence Dashboard
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
        {statCards.map((card, i) => (
          <div key={i} className="animate-slide-up" style={{
            animationDelay: `${i * 0.1}s`, background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px",
            display: "flex", alignItems: "center", gap: "16px", transition: "all 0.3s", cursor: "default",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${card.glow}`; e.currentTarget.style.borderColor = COLORS.borderActive; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = COLORS.border; }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px", background: COLORS.gradientCard,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
              border: `1px solid ${COLORS.border}`, flexShrink: 0,
            }}>{card.icon}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: COLORS.textDim, fontSize: "11px", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 900, color: card.color, lineHeight: 1, marginBottom: "4px" }}>{card.value}</p>
              <p style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 600 }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Uploaded Documents List */}
      <div className="animate-slide-up" style={{
        animationDelay: "0.3s", background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "28px", marginBottom: "20px",
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "18px" }}>
          📁 Uploaded Documents
        </h3>
        {fileList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>📭</p>
            <p style={{ fontSize: "15px", fontWeight: 700, color: COLORS.textSecondary, marginBottom: "6px" }}>No documents uploaded yet</p>
            <p style={{ fontSize: "12px", color: COLORS.textMuted }}>Upload CSV or Excel files via the Document Manager to get started</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {fileList.map((file, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px",
                borderRadius: "14px", background: COLORS.bgDark, border: `1px solid ${COLORS.borderLight}`,
                transition: "all 0.2s", cursor: "default",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.bgCardHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.background = COLORS.bgDark; }}>
                <span style={{ fontSize: "22px" }}>
                  {file.name.toLowerCase().endsWith(".csv") ? "📊" : "📗"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
                  <p style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500 }}>{file.size} • {file.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Developed By Footer */}
      <div className="animate-slide-up" style={{
        animationDelay: "0.5s",
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "20px",
        padding: "24px 28px",
        marginTop: "20px",
      }}>
        <p style={{
          fontSize: "13px", fontWeight: 700, color: COLORS.textSecondary,
          textAlign: "center", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px",
        }}>
          Developed By
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px" }}>
          {teamMembers.map((member, i) => (
            <a
              key={i}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 18px", borderRadius: "12px",
                background: COLORS.bgDark, border: `1px solid ${COLORS.borderLight}`,
                textDecoration: "none", color: COLORS.textPrimary,
                transition: "all 0.25s", cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.gradientPrimary.includes("linear") ? "" : COLORS.bgActive;
                e.currentTarget.style.background = "linear-gradient(135deg, #D4A017, #B8860B)";
                e.currentTarget.style.color = "#FFF8E7";
                e.currentTarget.style.borderColor = COLORS.purple;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.purpleGlow}`;
                e.currentTarget.querySelector('.linkedin-icon').style.color = "#FFF8E7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.bgDark;
                e.currentTarget.style.color = COLORS.textPrimary;
                e.currentTarget.style.borderColor = COLORS.borderLight;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.querySelector('.linkedin-icon').style.color = "#0A66C2";
              }}
            >
              <Linkedin size={16} className="linkedin-icon" style={{ color: "#0A66C2", transition: "color 0.25s", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>{member.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}