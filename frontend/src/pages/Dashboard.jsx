import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { COLORS } from "../theme";

export default function DashboardPage({ stats, username }) {

  const mostUsedDocs = [
    { name: "Employee Handbook", uses: 342, icon: "📘", trend: "+12%" },
    { name: "Leave Policy 2026", uses: 289, icon: "🏖️", trend: "+8%" },
    { name: "Salary Structure", uses: 256, icon: "💰", trend: "+15%" },
    { name: "Benefits Guide", uses: 198, icon: "🏥", trend: "+5%" },
    { name: "IT Security Policy", uses: 145, icon: "🔒", trend: "+3%" },
  ];

  const departmentActivity = [
    { dept: "HR", queries: 456, color: "#7c3aed" },
    { dept: "Finance", queries: 389, color: "#6366f1" },
    { dept: "Engineering", queries: 334, color: "#8b5cf6" },
    { dept: "Sales", queries: 278, color: "#a78bfa" },
    { dept: "Legal", queries: 201, color: "#c4b5fd" },
  ];

  const recentActivities = [
    { action: "Queried", doc: "Leave Policy", user: "Priya S.", time: "2 min ago", emoji: "🔍" },
    { action: "Uploaded", doc: "Q4 Report.xlsx", user: "Admin", time: "15 min ago", emoji: "📤" },
    { action: "Exported", doc: "Chat Summary", user: "Rahul M.", time: "1 hr ago", emoji: "📥" },
    { action: "Queried", doc: "Salary Structure", user: "Anita K.", time: "2 hr ago", emoji: "🔍" },
  ];

  const systemHealth = [
    { label: "AI Model", status: "Operational", color: COLORS.green, icon: "🤖" },
    { label: "Database", status: "Healthy", color: COLORS.green, icon: "🗄️" },
    { label: "API Gateway", status: "Active", color: COLORS.green, icon: "🌐" },
    { label: "Storage", status: "72% Used", color: COLORS.amber, icon: "💾" },
  ];

  const statCards = [
    { icon: "📄", label: "Total Documents", value: stats.total_docs, sub: "Active in RAG", color: COLORS.purpleLight, glow: COLORS.purpleGlow },
    { icon: "📑", label: "Most Used Document", value: "Handbook", sub: "342 queries this month", color: COLORS.violet, glow: "rgba(139,92,246,0.3)" },
    { icon: "🎯", label: "Accuracy Rate", value: `${stats.accuracy}%`, sub: "Last 30 days", color: COLORS.green, glow: "rgba(16,185,129,0.3)" },
    { icon: "👥", label: "Active Users", value: "48", sub: "Across 5 departments", color: COLORS.amber, glow: "rgba(245,158,11,0.3)" },
  ];

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>
          Welcome Back, {username} 👋🎉
        </h1>
        <p style={{ color: COLORS.textDim, fontWeight: 500, fontSize: "15px" }}>
          📡 Enterprise Knowledge Intelligence Dashboard
        </p>
      </div>

      {/* Stat Cards - 4 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
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
              <p style={{ fontSize: "24px", fontWeight: 900, color: card.color, lineHeight: 1, marginBottom: "4px" }}>{card.value}</p>
              <p style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 600 }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: AI Usage Trends + Department Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* AI Usage Trends Chart */}
        <div className="animate-slide-up" style={{
          animationDelay: "0.3s", background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "28px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>⚡ AI Usage Trends</h3>
            <span style={{
              fontSize: "11px", background: COLORS.bgActive, color: COLORS.textSecondary,
              padding: "5px 12px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, fontWeight: 600,
            }}>🗓️ Last 7 Days</span>
          </div>
          <div style={{ width: "100%", height: "220px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart_data}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderLight} vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.textDim} axisLine={false} tickLine={false} dy={8} fontSize={11} />
                <YAxis stroke={COLORS.textDim} axisLine={false} tickLine={false} dx={-5} fontSize={11} />
                <Tooltip contentStyle={{
                  backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                  borderRadius: "12px", color: COLORS.textPrimary, fontSize: "12px",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
                }} />
                <Area type="monotone" dataKey="queries" stroke={COLORS.purpleLight} strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Activity */}
        <div className="animate-slide-up" style={{
          animationDelay: "0.4s", background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "28px",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "20px" }}>
            🏢 Department Activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {departmentActivity.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textSecondary, minWidth: "80px" }}>{d.dept}</span>
                <div style={{ flex: 1, height: "8px", background: COLORS.bgDark, borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    width: `${(d.queries / 456) * 100}%`, height: "100%",
                    background: `linear-gradient(90deg, ${d.color}, ${d.color}aa)`,
                    borderRadius: "4px", transition: "width 1s ease-out",
                  }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: COLORS.textDim, minWidth: "36px", textAlign: "right" }}>
                  {d.queries}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Most Used Documents + Recent Activity + System Health */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", gap: "20px" }}>

        {/* Most Used Documents */}
        <div className="animate-slide-up" style={{
          animationDelay: "0.5s", background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "18px" }}>
            📑 Most Used Documents
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {mostUsedDocs.map((doc, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px",
                borderRadius: "14px", background: COLORS.bgDark, border: `1px solid ${COLORS.borderLight}`,
                transition: "all 0.2s", cursor: "default",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.bgCardHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.background = COLORS.bgDark; }}>
                <span style={{ fontSize: "20px" }}>{doc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</p>
                  <p style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 600 }}>{doc.uses} queries</p>
                </div>
                <span style={{
                  fontSize: "10px", fontWeight: 700, color: COLORS.green,
                  background: "rgba(16,185,129,0.1)", padding: "3px 8px", borderRadius: "8px",
                }}>{doc.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="animate-slide-up" style={{
          animationDelay: "0.6s", background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "18px" }}>
            🔔 Live Activity Feed
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", position: "relative" }}>

                {/* Timeline line */}
                {i < recentActivities.length - 1 && (
                  <div style={{
                    position: "absolute", left: "17px", top: "36px", width: "2px",
                    height: "calc(100% + 4px)", background: COLORS.borderLight,
                  }} />
                )}

                <div style={{
                  width: "36px", height: "36px", borderRadius: "12px", background: COLORS.gradientCard,
                  border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "16px", flexShrink: 0, zIndex: 1,
                }}>{act.emoji}</div>
                <div>
                  <p style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: "1.5" }}>
                    <span style={{ fontWeight: 700, color: COLORS.textPrimary }}>{act.user}</span>
                    {" "}{act.action}{" "}
                    <span style={{ color: COLORS.purpleLight, fontWeight: 600 }}>{act.doc}</span>
                  </p>
                  <p style={{ fontSize: "10px", color: COLORS.textMuted, marginTop: "2px", fontWeight: 600 }}>🕐 {act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="animate-slide-up" style={{
          animationDelay: "0.7s", background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary, marginBottom: "18px" }}>
            🖥️ System Health
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {systemHealth.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px",
                borderRadius: "14px", background: COLORS.bgDark, border: `1px solid ${COLORS.borderLight}`,
              }}>
                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary }}>{s.label}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%", background: s.color,
                    boxShadow: `0 0 8px ${s.color}`,
                  }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: s.color }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick action */}
          <div style={{
            marginTop: "18px", padding: "16px", borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.08))",
            border: `1px solid ${COLORS.border}`, textAlign: "center",
          }}>
            <p style={{ fontSize: "20px", marginBottom: "6px" }}>🚀</p>
            <p style={{ fontSize: "12px", fontWeight: 700, color: COLORS.purpleLight }}>All Systems Go</p>
            <p style={{ fontSize: "10px", color: COLORS.textMuted, marginTop: "2px" }}>Last checked 30s ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}