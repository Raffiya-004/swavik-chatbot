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
import FeedbackPage from "./pages/Feedback";
import { supabase, getUserId, loadConversations, saveConversation, deleteConversation } from "./supabaseClient";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileImg, setProfileImg] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky");
  const [stats, setStats] = useState({ total_docs: 0, queries: 0, accuracy: 0, chart_data: [] });
  const [fileList, setFileList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = () => { axios.get(`${API_BASE}/stats`).then((res) => setStats(res.data)).catch(() => { }); };
  const fetchFiles = () => { axios.get(`${API_BASE}/files`).then((res) => setFileList(Array.isArray(res.data) ? res.data : [])).catch(() => { }); };

  useEffect(() => {
    const initData = async () => {
      if (isLoggedIn) {
        fetchStats();
        fetchFiles();
        const savedImg = localStorage.getItem("sw_profile_img"); if (savedImg) setProfileImg(savedImg);
        const savedRole = localStorage.getItem("sw_user_role"); if (savedRole) setUserRole(savedRole);

        let savedConvs = [];
        if (supabase && userId) {
          const dbConvs = await loadConversations(userId);
          savedConvs = dbConvs.map(c => ({ id: c.conversation_id, title: c.title, messages: c.messages }));
        } else {
          savedConvs = JSON.parse(localStorage.getItem("sw_conversations") || "[]");
        }
        setConversations(savedConvs);
        if (savedConvs.length > 0) { setActiveConvId(savedConvs[0].id); setChatHistory(savedConvs[0].messages || []); }
      }
    };
    initData();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (activeConvId && conversations.length > 0) {
      const updated = conversations.map((c) => c.id === activeConvId ? { ...c, messages: chatHistory } : c);
      setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated));
      const activeConv = updated.find(c => c.id === activeConvId);
      if (supabase && userId && activeConv) {
        saveConversation(userId, activeConvId, activeConv.title, chatHistory);
      }
    }
  }, [chatHistory, activeConvId]);

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

  const handleDeleteConv = async (id) => {
    const updated = conversations.filter((c) => c.id !== id); setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated));
    if (supabase && userId) await deleteConversation(userId, id);
    if (activeConvId === id) { if (updated.length > 0) { setActiveConvId(updated[0].id); setChatHistory(updated[0].messages || []); } else { setActiveConvId(null); setChatHistory([]); } }
  };

  const handleFirstMessage = (text) => {
    if (!activeConvId) { const newId = Date.now().toString(); const title = text.length > 30 ? text.substring(0, 30) + "..." : text; const newConv = { id: newId, title, messages: [] }; const updatedConvs = [newConv, ...conversations]; setConversations(updatedConvs); setActiveConvId(newId); localStorage.setItem("sw_conversations", JSON.stringify(updatedConvs)); if (supabase && userId) saveConversation(userId, newId, title, []); }
    else { const title = text.length > 30 ? text.substring(0, 30) + "..." : text; const updated = conversations.map((c) => c.id === activeConvId ? { ...c, title } : c); setConversations(updated); localStorage.setItem("sw_conversations", JSON.stringify(updated)); if (supabase && userId) saveConversation(userId, activeConvId, title, chatHistory); }
  };

  const speakGreeting = (name) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = `Hi ${name}, Swavik at your service.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for a professional tone
      utterance.pitch = 1.0;

      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prefer English voices with natural-sounding keywords
        const preferredVoice = voices.find(v =>
          (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural')) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) utterance.voice = preferredVoice;
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoice();
          window.speechSynthesis.onvoiceschanged = null;
        };
      }
    }
  };

  const handleLogin = async (name, role = 'user') => {
    setUsername(name);
    setUserRole(role);
    localStorage.setItem("sw_user_role", role);
    if (supabase) {
      const currentUserId = await getUserId(name);
      setUserId(currentUserId);
    }
    setIsLoggedIn(true);
    speakGreeting(name);
  };
  const handleLogout = () => { setIsLoggedIn(false); setUsername(""); setUserRole("user"); setActiveTab("dashboard"); };
  const handleProfileChange = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = () => { setProfileImg(reader.result); localStorage.setItem("sw_profile_img", reader.result); }; reader.readAsDataURL(file); } };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); if (tab === "chat" && !activeConvId) handleNewChat(); }}
        username={username} userRole={userRole} profileImg={profileImg} onProfileChange={handleProfileChange} onLogout={handleLogout}
        conversations={conversations} activeConvId={activeConvId} onNewChat={handleNewChat} onSelectConv={handleSelectConv} onDeleteConv={handleDeleteConv} />
      <main style={{ flex: 1, overflowY: "auto", padding: "40px", background: COLORS.gradientBg }}>
        {activeTab === "dashboard" && <DashboardPage stats={stats} username={username} fileList={fileList} />}
        {activeTab === "chat" && <ChatPage chatHistory={chatHistory} setChatHistory={setChatHistory} isLoading={isLoading} setIsLoading={setIsLoading} onFirstMessage={handleFirstMessage} />}
        {activeTab === "upload" && <UploadPage onUploadComplete={() => { fetchStats(); fetchFiles(); }} userId={userId} />}
        {activeTab === "analytics" && <AnalyticsPage stats={stats} />}
        {activeTab === "feedback" && <FeedbackPage username={username} />}
        {activeTab === "admin-feedbacks" && <FeedbackPage username={username} isAdminView={true} />}
      </main>
    </div>
  );
}