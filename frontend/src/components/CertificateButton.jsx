import { useState } from "react";
import { toast } from "react-toastify";

function CertificateButton({ courseId, courseName }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/certificate/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Certificate generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${courseName?.replace(/\s+/g, "-") || "course"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("🎓 Certificate downloaded!");
    } catch (err) {
      toast.error(err.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-success btn-sm"
      onClick={download}
      disabled={loading}
      title="Download PDF Certificate"
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span className="spinner spinner-sm" style={{ borderTopColor: "white", width: 14, height: 14 }} />
          Generating...
        </span>
      ) : "🏆 Certificate"}
    </button>
  );
}

export default CertificateButton;
