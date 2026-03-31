import { useState } from "react";

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

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Athena</h1>
      <p>AI-Powered Finance & Risk Analytics Platform</p>

      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
          Analyze Document
        </button>
      </div>

      {loading && <p>Analyzing document...</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Analysis Result</h2>

          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3>Document</h3>
            <p><strong>Filename:</strong> {result.filename}</p>
            <p><strong>Completeness Score:</strong> {result.summary.completeness_score}%</p>
            <p><strong>Status:</strong> {result.summary.status}</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3>Found Sections</h3>
            <ul>
              {result.summary.found_sections.map((section, index) => (
                <li key={index}>{section}</li>
              ))}
            </ul>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3>Missing Sections</h3>
            <ul>
              {result.summary.missing_sections.map((section, index) => (
                <li key={index}>{section}</li>
              ))}
            </ul>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3>Sentinel Alerts</h3>
            <ul>
              {result.sentinel.alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3>AI Analysis</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{result.ai_analysis}</pre>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>Text Preview</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{result.text_preview}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;