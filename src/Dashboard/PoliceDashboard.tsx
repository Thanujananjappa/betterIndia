// src/Dashboard/PoliceDashboard.tsx
import React, { useMemo, useState } from "react";
import { Shield, Camera, AlertTriangle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const PoliceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Read role & verification status from localStorage
  const role = localStorage.getItem("role");
  const verificationStatus = localStorage.getItem("verificationStatus"); // "pending" | "verified" | "rejected"
  const isVerifiedPolice = role === "police" && verificationStatus === "verified";

  // ✅ Badge renderer
  const statusBadge = useMemo(() => {
    if (role !== "police") return null;
    const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    switch (verificationStatus) {
      case "verified":
        return <span className={`${base} bg-green-100 text-green-800`}>Verified</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "rejected":
      default:
        return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
    }
  }, [role, verificationStatus]);

  // ✅ Bulk upload handler
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "zip") {
      alert("Only ZIP files containing CSV + images are allowed.");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file); // 🔑 field name must match backend multer

      const token = localStorage.getItem("token");

      // ✅ fixed endpoint: no double /api
      const { data } = await api.post("/police/upload-bulk", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`✅ Bulk upload completed.\nRecords uploaded: ${data.count}`);
      setFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Gate unverified police accounts
  if (role === "police" && verificationStatus !== "verified") {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Police Dashboard</h1>
        <div className="p-4 border rounded-xl bg-yellow-50">
          <p className="font-semibold">Your account is not verified yet.</p>
          <p className="text-sm text-gray-700">
            Status: <b>{verificationStatus}</b>. You’ll get access once an admin verifies your identity.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-gray-800 text-white rounded"
        >
          ← Back to Main Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Police Dashboard</h1>
        {statusBadge}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-xl shadow">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="font-semibold mt-2">Case Reports</h2>
          <p className="text-gray-600">Review and investigate missing cases.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <Camera className="w-6 h-6 text-green-600" />
          <h2 className="font-semibold mt-2">CCTV Monitoring</h2>
          <p className="text-gray-600">Access camera feeds for tracking.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="font-semibold mt-2">Urgent Alerts</h2>
          <p className="text-gray-600">Handle high-priority missing person cases.</p>
        </div>
      </div>

      {/* Bulk Upload Section */}
      {isVerifiedPolice && (
        <div className="p-4 border rounded-xl shadow mt-6">
          <div className="flex items-center gap-2">
            <Upload className="w-6 h-6 text-purple-600" />
            <h2 className="font-semibold mt-2">Bulk Upload Missing Persons Data (ZIP)</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Upload a ZIP file containing a CSV + corresponding images. The CSV must have columns:{" "}
            <code>
              name, age, gender, lastSeen, firNumber, location, contactNumber, photoFilename
            </code>
          </p>
          <a
            href="/template/missing_persons_template.zip"
            download
            className="text-blue-600 underline text-sm mt-1 block"
          >
            Download ZIP Template
          </a>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-3 border p-2 rounded w-full bg-white"
            accept=".zip"
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Bulk ZIP"}
          </button>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-6 py-2 bg-gray-800 text-white rounded"
      >
        ← Back to Main Dashboard
      </button>
    </div>
  );
};

export default PoliceDashboard;
