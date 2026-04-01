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
        <div className="hero-content">
        <div>
          {/*<p className="eyebrow">Athena Platform</p> */} 
          <h2 id="mainTitle">ATHENA</h2>
          <p className="hero-subtitle">
            AI-Powered Finance &amp; Risk Analytics Platform
          </p>
          {/*<p className="hero-description">
            Ingest, validate, and monitor model governance documents across
            banking workflows.
          </p>*/}
        </div>

        <div className="hero-badges">
          <span className="badge live">Live Module: Risk Rating Analysis</span>
          <span className="badge muted">Planned Modules: Validation, Fraud, Compliance</span>
        </div>
        </div>
      </header>

      <main className="dashboard">
        <aside className="sidebar">
          <div className="card">
            <h2>Upload Document</h2>
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