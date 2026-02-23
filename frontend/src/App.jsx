import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  MessageSquare,
  Upload,
  BarChart3,
  Target,
  LogOut,
  Send,
  CloudUpload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Bot,
  User,
  Loader2,
  Shield,
  Zap,
  Database,
  TrendingUp,
  Clock,
  Search,
  X,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

// ==================== LOGIN PAGE ====================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    // Simple auth (replace with real auth in production)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("sw_users") || "{}");
      if (!users[username]) {
        users[username] = password;
        localStorage.setItem("sw_users", JSON.stringify(users));
        onLogin(username);
      } else if (users[username] === password) {
        onLogin(username);
      } else {
        setError("Incorrect password for this account");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          background: "#1e293b",
          padding: "48px",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "420px",
          border: "1px solid #334155",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            background:
              "linear-gradient(135deg, #0ea5e9, #6366f1)",
            borderRadius: "16px",
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(14, 165, 233, 0.3)",
          }}
        >
          <Shield style={{ color: "white" }} size={32} />
        </div>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            marginBottom: "4px",
          }}
        >
          Swavik AI
        </h2>
        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "32px",
            fontSize: "14px",
          }}
        >
          Secure Employee Portal
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Username"
            style={{
              width: "100%",
              background: "#0f172a",
              border: "1px solid #334155",
              padding: "14px 16px",
              borderRadius: "12px",
              color: "white",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            style={{
              width: "100%",
              background: "#0f172a",
              border: "1px solid #334155",
              padding: "14px 16px",
              borderRadius: "12px",
              color: "white",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
            onBlur={(e) => (e.target.style.borderColor = "#334155")}
          />
        </div>

        {error && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              color: "#ef4444",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: loading
              ? "#334155"
              : "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "white",
            fontWeight: 700,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
            boxShadow: loading
              ? "none"
              : "0 10px 30px rgba(14, 165, 233, 0.2)",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-pulse-slow" />
              Authenticating...
            </>
          ) : (
            "Access Portal"
          )}
        </button>
      </div>
    </div>
  );
}

// ==================== SIDEBAR ====================
function Sidebar({ activeTab, setActiveTab, username, onLogout }) {
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "chat", icon: MessageSquare, label: "RAG Chatbot" },
    { id: "upload", icon: Upload, label: "Document Manager" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <aside
      style={{
        width: "280px",
        background: "#1e293b",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        padding: "32px 20px",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
          paddingLeft: "8px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background:
              "linear-gradient(135deg, #0ea5e9, #6366f1)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(14, 165, 233, 0.3)",
          }}
        >
          <Zap style={{ color: "white" }} size={20} />
        </div>
        <span
          style={{
            color: "#0ea5e9",
            fontWeight: 900,
            fontSize: "20px",
            letterSpacing: "1px",
          }}
        >
          SWAVIK.AI
        </span>
      </div>

      {/* User */}
      <div
        style={{
          background: "#0f172a",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          border: "1px solid #334155",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: "16px",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {username}
            </p>
            <p
              style={{
                color: "#22c55e",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              ● Online
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: isActive
                  ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                  : "transparent",
                color: isActive ? "white" : "#94a3b8",
                fontWeight: isActive ? 700 : 500,
                fontSize: "13px",
                boxShadow: isActive
                  ? "0 8px 20px rgba(14,165,233,0.2)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#334155";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#64748b",
          background: "none",
          border: "1px solid #334155",
          padding: "12px 16px",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ef4444";
          e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#64748b";
          e.currentTarget.style.borderColor = "#334155";
        }}
      >
        <LogOut size={18} /> Sign Out
      </button>
    </aside>
  );
}

// ==================== DASHBOARD ====================
function DashboardPage({ stats }) {
  const statCards = [
    {
      icon: <Database size={28} />,
      label: "Total Documents",
      value: stats.total_docs,
      sub: "Active in RAG",
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.1)",
    },
    {
      icon: <MessageSquare size={28} />,
      label: "Total Queries",
      value: stats.queries.toLocaleString(),
      sub: "Lifetime usage",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.1)",
    },
    {
      icon: <TrendingUp size={28} />,
      label: "Accuracy Rate",
      value: `${stats.accuracy}%`,
      sub: "Last 30 days",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.1)",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "white",
            marginBottom: "8px",
          }}
        >
          Welcome Back, Admin 👋
        </h1>
        <p style={{ color: "#94a3b8", fontWeight: 500, fontSize: "15px" }}>
          Monitoring company knowledge systems
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {statCards.map((card, i) => (
          <div
            key={i}
            className="animate-slide-up"
            style={{
              animationDelay: `${i * 0.1}s`,
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "24px",
              padding: "28px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              transition: "transform 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <div>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {card.value}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="animate-slide-up"
        style={{
          animationDelay: "0.3s",
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "24px",
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "white" }}>
            Knowledge Base Activity
          </h3>
          <span
            style={{
              fontSize: "11px",
              background: "#0f172a",
              color: "#94a3b8",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #334155",
              fontWeight: 600,
            }}
          >
            Last 7 Days
          </span>
        </div>
        <div style={{ width: "100%", height: "320px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chart_data}>
              <defs>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                axisLine={false}
                tickLine={false}
                dy={10}
                fontSize={12}
              />
              <YAxis
                stroke="#64748b"
                axisLine={false}
                tickLine={false}
                dx={-10}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorQueries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ==================== CHAT PAGE ====================
function ChatPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChat = async () => {
    if (!query.trim() || isLoading) return;
    const currentQuery = query;
    setQuery("");
    setChatHistory((prev) => [
      ...prev,
      { role: "user", text: currentQuery },
    ]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        text: currentQuery,
      });
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.data.answer,
          sources: res.data.sources,
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Service temporarily unavailable. Please try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const exportChat = () => {
    const text = chatHistory
      .map(
        (m) =>
          `[${m.role.toUpperCase()}]: ${m.text}${
            m.sources ? `\nSources: ${m.sources.join(", ")}` : ""
          }`
      )
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = `Swavik_Chat_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
  };

  return (
    <div
      className="animate-slide-right"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(14,165,233,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot style={{ color: "#0ea5e9" }} size={22} />
          </div>
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "white",
              }}
            >
              AI Assistant
            </h2>
            <p
              style={{
                fontSize: "11px",
                color: "#22c55e",
                fontWeight: 700,
              }}
            >
              ● Online • RAG Powered
            </p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={exportChat}
            style={{
              border: "1px solid #334155",
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#94a3b8",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Export Chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          background: "rgba(15,23,42,0.5)",
          borderRadius: "24px",
          border: "1px solid #334155",
          marginBottom: "16px",
        }}
      >
        {chatHistory.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            <div
              className="animate-bounce-slow"
              style={{
                width: "80px",
                height: "80px",
                background: "#1e293b",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                border: "1px solid #334155",
              }}
            >
              <Bot size={36} />
            </div>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#94a3b8",
              }}
            >
              Start a conversation
            </p>
            <p style={{ fontSize: "13px", maxWidth: "300px" }}>
              Ask about Swavik HR policies, employee data, or company
              information
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {chatHistory.map((m, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{
                  display: "flex",
                  justifyContent:
                    m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    maxWidth: "80%",
                    flexDirection:
                      m.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background:
                        m.role === "user"
                          ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                          : "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border:
                        m.role === "bot"
                          ? "1px solid #334155"
                          : "none",
                    }}
                  >
                    {m.role === "user" ? (
                      <User size={16} style={{ color: "white" }} />
                    ) : (
                      <Bot size={16} style={{ color: "#0ea5e9" }} />
                    )}
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "18px",
                      background:
                        m.role === "user"
                          ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                          : "#1e293b",
                      color: "white",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      border:
                        m.role === "bot"
                          ? "1px solid #334155"
                          : "none",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.text}
                    {m.sources && m.sources.length > 0 && (
                      <div
                        style={{
                          marginTop: "12px",
                          paddingTop: "10px",
                          borderTop: "1px solid #334155",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#0ea5e9",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        📎 Sources: {m.sources.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    background: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #334155",
                  }}
                >
                  <Bot size={16} style={{ color: "#0ea5e9" }} />
                </div>
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: "18px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          background: "#1e293b",
          padding: "8px",
          borderRadius: "18px",
          border: "1px solid #334155",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleChat()}
          placeholder="Ask about HR policies, employee data..."
          style={{
            flex: 1,
            background: "transparent",
            padding: "12px 16px",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleChat}
          disabled={isLoading}
          style={{
            background:
              isLoading
                ? "#334155"
                : "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ==================== UPLOAD PAGE ====================
function UploadPage({ onUploadComplete }) {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/files`);
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files");
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploadStatus("loading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_BASE}/upload`, formData);
      setUploadStatus("success");
      fetchFiles();
      if (onUploadComplete) onUploadComplete();
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_BASE}/files/${filename}`);
      fetchFiles();
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div
      className="animate-slide-up"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "white",
          marginBottom: "8px",
        }}
      >
        Document Manager 📁
      </h2>
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "32px",
          fontSize: "14px",
        }}
      >
        Upload CSV files to expand the AI knowledge base
      </p>

      {/* Upload Zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files[0]);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `2px dashed ${
            dragOver
              ? "#0ea5e9"
              : uploadStatus === "loading"
              ? "#0ea5e9"
              : "#334155"
          }`,
          borderRadius: "24px",
          padding: "60px 32px",
          cursor: "pointer",
          transition: "all 0.3s",
          background: dragOver
            ? "rgba(14,165,233,0.05)"
            : "transparent",
          marginBottom: "24px",
        }}
      >
        <input
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files[0])}
          accept=".csv"
        />
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#1e293b",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            border: "1px solid #334155",
          }}
        >
          {uploadStatus === "loading" ? (
            <Loader2
              size={32}
              className="animate-pulse-slow"
              style={{ color: "#0ea5e9" }}
            />
          ) : (
            <CloudUpload size={32} style={{ color: "#0ea5e9" }} />
          )}
        </div>
        <p
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "white",
            marginBottom: "8px",
          }}
        >
          {uploadStatus === "loading"
            ? "Processing..."
            : "Drag & drop to upload"}
        </p>
        <p style={{ color: "#64748b", fontSize: "13px" }}>
          or click to browse CSV files
        </p>
      </label>

      {/* Status Messages */}
      {uploadStatus === "success" && (
        <div
          className="animate-slide-up"
          style={{
            padding: "14px 18px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#22c55e",
            fontWeight: 600,
            fontSize: "13px",
            marginBottom: "24px",
          }}
        >
          <CheckCircle2 size={18} /> File successfully processed and indexed!
        </div>
      )}

      {uploadStatus === "error" && (
        <div
          className="animate-slide-up"
          style={{
            padding: "14px 18px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#ef4444",
            fontWeight: 600,
            fontSize: "13px",
            marginBottom: "24px",
          }}
        >
          <AlertCircle size={18} /> Upload failed. Please try again.
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div
          style={{
            background: "#1e293b",
            borderRadius: "20px",
            border: "1px solid #334155",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                color: "white",
                fontSize: "15px",
              }}
            >
              Indexed Files
            </h3>
            <span
              style={{
                fontSize: "11px",
                background: "rgba(14,165,233,0.1)",
                color: "#0ea5e9",
                padding: "4px 12px",
                borderRadius: "20px",
                fontWeight: 700,
              }}
            >
              {files.length} files
            </span>
          </div>
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom:
                  i < files.length - 1 ? "1px solid #1e293b" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FileText size={18} style={{ color: "#0ea5e9" }} />
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "white",
                      fontSize: "13px",
                    }}
                  >
                    {f.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                    }}
                  >
                    {f.size} • {f.date}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#22c55e",
                    background: "rgba(34,197,94,0.1)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    border: "1px solid rgba(34,197,94,0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Indexed
                </span>
                <button
                  onClick={() => handleDelete(f.name)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: "4px",
                    borderRadius: "6px",
                    display: "flex",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ef4444")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#64748b")
                  }
                >
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

// ==================== ANALYTICS PAGE ====================
function AnalyticsPage({ stats }) {
  return (
    <div className="animate-fade-in">
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "white",
          marginBottom: "8px",
        }}
      >
        Analytics Dashboard 📊
      </h2>
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "32px",
          fontSize: "14px",
        }}
      >
        Detailed system performance metrics
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
      >
        {/* Query Trends */}
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "28px",
            gridColumn: "span 2",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: "white",
              marginBottom: "20px",
            }}
          >
            Query Trends
          </h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart_data}>
                <defs>
                  <linearGradient
                    id="colorQueries2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#a855f7"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#a855f7"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorQueries2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "28px",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: "white",
              marginBottom: "20px",
            }}
          >
            System Health
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {[
              { label: "Uptime", value: "99.9%", color: "#22c55e" },
              { label: "Avg Response", value: "1.2s", color: "#0ea5e9" },
              { label: "Error Rate", value: "0.1%", color: "#ef4444" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "#0f172a",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    color: item.color,
                    fontWeight: 800,
                    fontSize: "16px",
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "28px",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: "white",
              marginBottom: "20px",
            }}
          >
            Model Info
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {[
              { label: "LLM", value: "LLaMA 3.3 70B" },
              { label: "Embeddings", value: "MiniLM-L6-v2" },
              { label: "Vector Store", value: "FAISS" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "#0f172a",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                }}
              >
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  {item.value}
                </span>
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
  const [stats, setStats] = useState({
    total_docs: 0,
    queries: 0,
    accuracy: 0,
    chart_data: [],
  });

  const fetchStats = () => {
    axios
      .get(`${API_BASE}/stats`)
      .then((res) => setStats(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn]);

  const handleLogin = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setActiveTab("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        username={username}
        onLogout={handleLogout}
      />
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px",
          background:
            "radial-gradient(circle at top right, #1e293b 0%, #0f172a 50%, #0f172a 100%)",
        }}
      >
        {activeTab === "dashboard" && <DashboardPage stats={stats} />}
        {activeTab === "chat" && <ChatPage />}
        {activeTab === "upload" && (
          <UploadPage onUploadComplete={fetchStats} />
        )}
        {activeTab === "analytics" && <AnalyticsPage stats={stats} />}
      </main>
    </div>
  );
}