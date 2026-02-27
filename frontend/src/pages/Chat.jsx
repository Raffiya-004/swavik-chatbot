import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { Send, Clock, Sparkles, ChevronRight, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { MarkdownContent, CopyButton } from "../components/Shared";
import { COLORS, API_BASE } from "../theme";

export default function ChatPage({ chatHistory, setChatHistory, isLoading, setIsLoading, onFirstMessage }) {
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