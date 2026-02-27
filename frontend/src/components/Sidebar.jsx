import React from "react";
import { LogOut, Zap, Camera, Plus, MessageCircle, X } from "lucide-react";
import { COLORS } from "../theme";

export default function Sidebar({ activeTab, setActiveTab, username, profileImg, onProfileChange, onLogout, conversations, activeConvId, onNewChat, onSelectConv, onDeleteConv }) {
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