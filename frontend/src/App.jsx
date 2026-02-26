import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import TextareaAutosize from "react-textarea-autosize";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, MessageSquare, Upload, BarChart3, LogOut, Send, CloudUpload,
  FileText, CheckCircle2, AlertCircle, Trash2, Bot, User, Loader2, Shield, Zap,
  Camera, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw, Plus, MessageCircle,
  Clock, Sparkles, X, ChevronRight, UserPlus, KeyRound,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

// ===== DARK PURPLE THEME COLORS =====
const COLORS = {
  bgDeep: "#0a0a0f",
  bgDark: "#0f0f1a",
  bgCard: "#161625",
  bgCardHover: "#1c1c30",
  bgSidebar: "#0d0d18",
  bgInput: "#1a1a2e",
  bgActive: "rgba(124, 58, 237, 0.15)",
  bgActiveStrong: "rgba(124, 58, 237, 0.25)",
  purple: "#7c3aed",
  purpleLight: "#a78bfa",
  purpleDim: "#5b21b6",
  purpleGlow: "rgba(124, 58, 237, 0.4)",
  purpleSoft: "rgba(124, 58, 237, 0.1)",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  textPrimary: "#f0ecf9",
  textSecondary: "#b4a9cc",
  textDim: "#6b5b8a",
  textMuted: "#4a3d6b",
  border: "rgba(124, 58, 237, 0.15)",
  borderLight: "rgba(124, 58, 237, 0.08)",
  borderActive: "rgba(124, 58, 237, 0.4)",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  gradientPrimary: "linear-gradient(135deg, #7c3aed, #6366f1)",
  gradientViolet: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  gradientGlow: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  gradientBg: "radial-gradient(ellipse at top right, #1a1035 0%, #0f0f1a 40%, #0a0a0f 100%)",
  gradientCard: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.04))",
};

// ==================== COPY BUTTON ====================
function CopyButton({ text, label = false }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} title={copied ? "Copied!" : "Copy"}
      style={{
        background: copied ? "rgba(16,185,129,0.15)" : "transparent",
        border: copied ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
        borderRadius: "8px", padding: label ? "5px 10px" : "5px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "4px",
        color: copied ? COLORS.green : COLORS.textDim, fontSize: "11px", fontWeight: 600, transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = COLORS.purpleSoft; e.currentTarget.style.color = COLORS.purpleLight; e.currentTarget.style.border = `1px solid ${COLORS.border}`; }}}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textDim; e.currentTarget.style.border = "1px solid transparent"; }}}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label && (copied ? "Copied!" : "Copy")}
    </button>
  );
}

