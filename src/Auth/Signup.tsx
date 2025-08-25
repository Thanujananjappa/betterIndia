// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Signup = () => {
  const navigate = useNavigate();

  // ✅ roles include "citizen" not "family"
  const [role, setRole] = useState<"community" | "ngo" | "police" | "citizen">("community");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    organization: "",
  });

  // Police-only fields
  const [police, setPolice] = useState({
    stationId: "",
    policeRole: "officer" as "main" | "officer",
    officialEmail: "",
    badgeNumber: "",
    idCardFile: null as File | null,
  });

  // NGO-only fields
  const [ngo, setNgo] = useState({
    ngoName: "",
    ngoRegNumber: "",
    licenseFile: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "role") {
      setRole(value as any);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePoliceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPolice((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPolice((prev) => ({ ...prev, idCardFile: file }));
  };

  const handleNgoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNgo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNgoLicense = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNgo((prev) => ({ ...prev, licenseFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (role === "police" || role === "ngo") {
        // multipart/form-data for uploads
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("email", formData.email);
        fd.append("phone", formData.phone);
        fd.append("password", formData.password);
        fd.append("location", formData.location);
        fd.append("organization", formData.organization);
        fd.append("role", role);

        if (role === "police") {
          fd.append("stationId", police.stationId);
          fd.append("policeRole", police.policeRole);
          fd.append("officialEmail", police.officialEmail);
          fd.append("badgeNumber", police.badgeNumber);
          if (police.idCardFile) {
            fd.append("idCard", police.idCardFile); // backend expects "idCard"
          }
        }

        if (role === "ngo") {
          fd.append("ngoName", ngo.ngoName);
          fd.append("ngoRegNumber", ngo.ngoRegNumber);
          if (ngo.licenseFile) {
            fd.append("license", ngo.licenseFile); // backend expects "license"
          }
        }

        await api.post("/auth/register", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // JSON for community/citizen
        const payload = { ...formData, role };
        await api.post("/auth/register", payload);
      }

      alert("Account created! Please login.");
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="name" placeholder="Name" onChange={handleChange} className="border w-full p-2 rounded" required />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} className="border w-full p-2 rounded" required />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="border w-full p-2 rounded" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border w-full p-2 rounded" required />
          <input name="location" placeholder="Location" onChange={handleChange} className="border w-full p-2 rounded" />
          <input name="organization" placeholder="Organization (optional)" onChange={handleChange} className="border w-full p-2 rounded" />
        </div>

        <select
          name="role"
          value={role}
          onChange={handleChange}
          className="border w-full p-2 mt-3 rounded"
        >
          <option value="community">Community Member</option>
          <option value="citizen">Family</option> {/* value must be "citizen" */}
          <option value="ngo">NGO</option>
          <option value="police">Police</option>
        </select>

        {/* Police fields */}
        {role === "police" && (
          <div className="mt-4 space-y-3 border rounded p-3 bg-gray-50">
            <h3 className="font-semibold">Police Verification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="stationId" placeholder="Station ID" onChange={handlePoliceChange} className="border w-full p-2 rounded" required />
              <select name="policeRole" value={police.policeRole} onChange={handlePoliceChange} className="border w-full p-2 rounded">
                <option value="officer">Officer</option>
                <option value="main">Main Police (Station Head)</option>
              </select>
              <input name="officialEmail" placeholder="Official Email" type="email" onChange={handlePoliceChange} className="border w-full p-2 rounded" required />
              <input name="badgeNumber" placeholder="Badge/Service Number" onChange={handlePoliceChange} className="border w-full p-2 rounded" required />
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm mb-1">Upload Police ID Card</label>
                <input type="file" accept="image/*,.pdf" onChange={handleIdCard} className="border w-full p-2 rounded bg-white" />
              </div>
            </div>
            <p className="text-xs text-gray-600">Note: Your account will remain <b>pending</b> until verified by admin.</p>
          </div>
        )}

        {/* NGO fields */}
        {role === "ngo" && (
          <div className="mt-4 space-y-3 border rounded p-3 bg-gray-50">
            <h3 className="font-semibold">NGO Founder Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="ngoName" placeholder="NGO Name" onChange={handleNgoChange} className="border w-full p-2 rounded" required />
              <input name="ngoRegNumber" placeholder="NGO Registration Number" onChange={handleNgoChange} className="border w-full p-2 rounded" required />
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm mb-1">Upload NGO License</label>
                <input type="file" accept="image/*,.pdf" onChange={handleNgoLicense} className="border w-full p-2 rounded bg-white" />
              </div>
            </div>
            <p className="text-xs text-gray-600">Note: Your NGO account will remain <b>pending</b> until verified by admin.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded mt-4 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
