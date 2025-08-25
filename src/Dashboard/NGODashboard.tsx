import React, { useEffect, useState } from "react";
import { CheckCircle2, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  getNgoPeople,
  uploadNgoLicense,
  uploadNgoBulkZip,
} from "../utils/api";

interface User {
  _id: string;
  name: string;
  role: string;
  verificationStatus: "pending" | "verified" | "rejected";
  ngoName?: string;
}

interface RawResident {
  _id?: string;
  name?: string;
  age?: number | null;
  gender?: string;
  notes?: string;
  address?: string;
  photo?: { path?: string };
}

type PersonStatus = "missing" | "rescued" | "shelter";

interface Person {
  _id: string;
  name: string;
  age: number | null;
  gender: string;
  status: PersonStatus;
  photoUrl?: string;
  description?: string;
  lastSeenLocation?: string;
}

const NGODashboard: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [people, setPeople] = useState<Person[]>([]);
  const [bulkZip, setBulkZip] = useState<File | null>(null);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data ?? res);
      } catch (err) {
        console.error("Failed to fetch user", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch NGO's residents
  const fetchPeople = async () => {
    if (!user?._id) return;
    try {
      const res = await getNgoPeople(user._id);
      // ✅ Fix: unwrap correct array from backend response
      const arr = (res.data?.data ?? []) as RawResident[];

      setPeople(
        arr.map((r, idx) => ({
          _id: r._id || `res-${idx}`,
          name: r.name || "Unnamed",
          age: r.age ?? null,
          gender: r.gender || "unspecified",
          status: (r.notes?.split("|")[0] as PersonStatus) || "missing",
          photoUrl: r.photo?.path,
          description: r.notes?.split("|")[1] || "",
          lastSeenLocation: r.address || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch people", err);
      setPeople([]);
    }
  };

  useEffect(() => {
    if (user?.verificationStatus === "verified") {
      fetchPeople();
    }
  }, [user]);

  // Upload NGO License
  const handleLicenseUpload = async () => {
    if (!licenseFile) return alert("Please select a license file first.");
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("license", licenseFile);
      await uploadNgoLicense(fd);
      alert("License uploaded! Waiting for admin verification.");
      setUser((prev) =>
        prev ? { ...prev, verificationStatus: "pending" } : prev
      );
    } catch (err) {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Bulk Upload
  const handleBulkUpload = async () => {
    if (!bulkZip || !user?._id) return alert("Please select a ZIP file.");

    try {
      setUploading(true);
      setBulkMessage(null);
      const fd = new FormData();
      fd.append("zip", bulkZip);

      await uploadNgoBulkZip(user._id, fd);

      setBulkZip(null);
      await fetchPeople();
      setBulkMessage("✅ Bulk import processed successfully!");
    } catch (err) {
      console.error("Bulk upload failed", err);
      setBulkMessage(
        "❌ Bulk import failed. Please check your ZIP structure (see help above)."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  const verified = user?.verificationStatus === "verified";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        NGO Dashboard {user?.ngoName ? `- ${user.ngoName}` : ""}
      </h1>

      {!verified && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p>
            Your NGO is not yet verified. Please upload your license for admin
            approval.
          </p>
          <input
            type="file"
            onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleLicenseUpload}
            disabled={uploading}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Upload License
          </button>
        </div>
      )}

      {verified && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total People" value={people.length} icon={<Users />} />
            <StatCard
              label="Missing"
              value={people.filter((p) => p.status === "missing").length}
              icon={<Search />}
            />
            <StatCard
              label="Rescued"
              value={people.filter((p) => p.status === "rescued").length}
              icon={<CheckCircle2 />}
            />
          </div>

          {/* Help Box for ZIP Structure */}
          <div className="p-4 bg-gray-100 rounded-lg border mt-6">
            <h2 className="font-semibold mb-2">📦 Required ZIP Structure</h2>
            <pre className="bg-white p-3 rounded text-sm overflow-auto">
{`people.zip
│
├── data.csv   (columns: name, age, gender, status, description, lastSeenLocation, photoFileName)
├── photos/
│   ├── person1.jpg
│   ├── person2.png
│   └── ...
`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Ensure the <code>data.csv</code> has correct columns and photo file
              names match.
            </p>
          </div>

          {/* Bulk Upload */}
          <div className="mt-6 space-y-3">
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setBulkZip(e.target.files?.[0] || null)}
              className="p-2 border rounded w-full"
            />
            <button
              onClick={handleBulkUpload}
              disabled={uploading}
              className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
            >
              {uploading ? "Uploading..." : "Upload ZIP"}
            </button>
            {bulkMessage && <p className="mt-2">{bulkMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default NGODashboard;

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-xl border p-4 bg-white shadow-sm flex items-center gap-3">
    {icon && <div className="w-5 h-5">{icon}</div>}
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  </div>
);
