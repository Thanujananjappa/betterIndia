import React, { useEffect, useState } from "react";
import {
  FileText,
  Handshake,
  Globe,
  Upload,
  AlertCircle,
  CheckCircle2,
  Search,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface User {
  name: string;
  role: string;
  status: "pending" | "verified" | "rejected";
  ngoName?: string;
  ngoRegNumber?: string;
  ngoLicenseUrl?: string;
}

interface Person {
  _id: string;
  name: string;
  age: number;
  gender: string;
  status: "missing" | "rescued" | "shelter";
  photoUrl?: string;
  description?: string;
  lastSeenLocation?: string;
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "missing" | "rescued" | "shelter">("all");

  // Upload new person form state
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
    lastSeenLocation: "",
    status: "missing",
    photo: null as File | null,
  });

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch NGO people records
  const fetchPeople = async () => {
    try {
      const res = await api.get("/ngo/people");
      setPeople(res.data);
    } catch (err) {
      console.error("Failed to fetch people", err);
    }
  };

  useEffect(() => {
    if (user?.status === "verified") fetchPeople();
  }, [user]);

  // Upload NGO license
  const handleLicenseUpload = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      const fd = new FormData();
      fd.append("license", file);
      await api.post("/ngo/upload-license", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("License uploaded! Waiting for admin verification.");
      setUser((prev) => (prev ? { ...prev, status: "pending" } : prev));
    } catch (err) {
      alert("Upload failed. Try again.");
    }
  };

  // Upload new person
  const handlePersonUpload = async () => {
    if (!form.name || !form.age || !form.gender || !form.photo) {
      return alert("Please fill all required fields and add a photo.");
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value as any);
      });
      await api.post("/ngo/upload-person", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Person uploaded successfully!");
      setForm({
        name: "",
        age: "",
        gender: "",
        description: "",
        lastSeenLocation: "",
        status: "missing",
        photo: null,
      });
      fetchPeople();
    } catch (err) {
      alert("Upload failed. Try again.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">NGO Dashboard</h1>

      {/* Verification Banner */}
      {user?.status === "pending" && (
        <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Your NGO account is pending admin verification. Please wait.
        </div>
      )}

      {user?.status === "rejected" && (
        <div className="p-4 border rounded-lg bg-red-50 text-red-800">
          <p className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Your NGO verification was <b>rejected</b>. Please re-upload your license.
          </p>
          <div className="mt-3">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-2 border p-2 rounded w-full"
            />
            <button
              onClick={handleLicenseUpload}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Re-upload License
            </button>
          </div>
        </div>
      )}

      {user?.status === "verified" && (
        <>
          {/* Success Banner */}
          <div className="p-4 border rounded-lg bg-green-50 text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Your NGO account is verified!
          </div>

          {/* Upload Person Form */}
          <div className="p-4 border rounded-xl shadow space-y-4">
            <div className="flex items-center gap-2 text-purple-600">
              <UserPlus className="w-6 h-6" />
              <h2 className="font-semibold">Upload Person Details</h2>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="text"
              placeholder="Last Seen Location"
              value={form.lastSeenLocation}
              onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="missing">Missing</option>
              <option value="rescued">Rescued</option>
              <option value="shelter">In Shelter</option>
            </select>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handlePersonUpload}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Upload Person
            </button>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded pl-8 w-full"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border p-2 rounded"
            >
              <option value="all">All</option>
              <option value="missing">Missing</option>
              <option value="rescued">Rescued</option>
              <option value="shelter">In Shelter</option>
            </select>
          </div>

          {/* People Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {people
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .filter((p) => (filter === "all" ? true : p.status === filter))
              .map((p) => (
                <div key={p._id} className="p-4 border rounded-xl shadow hover:shadow-lg transition">
                  {p.photoUrl && (
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <h3 className="mt-2 font-semibold">{p.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {p.age} yrs | {p.gender}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{p.description}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      p.status === "missing"
                        ? "bg-red-100 text-red-600"
                        : p.status === "rescued"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
          </div>
        </>
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

export default NGODashboard;
