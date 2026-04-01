// import { useState } from "react";

// function App() {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleUpload = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     setResult(null);
//     setError(null);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/upload", {
//       method: "POST",
//       body: formData,
//       });

//       if (!response.ok) {
//       throw new Error("Server error");
//       }

//       const data = await response.json();

//       console.log(data);

//       setResult(data);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setError("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
//       <h1>Athena</h1>
//       <p>AI-Powered Finance & Risk Analytics Platform</p>

//       <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
//         <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
//         <button 
//           onClick={handleUpload} 
//           disabled={loading}
//           style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
//         >
//           {loading ? "Processing..." : "Analyze Document"}
//         </button>
//       </div>

//       {loading && <p>Analyzing document...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {result && result.summary && result.sentinel && (
//         <div style={{ marginTop: "2rem" }}>
//           <h2>Analysis Result</h2>

//           <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
//             <h3>Document</h3>
//             <p><strong>Filename:</strong> {result.filename}</p>
//             <p><strong>Completeness Score:</strong> {result.summary.completeness_score}%</p>
//             <p><strong>Status:</strong> {result.summary.status}</p>
//           </div>

//           <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
//             <h3>Found Sections</h3>
//             <ul>
//               {result.summary?.found_sections?.length > 0 ? (
//                 result.summary.found_sections.map((section, index) => (
//                   <li key={index}>{section}</li>
//                 ))
//               ) : (
//                 <p>No sections found</p>
//               )}
//             </ul>
//           </div>

//           <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
//             <h3>Missing Sections</h3>
//             <ul>
//               {result.summary?.missing_sections?.map((section, index) => (
//                 <li key={index}>{section}</li>
//               ))}
//             </ul>
//           </div>

//           <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
//             <h3>Sentinel Alerts</h3>
//             <ul>
//               {result.sentinel?.alerts?.map((alert, index) => (
//                 <li key={index}>{alert}</li>
//               ))}
//             </ul>
//           </div>

//           <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
//             <h3>AI Analysis</h3>
//             <pre style={{ whiteSpace: "pre-wrap" }}>{result.ai_analysis || "No analysis available"}</pre>
//           </div>

//           <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
//             <h3>Text Preview</h3>
//             <pre style={{ whiteSpace: "pre-wrap" }}>{result.text_preview}</pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const alertCount = result?.sentinel?.alerts?.length || 0;

  const getStatusClass = (status) => {
    if (!status) return "";
    if (status.toLowerCase().includes("low")) return "status low";
    if (status.toLowerCase().includes("review")) return "status review";
    if (status.toLowerCase().includes("high")) return "status high";
    return "status";
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Athena Platform</p>
          <h1>Athena</h1>
          <p className="hero-subtitle">
            AI-Powered Finance &amp; Risk Analytics Platform
          </p>
          <p className="hero-description">
            Ingest, validate, and monitor model governance documents across
            banking workflows.
          </p>
        </div>

        <div className="hero-badges">
          <span className="badge live">Live Module: Risk Rating Analysis</span>
          <span className="badge muted">Planned Modules: Validation, Fraud, Compliance</span>
        </div>
      </header>

      <main className="dashboard">
        <aside className="sidebar">
          <div className="card">
            <h2>Document Intake</h2>
            <p className="muted-text">
              Upload a banking risk document and run Athena’s analysis pipeline.
            </p>

            <label className="upload-box">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <span>{file ? file.name : "Choose PDF document"}</span>
            </label>

            <button className="analyze-btn" onClick={handleUpload} disabled={!file || loading}>
              {loading ? "Analyzing..." : "Analyze Document"}
            </button>
          </div>

          <div className="card">
            <h2>Supported Workflows</h2>
            <div className="module-list">
              <div className="module-card active">
                <div className="module-top">
                  <h3>Risk Rating Models</h3>
                  <span className="module-tag active-tag">Active</span>
                </div>
                <p>
                  Analyze financial, security, management, environmental, and
                  risk rating components.
                </p>
              </div>

              <div className="module-card">
                <div className="module-top">
                  <h3>Model Validation Reports</h3>
                  <span className="module-tag">Coming Soon</span>
                </div>
                <p>
                  Review methodology, testing results, assumptions, and
                  limitations.
                </p>
              </div>

              <div className="module-card">
                <div className="module-top">
                  <h3>Fraud Detection Documentation</h3>
                  <span className="module-tag">Coming Soon</span>
                </div>
                <p>
                  Assess data sources, model monitoring, controls, and
                  performance documentation.
                </p>
              </div>

              <div className="module-card">
                <div className="module-top">
                  <h3>Regulatory Compliance Files</h3>
                  <span className="module-tag">Coming Soon</span>
                </div>
                <p>
                  Track policy statements, control evidence, audit logs, and
                  compliance support files.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Athena Expansion Roadmap</h2>
            <div className="roadmap-grid">
              <div className="roadmap-item">
                <h4>Validation Review Engine</h4>
                <p>AI-assisted validation of model methodology and testing evidence.</p>
              </div>
              <div className="roadmap-item">
                <h4>Fraud Governance Review</h4>
                <p>Documentation checks for fraud risk models and monitoring plans.</p>
              </div>
              <div className="roadmap-item">
                <h4>Compliance Evidence Scanner</h4>
                <p>Automated review of policy, audit, and control documentation.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="main-panel">
          <div className="summary-row">
            <div className="summary-card">
              <p className="summary-label">Completeness Score</p>
              <h3>
                {result ? `${result.summary.completeness_score}%` : "--"}
              </h3>
            </div>

            <div className="summary-card">
              <p className="summary-label">Risk Status</p>
              <h3 className={getStatusClass(result?.summary?.status)}>
                {result ? result.summary.status : "--"}
              </h3>
            </div>

            <div className="summary-card">
              <p className="summary-label">Sentinel Alerts</p>
              <h3>{result ? alertCount : "--"}</h3>
            </div>
          </div>

          {!result && !loading && (
            <div className="card empty-state">
              <h2>Document Risk Review</h2>
              <p>
                Upload a PDF on the left to generate Auto-Validator results,
                Sentinel alerts, and AI insights.
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <h2>Analysis Overview</h2>
                <div className="overview-grid">
                  <div>
                    <p className="field-label">Filename</p>
                    <p>{result.filename}</p>
                  </div>
                  <div>
                    <p className="field-label">Status</p>
                    <p className={getStatusClass(result.summary.status)}>
                      {result.summary.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="results-grid">
                <div className="card">
                  <h2>Auto-Validator Results</h2>

                  <div className="section-block">
                    <p className="field-label">Found Sections</p>
                    <ul className="pill-list success">
                      {result.summary.found_sections.map((section, index) => (
                        <li key={index}>{section}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="section-block">
                    <p className="field-label">Missing Sections</p>
                    <ul className="pill-list danger">
                      {result.summary.missing_sections.length > 0 ? (
                        result.summary.missing_sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))
                      ) : (
                        <li>None</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="card">
                  <h2>Sentinel Alerts</h2>
                  {result.sentinel.alerts.length > 0 ? (
                    <ul className="alert-list">
                      {result.sentinel.alerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-text">No alerts triggered.</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h2>AI Insights</h2>
                <pre className="pre-box">{result.ai_analysis}</pre>
              </div>

              <div className="card">
                <h2>Document Preview</h2>
                <pre className="pre-box">{result.text_preview}</pre>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;