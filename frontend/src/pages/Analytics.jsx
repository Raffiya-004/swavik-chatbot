import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../theme";

export default function AnalyticsPage({ stats }) {
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