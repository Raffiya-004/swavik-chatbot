import React, { useState, useEffect } from "react";
import { COLORS } from "../theme";
import { Star, Send, CheckCircle2, MessageSquareReply, Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function FeedbackPage({ username }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [category, setCategory] = useState("");
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [showForm, setShowForm] = useState(true);

    const categories = [
        { id: "general", label: "General", emoji: "💬" },
        { id: "ui", label: "User Interface", emoji: "🎨" },
        { id: "ai", label: "AI Responses", emoji: "🤖" },
        { id: "performance", label: "Performance", emoji: "⚡" },
        { id: "feature", label: "Feature Request", emoji: "💡" },
        { id: "bug", label: "Bug Report", emoji: "🐛" },
    ];

    const getCategoryInfo = (id) => categories.find((c) => c.id === id) || { label: id || "General", emoji: "💬" };

    // Load feedbacks from localStorage
    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = () => {
        const stored = JSON.parse(localStorage.getItem("sw_feedback") || "[]");
        setAllFeedbacks(stored.reverse()); // newest first
    };

    const handleSubmit = () => {
        if (!rating || !feedback.trim()) return;
        const stored = JSON.parse(localStorage.getItem("sw_feedback") || "[]");
        stored.push({
            id: Date.now().toString(),
            rating,
            category,
            feedback,
            username,
            date: new Date().toISOString(),
            replies: [],
        });
        localStorage.setItem("sw_feedback", JSON.stringify(stored));
        setSubmitted(true);
        loadFeedbacks();
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setCategory("");
            setFeedback("");
        }, 2500);
    };

    const handleReply = (feedbackId) => {
        if (!replyText.trim()) return;
        const stored = JSON.parse(localStorage.getItem("sw_feedback") || "[]");
        const idx = stored.findIndex((f) => f.id === feedbackId);
        if (idx === -1) return;
        if (!stored[idx].replies) stored[idx].replies = [];
        stored[idx].replies.push({
            text: replyText,
            admin: username,
            date: new Date().toISOString(),
        });
        localStorage.setItem("sw_feedback", JSON.stringify(stored));
        setReplyText("");
        setReplyingTo(null);
        loadFeedbacks();
    };

    const handleDeleteFeedback = (feedbackId) => {
        const stored = JSON.parse(localStorage.getItem("sw_feedback") || "[]");
        const updated = stored.filter((f) => f.id !== feedbackId);
        localStorage.setItem("sw_feedback", JSON.stringify(updated));
        loadFeedbacks();
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " at " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const renderStars = (count) => (
        <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} fill={s <= count ? "#f59e0b" : "transparent"}
                    style={{ color: s <= count ? "#f59e0b" : COLORS.textMuted }} />
            ))}
        </div>
    );

    return (
        <div className="animate-slide-up" style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "8px" }}>💬 Feedback</h2>
            <p style={{ color: COLORS.textDim, marginBottom: "32px", fontSize: "14px" }}>
                Help us improve Swavik AI — your feedback matters! ✨
            </p>

            {/* Collapsible Feedback Form */}
            <button onClick={() => setShowForm(!showForm)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, background: COLORS.bgCard, cursor: "pointer", marginBottom: showForm ? "0" : "28px", borderBottomLeftRadius: showForm ? 0 : "16px", borderBottomRightRadius: showForm ? 0 : "16px", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bgCardHover}
                onMouseLeave={(e) => e.currentTarget.style.background = COLORS.bgCard}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: COLORS.textPrimary }}>✍️ Write New Feedback</span>
                {showForm ? <ChevronUp size={18} style={{ color: COLORS.textMuted }} /> : <ChevronDown size={18} style={{ color: COLORS.textMuted }} />}
            </button>

            {showForm && (
                <div style={{ background: COLORS.bgCard, borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px", border: `1px solid ${COLORS.border}`, borderTop: "none", padding: "24px", marginBottom: "28px" }}>
                    {submitted ? (
                        <div className="animate-slide-up" style={{ padding: "40px 20px", textAlign: "center" }}>
                            <CheckCircle2 size={36} style={{ color: COLORS.green, marginBottom: "12px" }} />
                            <h3 style={{ fontSize: "18px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "6px" }}>Thank you! 🎉</h3>
                            <p style={{ color: COLORS.textDim, fontSize: "13px" }}>Your feedback has been recorded.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {/* Rating */}
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textSecondary, marginBottom: "12px" }}>Rating ⭐</p>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", transition: "transform 0.2s", transform: (hoverRating || rating) >= star ? "scale(1.15)" : "scale(1)" }}>
                                            <Star size={28} fill={(hoverRating || rating) >= star ? "#f59e0b" : "transparent"}
                                                style={{ color: (hoverRating || rating) >= star ? "#f59e0b" : COLORS.textMuted, transition: "all 0.2s" }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textSecondary, marginBottom: "12px" }}>Category 🏷️</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {categories.map((cat) => (
                                        <button key={cat.id} onClick={() => setCategory(cat.id)}
                                            style={{ padding: "8px 14px", borderRadius: "10px", border: category === cat.id ? `2px solid ${COLORS.purple}` : `1px solid ${COLORS.border}`, background: category === cat.id ? COLORS.bgActive : "transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                                            onMouseEnter={(e) => { if (category !== cat.id) e.currentTarget.style.background = COLORS.bgCardHover; }}
                                            onMouseLeave={(e) => { if (category !== cat.id) e.currentTarget.style.background = "transparent"; }}>
                                            <span style={{ fontSize: "13px" }}>{cat.emoji}</span>
                                            <span style={{ fontSize: "11px", fontWeight: category === cat.id ? 700 : 500, color: category === cat.id ? COLORS.purpleLight : COLORS.textSecondary }}>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textSecondary, marginBottom: "12px" }}>Your Feedback ✍️</p>
                                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Share your thoughts, suggestions, or report issues..."
                                    rows={4}
                                    style={{ width: "100%", background: COLORS.bgDark, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "14px", color: COLORS.textPrimary, fontSize: "13px", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: "1.6", transition: "border-color 0.2s" }}
                                    onFocus={(e) => e.target.style.borderColor = COLORS.purple}
                                    onBlur={(e) => e.target.style.borderColor = COLORS.border} />
                            </div>

                            {/* Submit */}
                            <button onClick={handleSubmit} disabled={!rating || !feedback.trim()}
                                style={{ padding: "12px", borderRadius: "12px", border: "none", background: !rating || !feedback.trim() ? COLORS.bgCardHover : COLORS.gradientPrimary, color: "white", fontSize: "13px", fontWeight: 700, cursor: !rating || !feedback.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: !rating || !feedback.trim() ? "none" : `0 4px 16px ${COLORS.purpleGlow}`, transition: "all 0.3s", opacity: !rating || !feedback.trim() ? 0.5 : 1 }}>
                                <Send size={16} /> Submit Feedback
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* All Feedbacks Section */}
            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>📋 All Feedback ({allFeedbacks.length})</h3>
                </div>

                {allFeedbacks.length === 0 ? (
                    <div style={{ background: COLORS.bgCard, borderRadius: "20px", border: `1px solid ${COLORS.border}`, padding: "60px 40px", textAlign: "center" }}>
                        <p style={{ fontSize: "36px", marginBottom: "12px" }}>📝</p>
                        <p style={{ color: COLORS.textDim, fontSize: "14px" }}>No feedback yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {allFeedbacks.map((fb) => {
                            const catInfo = getCategoryInfo(fb.category);
                            return (
                                <div key={fb.id || fb.date} className="animate-slide-up"
                                    style={{ background: COLORS.bgCard, borderRadius: "18px", border: `1px solid ${COLORS.border}`, overflow: "hidden", transition: "all 0.2s" }}>
                                    {/* Feedback Header */}
                                    <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div style={{ display: "flex", gap: "14px", flex: 1 }}>
                                            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: COLORS.gradientCard, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                                                👤
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                                                    <span style={{ fontWeight: 700, fontSize: "14px", color: COLORS.textPrimary }}>{fb.username}</span>
                                                    {renderStars(fb.rating)}
                                                    <span style={{ fontSize: "10px", background: COLORS.bgActive, color: COLORS.purpleLight, padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>
                                                        {catInfo.emoji} {catInfo.label}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: "1.6", marginBottom: "8px" }}>{fb.feedback}</p>
                                                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.textMuted, fontSize: "10px" }}>
                                                    <Clock size={10} />
                                                    {formatDate(fb.date)}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                                            <button onClick={() => { setReplyingTo(replyingTo === fb.id ? null : fb.id); setReplyText(""); }}
                                                title="Reply"
                                                style={{ background: replyingTo === fb.id ? COLORS.bgActive : "transparent", border: replyingTo === fb.id ? `1px solid ${COLORS.border}` : "1px solid transparent", borderRadius: "8px", padding: "6px", cursor: "pointer", color: replyingTo === fb.id ? COLORS.purpleLight : COLORS.textMuted, display: "flex", transition: "all 0.2s" }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.purpleLight}
                                                onMouseLeave={(e) => { if (replyingTo !== fb.id) e.currentTarget.style.color = COLORS.textMuted; }}>
                                                <MessageSquareReply size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteFeedback(fb.id)}
                                                title="Delete"
                                                style={{ background: "transparent", border: "1px solid transparent", borderRadius: "8px", padding: "6px", cursor: "pointer", color: COLORS.textMuted, display: "flex", transition: "all 0.2s" }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.red}
                                                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Existing Replies */}
                                    {fb.replies && fb.replies.length > 0 && (
                                        <div style={{ borderTop: `1px solid ${COLORS.borderLight}`, background: COLORS.bgDark }}>
                                            {fb.replies.map((reply, ri) => (
                                                <div key={ri} style={{ padding: "14px 20px 14px 74px", borderBottom: ri < fb.replies.length - 1 ? `1px solid ${COLORS.borderLight}` : "none" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                                        <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: COLORS.gradientPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
                                                            🛡️
                                                        </div>
                                                        <span style={{ fontWeight: 700, fontSize: "12px", color: COLORS.purpleLight }}>{reply.admin}</span>
                                                        <span style={{ fontSize: "10px", background: "rgba(124,58,237,0.15)", color: COLORS.purpleLight, padding: "2px 8px", borderRadius: "6px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Admin</span>
                                                        <span style={{ fontSize: "10px", color: COLORS.textMuted, display: "flex", alignItems: "center", gap: "3px" }}>
                                                            <Clock size={9} /> {formatDate(reply.date)}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: "1.6", paddingLeft: "32px" }}>{reply.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Input */}
                                    {replyingTo === (fb.id || fb.date) && (
                                        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px 20px", background: COLORS.bgDark, display: "flex", gap: "10px", alignItems: "flex-end" }}>
                                            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: COLORS.gradientPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>
                                                🛡️
                                            </div>
                                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write your admin reply..."
                                                rows={2}
                                                style={{ flex: 1, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "10px 14px", color: COLORS.textPrimary, fontSize: "13px", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: "1.5", transition: "border-color 0.2s" }}
                                                onFocus={(e) => e.target.style.borderColor = COLORS.purple}
                                                onBlur={(e) => e.target.style.borderColor = COLORS.border} />
                                            <button onClick={() => handleReply(fb.id || fb.date)} disabled={!replyText.trim()}
                                                style={{ background: !replyText.trim() ? COLORS.bgCardHover : COLORS.gradientPrimary, border: "none", borderRadius: "10px", padding: "10px 16px", cursor: !replyText.trim() ? "not-allowed" : "pointer", color: "white", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, boxShadow: !replyText.trim() ? "none" : `0 4px 12px ${COLORS.purpleGlow}`, transition: "all 0.2s", opacity: !replyText.trim() ? 0.5 : 1, flexShrink: 0 }}>
                                                <Send size={14} /> Reply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
