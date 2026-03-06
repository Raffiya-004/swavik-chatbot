import React, { useState, useEffect } from "react";
import { Shield, KeyRound, UserPlus, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, X, Mail } from "lucide-react";
import { COLORS } from "../theme";
import { supabase, registerUser, loginUser } from "../supabaseClient";

const floatingKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-12px) rotate(2deg); }
  75% { transform: translateY(6px) rotate(-1deg); }
}
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
  70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes bubble-float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-15px) scale(1.05); }
}
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes typing-dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
`;

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleError, setGoogleError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async () => {
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

    // Hardcoded admin credentials
    const ADMIN_USERNAME = "TechSakhi";
    const ADMIN_PASSWORD = "12345";

    try {
      if (isSignUp) {
        if (username === ADMIN_USERNAME) {
          setError("This username is reserved. Please choose a different one.");
          setLoading(false);
          return;
        }

        if (supabase) {
          // Use Supabase
          const result = await registerUser(username, password);
          if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
          }
        } else {
          // Fallback to localStorage
          const users = JSON.parse(localStorage.getItem("sw_users") || "{}");
          if (users[username]) {
            setError("Username already taken. Try a different one or login.");
            setLoading(false);
            return;
          }
          users[username] = { password, role: "user" };
          localStorage.setItem("sw_users", JSON.stringify(users));
        }
        setSuccess("Account created! Switching to login...");
        setLoading(false);
        setTimeout(() => { setIsSignUp(false); setSuccess(""); }, 1500);
      } else {
        // Admin login check
        if (username === ADMIN_USERNAME) {
          if (password !== ADMIN_PASSWORD) {
            setError("Incorrect password. Please try again.");
            setLoading(false);
            return;
          }
          onLogin(username, "admin");
          return;
        }

        if (supabase) {
          // Use Supabase
          const result = await loginUser(username, password);
          if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
          }
          onLogin(result.data.username, result.data.role);
        } else {
          // Fallback to localStorage
          const users = JSON.parse(localStorage.getItem("sw_users") || "{}");
          if (!users[username]) {
            setError("Account not found. Please sign up first.");
            setLoading(false);
            return;
          }
          const storedPassword = typeof users[username] === 'object' ? users[username].password : users[username];
          if (storedPassword !== password) {
            setError("Incorrect password. Please try again.");
            setLoading(false);
            return;
          }
          onLogin(username, "user");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setShowGoogleModal(true);
    setGoogleEmail("");
    setGoogleError("");
  };

  const handleGoogleEmailSubmit = () => {
    const email = googleEmail.trim();
    if (!email) {
      setGoogleError("Please enter your email address");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setGoogleError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setGoogleError("");
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("sw_users") || "{}");
      if (!users[email]) {
        users[email] = { password: "google_oauth", role: "user" };
        localStorage.setItem("sw_users", JSON.stringify(users));
      }
      setShowGoogleModal(false);
      onLogin(email, "user");
    }, 1000);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <style>{floatingKeyframes}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0a2e 0%, #1a1045 30%, #0d0d2b 60%, #0a0a1a 100%)",
        backgroundSize: "200% 200%",
        animation: "gradient-shift 12s ease infinite",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Background particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "fixed",
            width: `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(99,102,241,${0.04 + i * 0.02}) 0%, transparent 70%)`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `float ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Google Sign-In Modal */}
        {showGoogleModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "20px",
          }} onClick={() => { setShowGoogleModal(false); setLoading(false); }}>
            <div style={{
              background: "#161625", borderRadius: "24px", padding: "36px",
              width: "100%", maxWidth: "420px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
              border: `1px solid ${COLORS.border}`,
              animation: "modal-in 0.3s ease-out",
            }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: COLORS.textPrimary, marginBottom: "2px" }}>Sign in with Google</h3>
                    <p style={{ fontSize: "12px", color: COLORS.textDim }}>to continue to Swavik AI</p>
                  </div>
                </div>
                <button onClick={() => { setShowGoogleModal(false); setLoading(false); }}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.textMuted, padding: "4px", display: "flex" }}>
                  <X size={20} />
                </button>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: COLORS.textSecondary, marginBottom: "8px", display: "block" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: COLORS.textMuted }} />
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGoogleEmailSubmit()}
                    placeholder="yourname@gmail.com"
                    autoFocus
                    style={{
                      width: "100%", background: COLORS.bgDark, border: `2px solid ${COLORS.border}`,
                      padding: "13px 16px 13px 40px", borderRadius: "12px", color: COLORS.textPrimary,
                      outline: "none", fontSize: "14px", transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = COLORS.purple)}
                    onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                  />
                </div>
              </div>

              {/* Saved Accounts (if any) */}
              {(() => {
                const users = JSON.parse(localStorage.getItem("sw_users") || "{}");
                const googleAccounts = Object.keys(users).filter(k =>
                  k.includes("@") && users[k].password === "google_oauth"
                );
                if (googleAccounts.length === 0) return null;
                return (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: COLORS.textDim, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Your accounts
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {googleAccounts.map((email, i) => (
                        <button key={i} onClick={() => { setGoogleEmail(email); }}
                          style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "10px 14px", borderRadius: "10px",
                            background: googleEmail === email ? COLORS.bgActive : "transparent",
                            border: googleEmail === email ? `1px solid ${COLORS.borderActive}` : `1px solid ${COLORS.border}`,
                            cursor: "pointer", transition: "all 0.2s", width: "100%", textAlign: "left",
                          }}
                          onMouseEnter={(e) => { if (googleEmail !== email) e.currentTarget.style.background = COLORS.bgActive; }}
                          onMouseLeave={(e) => { if (googleEmail !== email) e.currentTarget.style.background = "transparent"; }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: COLORS.gradientPrimary,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "13px", fontWeight: 700, color: "white",
                          }}>
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary }}>{email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Google Error */}
              {googleError && (
                <div style={{
                  marginBottom: "14px", padding: "10px 14px", background: "rgba(198,40,40,0.08)",
                  border: "1px solid rgba(198,40,40,0.25)", borderRadius: "10px", color: COLORS.red,
                  fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <AlertCircle size={14} /> {googleError}
                </div>
              )}

              {/* Continue Button */}
              <button onClick={handleGoogleEmailSubmit} disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: "12px",
                  background: loading ? COLORS.bgCardHover : COLORS.gradientPrimary,
                  border: "none", color: "white", fontSize: "14px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: loading ? "none" : `0 6px 20px ${COLORS.purpleGlow}`,
                  transition: "all 0.3s",
                }}>
                {loading ? (
                  <><Loader2 size={16} className="animate-pulse-slow" /> Signing in...</>
                ) : (
                  "Continue"
                )}
              </button>

              <p style={{ marginTop: "16px", fontSize: "10px", color: COLORS.textMuted, textAlign: "center", lineHeight: "1.5" }}>
                By continuing, you agree to Swavik AI's Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        )}

        {/* Main container - split layout */}
        <div style={{
          display: "flex",
          width: "100%",
          maxWidth: "960px",
          minHeight: "580px",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 120px rgba(99,102,241,0.15)`,
          border: `1px solid rgba(99,102,241,0.2)`,
          position: "relative",
          zIndex: 1,
        }}>
          {/* LEFT PANEL - Robot mascot */}
          <div style={{
            flex: "0 0 42%",
            background: "linear-gradient(180deg, #1e1060 0%, #2d1b7a 40%, #1a1050 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "40px 30px",
            overflow: "hidden",
            animation: mounted ? "slide-in-left 0.8s ease-out" : "none",
          }}>
            {/* Decorative circles */}
            <div style={{
              position: "absolute", top: "-60px", left: "-60px", width: "200px", height: "200px",
              borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(30px)",
            }} />
            <div style={{
              position: "absolute", bottom: "-40px", right: "-40px", width: "160px", height: "160px",
              borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(25px)",
            }} />

            {/* Floating chat bubble */}
            <div style={{
              position: "absolute", top: "60px", left: "40px",
              width: "70px", height: "50px", borderRadius: "16px 16px 16px 4px",
              background: "linear-gradient(135deg, #5eead4, #2dd4bf)",
              boxShadow: "0 8px 30px rgba(94,234,212,0.3)",
              animation: "bubble-float 4s ease-in-out infinite",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "3px",
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: "6px", height: "6px", borderRadius: "50%", background: "white",
                  animation: `typing-dot 1.4s ease-in-out ${j * 0.2}s infinite`,
                }} />
              ))}
            </div>

            {/* Second floating bubble */}
            <div style={{
              position: "absolute", top: "90px", right: "30px",
              width: "50px", height: "35px", borderRadius: "12px 12px 4px 12px",
              background: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
              boxShadow: "0 6px 20px rgba(167,139,250,0.3)",
              animation: "bubble-float 5s ease-in-out 1s infinite",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "16px" }}>💡</span>
            </div>

            {/* Robot Image */}
            <div style={{
              animation: "float 6s ease-in-out infinite",
              marginBottom: "30px",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
            }}>
              <img
                src="/robot_mascot.png"
                alt="Swavik AI Assistant"
                style={{
                  width: "260px",
                  height: "260px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Welcome text below robot */}
            <h3 style={{
              color: "white", fontWeight: 800, fontSize: "20px",
              textAlign: "center", marginBottom: "8px", letterSpacing: "0.5px",
            }}>
              Swavik AI Portal
            </h3>
            <p style={{
              color: "rgba(255,255,255,0.55)", fontSize: "13px",
              textAlign: "center", lineHeight: "1.6", maxWidth: "240px",
            }}>
              Your intelligent enterprise assistant powered by advanced AI
            </p>

            {/* Status indicators */}
            <div style={{
              display: "flex", gap: "16px", marginTop: "24px",
            }}>
              {[
                { label: "Uptime", value: "99.9%" },
                { label: "Response", value: "<1s" },
                { label: "Accuracy", value: "97%" },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: "center", padding: "8px 12px",
                  background: "rgba(255,255,255,0.06)", borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <p style={{ color: "#a78bfa", fontWeight: 800, fontSize: "16px" }}>{s.value}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL - Login form */}
          <div style={{
            flex: 1,
            background: COLORS.bgCard,
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            animation: mounted ? "slide-in-right 0.8s ease-out" : "none",
          }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "44px", height: "44px", background: COLORS.gradientPrimary, borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse-ring 2.5s ease-out infinite",
              }}>
                <Shield style={{ color: "white" }} size={22} />
              </div>
              <span style={{
                background: COLORS.gradientGlow, WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", fontWeight: 900, fontSize: "22px", letterSpacing: "0.5px",
              }}>
                SWAVIK AI
              </span>
            </div>

            <p style={{ color: COLORS.textDim, marginBottom: "28px", fontSize: "14px" }}>
              {isSignUp ? "Create your employee account" : "Secure Employee Portal"}
            </p>

            {/* Login / SignUp Toggle */}
            <div style={{
              display: "flex", gap: "4px", background: COLORS.bgDark, borderRadius: "14px",
              padding: "4px", marginBottom: "22px", border: `1px solid ${COLORS.border}`,
            }}>
              <button onClick={() => { if (isSignUp) toggleMode(); }}
                style={{
                  flex: 1, padding: "11px", borderRadius: "11px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
                  background: !isSignUp ? COLORS.gradientPrimary : "transparent",
                  color: !isSignUp ? "white" : COLORS.textDim,
                  boxShadow: !isSignUp ? `0 4px 16px ${COLORS.purpleGlow}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}>
                <KeyRound size={14} /> Sign In
              </button>
              <button onClick={() => { if (!isSignUp) toggleMode(); }}
                style={{
                  flex: 1, padding: "11px", borderRadius: "11px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
                  background: isSignUp ? COLORS.gradientPrimary : "transparent",
                  color: isSignUp ? "white" : COLORS.textDim,
                  boxShadow: isSignUp ? `0 4px 16px ${COLORS.purpleGlow}` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}>
                <UserPlus size={14} /> Create Account
              </button>
            </div>

            {/* Form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: COLORS.textSecondary, marginBottom: "6px", display: "block" }}>Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your username"
                  style={{
                    width: "100%", background: COLORS.bgDark, border: `2px solid ${COLORS.border}`,
                    padding: "13px 16px", borderRadius: "12px", color: COLORS.textPrimary,
                    outline: "none", fontSize: "14px", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.purple)}
                  onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: COLORS.textSecondary }}>Password</label>
                  {!isSignUp && (
                    <span style={{ fontSize: "11px", color: COLORS.purpleLight, cursor: "pointer", fontWeight: 600 }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}>
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={isSignUp ? "Create a password (min 4 chars)" : "Enter your password"}
                    style={{
                      width: "100%", background: COLORS.bgDark, border: `2px solid ${COLORS.border}`,
                      padding: "13px 42px 13px 16px", borderRadius: "12px", color: COLORS.textPrimary,
                      outline: "none", fontSize: "14px", transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = COLORS.violet)}
                    onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "transparent", border: "none", cursor: "pointer", color: COLORS.textDim,
                      display: "flex", alignItems: "center", justifyContent: "center", padding: "4px",
                    }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            {!isSignUp && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                <div onClick={() => setRememberMe(!rememberMe)} style={{
                  width: "18px", height: "18px", borderRadius: "5px",
                  border: `2px solid ${rememberMe ? COLORS.purple : COLORS.border}`,
                  background: rememberMe ? COLORS.gradientPrimary : "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {rememberMe && <span style={{ color: "white", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: "12px", color: COLORS.textDim, fontWeight: 500 }}>Remember Me</span>
              </div>
            )}

            {/* Error / Success messages */}
            {error && (
              <div style={{
                marginTop: "12px", padding: "10px 14px", background: "rgba(198,40,40,0.08)",
                border: "1px solid rgba(198,40,40,0.25)", borderRadius: "10px", color: COLORS.red,
                fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div style={{
                marginTop: "12px", padding: "10px 14px", background: "rgba(46,125,50,0.08)",
                border: "1px solid rgba(46,125,50,0.25)", borderRadius: "10px", color: COLORS.green,
                fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
              }}>
                <CheckCircle2 size={14} /> {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? COLORS.bgCardHover : "linear-gradient(135deg, #6366f1, #7c3aed, #8b5cf6)",
                color: "white", fontWeight: 700, padding: "14px", borderRadius: "14px",
                border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px",
                marginTop: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", boxShadow: loading ? "none" : `0 10px 30px ${COLORS.purpleGlow}`,
                transition: "all 0.3s", letterSpacing: "0.5px",
              }}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-pulse-slow" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
              <span style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
            </div>

            {/* Google Sign-In */}
            <button onClick={handleGoogleSignIn} disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                padding: "13px", borderRadius: "12px", background: COLORS.bgDark,
                border: `1px solid ${COLORS.border}`, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", color: COLORS.textPrimary, fontSize: "13px", fontWeight: 600,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.bgCardHover; e.currentTarget.style.borderColor = COLORS.borderActive; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.bgDark; e.currentTarget.style.borderColor = COLORS.border; }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            {/* Toggle link */}
            <p style={{ marginTop: "20px", fontSize: "12px", color: COLORS.textDim, textAlign: "center" }}>
              {isSignUp ? "Already have an account? " : "New on our Platform? "}
              <span onClick={toggleMode}
                style={{
                  color: COLORS.purpleLight, cursor: "pointer", fontWeight: 700,
                  textDecoration: "underline", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.purpleLight)}>
                {isSignUp ? "Sign in here" : "Create an Account"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}