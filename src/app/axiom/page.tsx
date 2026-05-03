// AXIOM 页面 - 重定向到部署实例
export default function AxiomPage() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "20px",
      padding: "40px",
      textAlign: "center",
    }}>
      <h1 style={{fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em"}}>AXIOM</h1>
      <p style={{fontSize: "16px", color: "var(--text-muted, #8a8f98)", maxWidth: "500px"}}>
        市场推演引擎 · 孪生社会仿真平台
      </p>
      <a
        href={"https://github.com/jaylong16113-design/axiom-sim300w"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "12px 24px",
          background: "var(--accent, #5e6ad2)",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        查看源码与部署文档
      </a>
      <p style={{fontSize: "13px", color: "var(--text-muted, #8a8f98)"}}>
        私有部署: 需要访问令牌才能使用完整功能
      </p>
    </div>
  );
}
