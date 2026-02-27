import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { COLORS } from "../theme";

export function CopyButton({ text, label = false }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} title={copied ? "Copied!" : "Copy"}
      style={{
        background: copied ? "rgba(16,185,129,0.15)" : "transparent",
        border: copied ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
        borderRadius: "8px", padding: label ? "5px 10px" : "5px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "4px",
        color: copied ? COLORS.green : COLORS.textDim, fontSize: "11px", fontWeight: 600, transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = COLORS.purpleSoft; e.currentTarget.style.color = COLORS.purpleLight; e.currentTarget.style.border = `1px solid ${COLORS.border}`; }}}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textDim; e.currentTarget.style.border = "1px solid transparent"; }}}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label && (copied ? "Copied!" : "Copy")}
    </button>
  );
}

export function MarkdownContent({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          if (!inline && match) {
            return (
              <div style={{ position: "relative", margin: "12px 0", borderRadius: "12px", overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: COLORS.bgDark, borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: COLORS.purpleLight, textTransform: "uppercase", letterSpacing: "1px" }}>{match[1]}</span>
                  <CopyButton text={codeString} label={true} />
                </div>
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div"
                  customStyle={{ margin: 0, padding: "16px", fontSize: "13px", background: COLORS.bgDeep }} {...props}>
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }
          if (!inline) {
            return (
              <div style={{ position: "relative", margin: "12px 0", borderRadius: "12px", overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 12px", background: COLORS.bgDark, borderBottom: `1px solid ${COLORS.border}` }}>
                  <CopyButton text={codeString} label={true} />
                </div>
                <pre style={{ margin: 0, padding: "16px", fontSize: "13px", background: COLORS.bgDeep, overflowX: "auto", color: COLORS.textPrimary }}>
                  <code {...props}>{children}</code>
                </pre>
              </div>
            );
          }
          return <code style={{ background: COLORS.bgActive, padding: "2px 6px", borderRadius: "4px", fontSize: "13px", color: COLORS.purpleLight, fontWeight: 600 }} {...props}>{children}</code>;
        },
        table({ children }) { return <div style={{ overflowX: "auto", margin: "12px 0", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>{children}</table></div>; },
        th({ children }) { return <th style={{ padding: "10px 14px", background: COLORS.bgCard, borderBottom: `2px solid ${COLORS.border}`, textAlign: "left", fontWeight: 700, color: COLORS.textPrimary, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{children}</th>; },
        td({ children }) { return <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.borderLight}`, color: COLORS.textSecondary }}>{children}</td>; },
        ul({ children }) { return <ul style={{ paddingLeft: "20px", margin: "8px 0", lineHeight: "1.8" }}>{children}</ul>; },
        ol({ children }) { return <ol style={{ paddingLeft: "20px", margin: "8px 0", lineHeight: "1.8" }}>{children}</ol>; },
        h1({ children }) { return <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "16px 0 8px", color: COLORS.textPrimary }}>{children}</h1>; },
        h2({ children }) { return <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "14px 0 6px", color: COLORS.textPrimary }}>{children}</h2>; },
        h3({ children }) { return <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "12px 0 4px", color: COLORS.textPrimary }}>{children}</h3>; },
        p({ children }) { return <p style={{ margin: "6px 0", lineHeight: "1.7", color: COLORS.textSecondary }}>{children}</p>; },
        strong({ children }) { return <strong style={{ fontWeight: 700, color: COLORS.textPrimary }}>{children}</strong>; },
        blockquote({ children }) { return <blockquote style={{ borderLeft: `4px solid ${COLORS.purple}`, paddingLeft: "16px", margin: "12px 0", color: COLORS.textSecondary, fontStyle: "italic", background: COLORS.purpleSoft, padding: "12px 16px", borderRadius: "0 8px 8px 0" }}>{children}</blockquote>; },
        a({ children, href }) { return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.purpleLight, textDecoration: "underline", fontWeight: 600 }}>{children}</a>; },
      }}>
      {content}
    </ReactMarkdown>
  );
}