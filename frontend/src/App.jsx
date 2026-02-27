import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { COLORS, API_BASE } from "./theme";

// Components
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ChatPage from "./pages/Chat";
import UploadPage from "./pages/Upload";
import AnalyticsPage from "./pages/Analytics";

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
  }, [chatHistory, activeConvId, conversations]);

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