// ==================== MARKDOWN RENDERER ====================
function MarkdownContent({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          if (!inline && match) {
            return (
              <div style={{ position: "relative", margin: "12px 0", borderRadius: "12px", overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: COLORS.bgDark, borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: COLORS.purpleLight, textTransform: "uppercase", letterSpacing: "1px" }}>{match[1]}</span>
                  <CopyButton text={codeString} label={true} />
                </div>
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div"
                  customStyle={{ margin: 0, padding: "16px", fontSize: "13px", background: COLORS.bgDeep }} {...props}>
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }
          if (!inline) {
            return (
              <div style={{ position: "relative", margin: "12px 0", borderRadius: "12px", overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 12px", background: COLORS.bgDark, borderBottom: `1px solid ${COLORS.border}` }}>
                  <CopyButton text={codeString} label={true} />
                </div>
                <pre style={{ margin: 0, padding: "16px", fontSize: "13px", background: COLORS.bgDeep, overflowX: "auto", color: COLORS.textPrimary }}>
                  <code {...props}>{children}</code>
                </pre>
              </div>
            );
          }
          return <code style={{ background: COLORS.bgActive, padding: "2px 6px", borderRadius: "4px", fontSize: "13px", color: COLORS.purpleLight, fontWeight: 600 }} {...props}>{children}</code>;
        },
        table({ children }) { return <div style={{ overflowX: "auto", margin: "12px 0", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>{children}</table></div>; },
        th({ children }) { return <th style={{ padding: "10px 14px", background: COLORS.bgCard, borderBottom: `2px solid ${COLORS.border}`, textAlign: "left", fontWeight: 700, color: COLORS.textPrimary, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{children}</th>; },
        td({ children }) { return <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.borderLight}`, color: COLORS.textSecondary }}>{children}</td>; },
        ul({ children }) { return <ul style={{ paddingLeft: "20px", margin: "8px 0", lineHeight: "1.8" }}>{children}</ul>; },
        ol({ children }) { return <ol style={{ paddingLeft: "20px", margin: "8px 0", lineHeight: "1.8" }}>{children}</ol>; },
        h1({ children }) { return <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "16px 0 8px", color: COLORS.textPrimary }}>{children}</h1>; },
        h2({ children }) { return <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "14px 0 6px", color: COLORS.textPrimary }}>{children}</h2>; },
        h3({ children }) { return <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "12px 0 4px", color: COLORS.textPrimary }}>{children}</h3>; },
        p({ children }) { return <p style={{ margin: "6px 0", lineHeight: "1.7", color: COLORS.textSecondary }}>{children}</p>; },
        strong({ children }) { return <strong style={{ fontWeight: 700, color: COLORS.textPrimary }}>{children}</strong>; },
        blockquote({ children }) { return <blockquote style={{ borderLeft: `4px solid ${COLORS.purple}`, paddingLeft: "16px", margin: "12px 0", color: COLORS.textSecondary, fontStyle: "italic", background: COLORS.purpleSoft, padding: "12px 16px", borderRadius: "0 8px 8px 0" }}>{children}</blockquote>; },
        a({ children, href }) { return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.purpleLight, textDecoration: "underline", fontWeight: 600 }}>{children}</a>; },
      }}>
      {content}
    </ReactMarkdown>
  );
}

// ==================== LOGIN PAGE (FIXED — Proper Auth) ====================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("sw_users") || "{}");

      if (isSignUp) {
        // ===== SIGN UP =====
        if (users[username]) {
          setError("❌ Username already taken. Try a different one or login.");
          setLoading(false);
          return;
        }
        // Create new account
        users[username] = password;
        localStorage.setItem("sw_users", JSON.stringify(users));
        setSuccess("✅ Account created! Switching to login...");
        setLoading(false);
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess("");
        }, 1500);
      } else {
        // ===== LOGIN =====
        if (!users[username]) {
          setError("❌ Account not found. Please sign up first.");
          setLoading(false);
          return;
        }
        if (users[username] !== password) {
          setError("❌ Incorrect password. Please try again.");
          setLoading(false);
          return;
        }
        // Success — login
        onLogin(username);
      }
    }, 800);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bgDeep, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      {/* Background glow */}
      <div style={{ position: "fixed", top: "-50%", left: "-20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-30%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-fade-in" style={{
        background: COLORS.bgCard, padding: "48px", borderRadius: "28px", width: "100%", maxWidth: "440px",
        textAlign: "center", boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 100px ${COLORS.purpleGlow}`,
        border: `1px solid ${COLORS.border}`, position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div className="animate-glow" style={{
          width: "72px", height: "72px", background: COLORS.gradientPrimary, borderRadius: "20px",
          margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Shield style={{ color: "white" }} size={36} />
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "4px" }}>
          Swavik AI 🚀
        </h2>
        <p style={{ color: COLORS.textDim, marginBottom: "24px", fontSize: "14px" }}>
          {isSignUp ? "Create your employee account" : "Secure Employee Portal"}
        </p>

        {/* Login / Sign Up Toggle */}
        <div style={{
          display: "flex", gap: "4px", background: COLORS.bgDark, borderRadius: "14px",
          padding: "4px", marginBottom: "24px", border: `1px solid ${COLORS.border}`,
        }}>
          <button onClick={() => toggleMode()}
            style={{
              flex: 1, padding: "12px", borderRadius: "11px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
              background: !isSignUp ? COLORS.gradientPrimary : "transparent",
              color: !isSignUp ? "white" : COLORS.textDim,
              boxShadow: !isSignUp ? `0 4px 16px ${COLORS.purpleGlow}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            <KeyRound size={15} /> Login
          </button>
          <button onClick={() => toggleMode()}
            style={{
              flex: 1, padding: "12px", borderRadius: "11px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
              background: isSignUp ? COLORS.gradientPrimary : "transparent",
              color: isSignUp ? "white" : COLORS.textDim,
              boxShadow: isSignUp ? `0 4px 16px ${COLORS.purpleGlow}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            <UserPlus size={15} /> Sign Up
          </button>
        </div>

        {/* Input Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="👤 Username"
            style={{
              width: "100%", background: COLORS.bgDark, border: `2px solid ${COLORS.border}`,
              padding: "14px 16px", borderRadius: "14px", color: COLORS.textPrimary,
              outline: "none", fontSize: "14px", transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.purple)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={isSignUp ? "🔒 Create Password (min 4 chars)" : "🔒 Password"}
            style={{
              width: "100%", background: COLORS.bgDark, border: `2px solid ${COLORS.border}`,
              padding: "14px 16px", borderRadius: "14px", color: COLORS.textPrimary,
              outline: "none", fontSize: "14px", transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.violet)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: "12px", padding: "10px 14px", background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: COLORS.red,
            fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            marginTop: "12px", padding: "10px 14px", background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", color: COLORS.green,
            fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}>
            <CheckCircle2 size={14} /> {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? COLORS.bgCard : COLORS.gradientPrimary,
            color: "white", fontWeight: 700, padding: "14px", borderRadius: "14px",
            border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px",
            marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", boxShadow: loading ? "none" : `0 10px 30px ${COLORS.purpleGlow}`,
            transition: "all 0.3s",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-pulse-slow" />
              {isSignUp ? "Creating Account..." : "Authenticating..."}
            </>
          ) : isSignUp ? (
            "✨ Create Account"
          ) : (
            "🔓 Access Portal"
          )}
        </button>

        {/* Bottom Link */}
        <p style={{ marginTop: "20px", fontSize: "12px", color: COLORS.textDim }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={toggleMode}
            style={{
              color: COLORS.purpleLight, cursor: "pointer", fontWeight: 700,
              textDecoration: "underline", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.purpleLight)}
          >
            {isSignUp ? "Login here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ==================== SIDEBAR ====================
function Sidebar({ activeTab, setActiveTab, username, profileImg, onProfileChange, onLogout, conversations, activeConvId, onNewChat, onSelectConv, onDeleteConv }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", emoji: "📊" },
    { id: "chat", label: "RAG Chatbot", emoji: "🤖" },
    { id: "upload", label: "Document Manager", emoji: "📁" },
    { id: "analytics", label: "Analytics", emoji: "📈" },
  ];

  return (
    <aside style={{ width: "285px", background: COLORS.bgSidebar, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", padding: "24px 16px", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", paddingLeft: "8px" }}>
        <div className="animate-glow" style={{ width: "40px", height: "40px", background: COLORS.gradientPrimary, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap style={{ color: "white" }} size={18} />
        </div>
        <span style={{ background: COLORS.gradientGlow, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900, fontSize: "18px", letterSpacing: "1px" }}>SWAVIK.AI</span>
      </div>

      <div style={{ background: COLORS.gradientCard, borderRadius: "16px", padding: "14px", marginBottom: "20px", border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ position: "relative" }}>
            <img src={profileImg} alt="Profile" style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover", border: `2px solid ${COLORS.purple}`, padding: "2px", background: COLORS.bgCard }} />
            <label htmlFor="profile-upload" style={{ position: "absolute", bottom: "-3px", right: "-3px", width: "20px", height: "20px", background: COLORS.gradientPrimary, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${COLORS.bgSidebar}` }}>
              <Camera size={9} style={{ color: "white" }} />
            </label>
            <input id="profile-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={onProfileChange} />
          </div>
          <div>
            <p style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: "14px" }}>{username} 👋</p>
            <p style={{ color: COLORS.green, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>🟢 Online</p>
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "20px" }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "12px", border: "none", cursor: "pointer", transition: "all 0.2s", background: isActive ? COLORS.gradientPrimary : "transparent", color: isActive ? "white" : COLORS.textSecondary, fontWeight: isActive ? 700 : 500, fontSize: "13px", boxShadow: isActive ? `0 6px 20px ${COLORS.purpleGlow}` : "none" }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = COLORS.bgActive; e.currentTarget.style.color = COLORS.purpleLight; }}}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textSecondary; }}}>
              <span style={{ fontSize: "16px" }}>{item.emoji}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {activeTab === "chat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderTop: `1px solid ${COLORS.border}`, paddingTop: "16px", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", padding: "0 4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "1px" }}>💬 History</span>
            <button onClick={onNewChat} style={{ background: COLORS.bgActive, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: COLORS.purpleLight, fontSize: "11px", fontWeight: 700 }}>
              <Plus size={14} /> New
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => onSelectConv(conv.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", background: activeConvId === conv.id ? COLORS.bgActive : "transparent", border: activeConvId === conv.id ? `1px solid ${COLORS.border}` : "1px solid transparent" }}
                onMouseEnter={(e) => { if (activeConvId !== conv.id) e.currentTarget.style.background = COLORS.bgCardHover; }}
                onMouseLeave={(e) => { if (activeConvId !== conv.id) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                  <MessageCircle size={14} style={{ color: activeConvId === conv.id ? COLORS.purpleLight : COLORS.textDim, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: activeConvId === conv.id ? COLORS.purpleLight : COLORS.textDim, fontWeight: activeConvId === conv.id ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.title}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDeleteConv(conv.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: "2px", display: "flex", flexShrink: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.red} onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onLogout}
        style={{ display: "flex", alignItems: "center", gap: "10px", color: COLORS.red, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "12px 16px", borderRadius: "14px", cursor: "pointer", fontSize: "13px", fontWeight: 600, marginTop: "12px" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
        <LogOut size={18} /> 🚪 Sign Out
      </button>
    </aside>
  );
}

// ==================== DASHBOARD ====================
function DashboardPage({ stats, username }) {
  const statCards = [
    { icon: "📄", label: "Total Documents", value: stats.total_docs, sub: "Active in RAG", color: COLORS.purpleLight, glow: COLORS.purpleGlow },
    { icon: "💬", label: "Total Queries", value: stats.queries.toLocaleString(), sub: "Lifetime usage", color: COLORS.violet, glow: "rgba(139,92,246,0.3)" },
    { icon: "🎯", label: "Accuracy Rate", value: `${stats.accuracy}%`, sub: "Last 30 days", color: COLORS.green, glow: "rgba(16,185,129,0.3)" },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>Welcome Back, {username} 👋🎉</h1>
        <p style={{ color: COLORS.textDim, fontWeight: 500, fontSize: "15px" }}>📡 Monitoring company knowledge systems</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
        {statCards.map((card, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px", display: "flex", alignItems: "center", gap: "20px", transition: "all 0.3s", cursor: "default" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${card.glow}`; e.currentTarget.style.borderColor = COLORS.borderActive; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = COLORS.border; }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "18px", background: COLORS.gradientCard, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", border: `1px solid ${COLORS.border}` }}>{card.icon}</div>
            <div>
              <p style={{ color: COLORS.textDim, fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{card.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 900, color: card.color, lineHeight: 1, marginBottom: "4px" }}>{card.value}</p>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: COLORS.textMuted, fontWeight: 700 }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="animate-slide-up" style={{ animationDelay: "0.3s", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.textPrimary }}>📊 Knowledge Base Activity</h3>
          <span style={{ fontSize: "11px", background: COLORS.bgActive, color: COLORS.textSecondary, padding: "6px 14px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, fontWeight: 600 }}>🗓️ Last 7 Days</span>
        </div>
        <div style={{ width: "100%", height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chart_data}>
              <defs><linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.4} /><stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight} vertical={false} />
              <XAxis dataKey="name" stroke={COLORS.textDim} axisLine={false} tickLine={false} dy={10} fontSize={12} />
              <YAxis stroke={COLORS.textDim} axisLine={false} tickLine={false} dx={-10} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "12px", color: COLORS.textPrimary, fontSize: "13px", boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }} />
              <Area type="monotone" dataKey="queries" stroke={COLORS.purpleLight} strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ==================== CHAT PAGE ====================
function ChatPage({ chatHistory, setChatHistory, isLoading, setIsLoading, onFirstMessage }) {
  const [query, setQuery] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const handleChat = async () => {
    if (!query.trim() || isLoading) return;
    const currentQuery = query; setQuery("");
    if (chatHistory.length === 0) onFirstMessage(currentQuery);
    setChatHistory((prev) => [...prev, { role: "user", text: currentQuery, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/chat`, { text: currentQuery });
      setChatHistory((prev) => [...prev, { role: "bot", text: res.data.answer, sources: res.data.sources, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), liked: null }]);
    } catch { setChatHistory((prev) => [...prev, { role: "bot", text: "⚠️ Service temporarily unavailable.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); }
    setIsLoading(false);
  };

  const handleRegenerate = async (index) => {
    const userMsg = [...chatHistory].reverse().find((m) => m.role === "user");
    if (!userMsg || isLoading) return; setIsLoading(true);
    try { const res = await axios.post(`${API_BASE}/chat`, { text: userMsg.text }); setChatHistory((prev) => { const u = [...prev]; u[index] = { ...u[index], text: res.data.answer, sources: res.data.sources, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), liked: null }; return u; }); } catch {}
    setIsLoading(false);
  };

  const handleLike = (index, value) => { setChatHistory((prev) => { const u = [...prev]; u[index] = { ...u[index], liked: u[index].liked === value ? null : value }; return u; }); };

  const exportChat = () => {
    const text = chatHistory.map((m) => `[${m.role.toUpperCase()}] ${m.time}: ${m.text}${m.sources ? `\nSources: ${m.sources.join(", ")}` : ""}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" }); const a = document.createElement("a"); a.download = `Swavik_Chat_${new Date().toISOString().slice(0, 10)}.txt`; a.href = window.URL.createObjectURL(blob); a.click();
  };

  const suggestions = [
    { emoji: "📋", text: "What are the leave policies?" },
    { emoji: "💰", text: "Show me salary details" },
    { emoji: "🏥", text: "What benefits are available?" },
    { emoji: "📅", text: "How many working days this month?" },
  ];

  return (
    <div className="animate-slide-right" style={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: COLORS.gradientCard, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🤖</div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: COLORS.textPrimary }}>AI Assistant</h2>
            <p style={{ fontSize: "11px", color: COLORS.green, fontWeight: 700 }}>🟢 Online • RAG Powered ⚡</p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button onClick={exportChat} style={{ border: `1px solid ${COLORS.border}`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, color: COLORS.textSecondary, background: COLORS.bgCard, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>📥 Export</button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: COLORS.bgDark, borderRadius: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "16px" }}>
        {chatHistory.length === 0 ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="animate-glow" style={{ width: "80px", height: "80px", background: COLORS.bgCard, borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", border: `1px solid ${COLORS.border}` }}>
              <Sparkles size={36} style={{ color: COLORS.purpleLight }} />
            </div>
            <p style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px", color: COLORS.textPrimary }}>How can I help you today? ✨</p>
            <p style={{ fontSize: "13px", color: COLORS.textDim, marginBottom: "32px" }}>Ask me anything about Swavik HR</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "500px", width: "100%" }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setQuery(s.text)}
                  style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "14px", padding: "16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.purple; e.currentTarget.style.boxShadow = `0 4px 16px ${COLORS.purpleGlow}`; e.currentTarget.style.background = COLORS.bgCardHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = COLORS.bgCard; }}>
                  <span style={{ fontSize: "20px" }}>{s.emoji}</span>
                  <span style={{ fontSize: "13px", color: COLORS.textSecondary, fontWeight: 500 }}>{s.text}</span>
                  <ChevronRight size={14} style={{ color: COLORS.textMuted, marginLeft: "auto" }} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {chatHistory.map((m, i) => (
              <div key={i} className="animate-slide-up" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ display: "flex", gap: "10px", maxWidth: "85%", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "12px", background: m.role === "user" ? COLORS.gradientPrimary : COLORS.gradientCard, border: m.role === "bot" ? `1px solid ${COLORS.border}` : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "16px" }}>
                    {m.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "16px 20px", borderRadius: "18px", background: m.role === "user" ? COLORS.gradientPrimary : COLORS.bgCard, color: m.role === "user" ? "white" : COLORS.textSecondary, fontSize: "14px", lineHeight: "1.7", border: m.role === "bot" ? `1px solid ${COLORS.border}` : "none", boxShadow: m.role === "user" ? `0 4px 20px ${COLORS.purpleGlow}` : `0 2px 8px rgba(0,0,0,0.2)` }}>
                      {m.role === "bot" ? <MarkdownContent content={m.text} /> : m.text}
                      {m.sources && m.sources.length > 0 && (
                        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: `1px solid ${COLORS.border}`, fontSize: "10px", fontWeight: 700, color: COLORS.purpleLight, textTransform: "uppercase", letterSpacing: "1px" }}>📎 Sources: {m.sources.join(", ")}</div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "6px", paddingLeft: m.role === "user" ? "0" : "4px", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                      <CopyButton text={m.text} />
                      {m.role === "bot" && (
                        <>
                          <button onClick={() => handleLike(i, "up")} style={{ background: m.liked === "up" ? "rgba(16,185,129,0.15)" : "transparent", border: m.liked === "up" ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent", borderRadius: "8px", padding: "5px", cursor: "pointer", color: m.liked === "up" ? COLORS.green : COLORS.textMuted, display: "flex", transition: "all 0.2s" }} onMouseEnter={(e) => { if (m.liked !== "up") e.currentTarget.style.color = COLORS.green; }} onMouseLeave={(e) => { if (m.liked !== "up") e.currentTarget.style.color = COLORS.textMuted; }}><ThumbsUp size={14} /></button>
                          <button onClick={() => handleLike(i, "down")} style={{ background: m.liked === "down" ? "rgba(239,68,68,0.15)" : "transparent", border: m.liked === "down" ? "1px solid rgba(239,68,68,0.3)" : "1px solid transparent", borderRadius: "8px", padding: "5px", cursor: "pointer", color: m.liked === "down" ? COLORS.red : COLORS.textMuted, display: "flex", transition: "all 0.2s" }} onMouseEnter={(e) => { if (m.liked !== "down") e.currentTarget.style.color = COLORS.red; }} onMouseLeave={(e) => { if (m.liked !== "down") e.currentTarget.style.color = COLORS.textMuted; }}><ThumbsDown size={14} /></button>
                          <button onClick={() => handleRegenerate(i)} disabled={isLoading} style={{ background: "transparent", border: "1px solid transparent", borderRadius: "8px", padding: "5px", cursor: isLoading ? "not-allowed" : "pointer", color: COLORS.textMuted, display: "flex", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = COLORS.purpleLight} onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}><RefreshCw size={14} /></button>
                        </>
                      )}
                      <span style={{ fontSize: "10px", color: COLORS.textMuted, marginLeft: "8px", display: "flex", alignItems: "center", gap: "3px" }}><Clock size={10} /> {m.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "12px", background: COLORS.gradientCard, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🤖</div>
                <div style={{ padding: "16px 20px", borderRadius: "18px", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", background: COLORS.bgCard, padding: "8px 8px 8px 4px", borderRadius: "18px", border: `1px solid ${COLORS.border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)`, alignItems: "flex-end" }}>
        <TextareaAutosize value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChat(); }}}
          placeholder="💭 Ask about HR policies, employee data... (Shift+Enter for new line)"
          minRows={1} maxRows={5}
          style={{ flex: 1, background: "transparent", padding: "12px 16px", border: "none", outline: "none", color: COLORS.textPrimary, fontSize: "14px", resize: "none", fontFamily: "inherit", lineHeight: "1.5" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", paddingBottom: "4px" }}>
          <span style={{ fontSize: "10px", color: query.length > 500 ? COLORS.red : COLORS.textMuted, fontWeight: 600 }}>{query.length}</span>
          <button onClick={handleChat} disabled={isLoading || !query.trim()}
            style={{ background: isLoading || !query.trim() ? COLORS.bgCardHover : COLORS.gradientPrimary, color: "white", border: "none", padding: "12px 18px", borderRadius: "12px", cursor: isLoading || !query.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isLoading || !query.trim() ? "none" : `0 4px 16px ${COLORS.purpleGlow}`, transition: "all 0.2s" }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== UPLOAD PAGE ====================
function UploadPage({ onUploadComplete }) {
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

// ==================== ANALYTICS ====================
function AnalyticsPage({ stats }) {
  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: "28px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>📈 Analytics Dashboard</h2>
      <p style={{ color: COLORS.textDim, marginBottom: "32px", fontSize: "14px" }}>Detailed system performance metrics 🔍</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px", gridColumn: "span 2" }}>
          <h3 style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: "20px" }}>📊 Query Trends</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart_data}>
                <defs><linearGradient id="cq2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.violet} stopOpacity={0.4} /><stop offset="95%" stopColor={COLORS.violet} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.textDim} axisLine={false} tickLine={false} />
                <YAxis stroke={COLORS.textDim} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "12px", color: COLORS.textPrimary, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }} />
                <Area type="monotone" dataKey="queries" stroke={COLORS.violet} strokeWidth={3} fillOpacity={1} fill="url(#cq2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <h3 style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: "20px" }}>🏥 System Health</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[{ label: "⏱️ Uptime", value: "99.9%", color: COLORS.green }, { label: "⚡ Avg Response", value: "1.2s", color: COLORS.purpleLight }, { label: "❌ Error Rate", value: "0.1%", color: COLORS.red }].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: COLORS.bgDark, borderRadius: "14px", border: `1px solid ${COLORS.borderLight}` }}>
                <span style={{ color: COLORS.textSecondary, fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 800, fontSize: "16px" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <h3 style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: "20px" }}>🧠 Model Info</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[{ label: "🔮 LLM", value: "LLaMA 3.3 70B" }, { label: "🔗 Embeddings", value: "MiniLM-L6-v2" }, { label: "💾 Vector Store", value: "FAISS" }].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: COLORS.bgDark, borderRadius: "14px", border: `1px solid ${COLORS.borderLight}` }}>
                <span style={{ color: COLORS.textSecondary, fontSize: "13px", fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: COLORS.purpleLight, fontWeight: 700, fontSize: "13px" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileImg, setProfileImg] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky");
  const [stats, setStats] = useState({ total_docs: 0, queries: 0, accuracy: 0, chart_data: [] });
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = () => { axios.get(`${API_BASE}/stats`).then((res) => setStats(res.data)).catch(() => {}); };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
      const savedImg = localStorage.getItem("sw_profile_img"); if (savedImg) setProfileImg(savedImg);
      const savedConvs = JSON.parse(localStorage.getItem("sw_conversations") || "[]");
      setConversations(savedConvs);
      if (savedConvs.length > 0) { setActiveConvId(savedConvs[0].id); setChatHistory(savedConvs[0].messages || []); }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeConvId && conversations.length > 0) {
      const updated = conversations.map((c) => c.id === activeConvId ? { ...c, messages: chatHistory } : c);
      setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated));
    }
  }, [chatHistory]);

  const handleNewChat = () => {
    if (activeConvId) { const updated = conversations.map((c) => c.id === activeConvId ? { ...c, messages: chatHistory } : c); setConversations(updated); }
    const newId = Date.now().toString(); const newConv = { id: newId, title: "New Chat ✨", messages: [] };
    const updatedConvs = [newConv, ...conversations]; setConversations(updatedConvs); setActiveConvId(newId); setChatHistory([]);
    localStorage.setItem("sw_conversations", JSON.stringify(updatedConvs));
  };

  const handleSelectConv = (id) => {
    if (activeConvId) { const updated = conversations.map((c) => c.id === activeConvId ? { ...c, messages: chatHistory } : c); setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated)); }
    setActiveConvId(id); const conv = conversations.find((c) => c.id === id); setChatHistory(conv ? conv.messages || [] : []);
  };

  const handleDeleteConv = (id) => {
    const updated = conversations.filter((c) => c.id !== id); setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated));
    if (activeConvId === id) { if (updated.length > 0) { setActiveConvId(updated[0].id); setChatHistory(updated[0].messages || []); } else { setActiveConvId(null); setChatHistory([]); } }
  };

  const handleFirstMessage = (text) => {
    if (!activeConvId) { const newId = Date.now().toString(); const title = text.length > 30 ? text.substring(0, 30) + "..." : text; const newConv = { id: newId, title, messages: [] }; const updatedConvs = [newConv, ...conversations]; setConversations(updatedConvs); setActiveConvId(newId); localStorage.setItem("sw_conversations", JSON.stringify(updatedConvs)); }
    else { const title = text.length > 30 ? text.substring(0, 30) + "..." : text; const updated = conversations.map((c) => c.id === activeConvId ? { ...c, title } : c); setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated)); }
  };

  const handleLogin = (name) => { setUsername(name); setIsLoggedIn(true); };
  const handleLogout = () => { setIsLoggedIn(false); setUsername(""); setActiveTab("dashboard"); };
  const handleProfileChange = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = () => { setProfileImg(reader.result); localStorage.setItem("sw_profile_img", reader.result); }; reader.readAsDataURL(file); } };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); if (tab === "chat" && !activeConvId) handleNewChat(); }}
        username={username} profileImg={profileImg} onProfileChange={handleProfileChange} onLogout={handleLogout}
        conversations={conversations} activeConvId={activeConvId} onNewChat={handleNewChat} onSelectConv={handleSelectConv} onDeleteConv={handleDeleteConv} />
      <main style={{ flex: 1, overflowY: "auto", padding: "40px", background: COLORS.gradientBg }}>
        {activeTab === "dashboard" && <DashboardPage stats={stats} username={username} />}
        {activeTab === "chat" && <ChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} isLoading={isLoading} setIsLoading={setIsLoading} onFirstMessage={handleFirstMessage} />}
        {activeTab === "upload" && <UploadPage onUploadComplete={fetchStats} />}
        {activeTab === "analytics" && <AnalyticsPage stats={stats} />}
      </main>
    </div>
  );
}