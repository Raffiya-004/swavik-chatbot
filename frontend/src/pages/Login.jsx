import React, { useState } from "react";
import { Shield, KeyRound, UserPlus, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { COLORS } from "../theme";

export default function LoginPage({ onLogin }) {
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
        if (users[username]) {
          setError("❌ Username already taken. Try a different one or login.");
          setLoading(false);
          return;
        }
        users[username] = password;
        localStorage.setItem("sw_users", JSON.stringify(users));
        setSuccess("✅ Account created! Switching to login...");
        setLoading(false);
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess("");
        }, 1500);
      } else {
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
      <div style={{ position: "fixed", top: "-50%", left: "-20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-30%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-fade-in" style={{
        background: COLORS.bgCard, padding: "48px", borderRadius: "28px", width: "100%", maxWidth: "440px",
        textAlign: "center", boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 100px ${COLORS.purpleGlow}`,
        border: `1px solid ${COLORS.border}`, position: "relative", zIndex: 1,
      }}>
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

        {error && (
          <div style={{
            marginTop: "12px", padding: "10px 14px", background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: COLORS.red,
            fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: "12px", padding: "10px 14px", background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", color: COLORS.green,
            fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
          }}>
            <CheckCircle2 size={14} /> {success}
          </div>
        )}

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