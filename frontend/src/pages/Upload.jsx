import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

function Upload() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    api.get("/courses/my-courses")
      .then((res) => setCourses(res.data))
      .catch(() => toast.error("Failed to load courses"));
  }, []);

  const handleFile = (f) => {
    if (!f) return;
    const maxSize = 50 * 1024 * 1024;
    if (f.size > maxSize) {
      toast.error("File too large. Max 50MB allowed.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error("Please select a file"); return; }
    if (!selectedCourse) { toast.error("Please select a course"); return; }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", selectedCourse);

    setUploading(true);
    try {
      const res = await api.post("/upload/material", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Material uploaded successfully! 🎉");
      setUploadHistory((prev) => [
        { name: res.data.originalName, course: courses.find((c) => c._id === selectedCourse)?.title, time: new Date() },
        ...prev
      ]);
      setFile(null);
      setSelectedCourse("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Layout>
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">📤 Upload Materials</h1>
          <p className="page-subtitle">Upload course materials for your students</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem" }}>
          {/* Upload Form */}
          <div className="card card-body">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Upload New Material</h3>

            <div className="form-group">
              <label className="form-label">Select Course *</label>
              <select
                className="form-control form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Choose a course...</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            {courses.length === 0 && (
              <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
                ⚠️ Create a course first before uploading materials
              </div>
            )}

            {/* Drop Zone */}
            <div
              className={`file-drop-zone ${dragOver ? "drag-over" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                    {file.name.endsWith(".pdf") ? "📄" : file.name.match(/\.(mp4|mov|avi)$/) ? "🎥" : "📁"}
                  </div>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{file.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{formatSize(file.size)}</p>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: "0.75rem" }}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.6 }}>📂</div>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    Drop files here or click to browse
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    PDF, DOC, PPT, MP4, Images • Max 50MB
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png,.gif"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1.25rem" }}
              onClick={handleUpload}
              disabled={uploading || !file || !selectedCourse}
            >
              {uploading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="spinner spinner-sm" style={{ borderTopColor: "white" }} />
                  Uploading...
                </span>
              ) : "📤 Upload Material"}
            </button>
          </div>

          {/* Info + History */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card card-body">
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem" }}>📋 Supported Formats</h3>
              {[
                { icon: "📄", label: "Documents", types: "PDF, DOC, DOCX" },
                { icon: "📊", label: "Presentations", types: "PPT, PPTX" },
                { icon: "🎥", label: "Videos", types: "MP4, MOV, AVI" },
                { icon: "🖼", label: "Images", types: "JPG, PNG, GIF" }
              ].map((f) => (
                <div key={f.label} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem" }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.825rem", fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{f.types}</div>
                  </div>
                </div>
              ))}
            </div>

            {uploadHistory.length > 0 && (
              <div className="card card-body">
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem" }}>✅ Recent Uploads</h3>
                {uploadHistory.map((h, i) => (
                  <div key={i} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: i < uploadHistory.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      📄 {h.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {h.course} • {h.time.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Upload;
