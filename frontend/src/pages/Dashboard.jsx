import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../theme";

export default function DashboardPage({ stats, username }) {
  const statCards = [
    { icon: "📄", label: "Total Documents", value: stats.total_docs, sub: "Active in RAG", color: COLORS.purpleLight, glow: COLORS.purpleGlow },
    { icon: "💬", label: "Total Queries", value: stats.queries?.toLocaleString() || "0", sub: "Lifetime usage", color: COLORS.violet, glow: "rgba(139,92,246,0.3)" },
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