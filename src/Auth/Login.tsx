import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", formData);

      // Police must be verified
      if (data.role === "police" && data.verificationStatus !== "verified") {
        alert(
          `Your police account is not verified yet (status: ${data.verificationStatus}). Please complete verification or wait for approval.`
        );
        return;
      }

      // Store useful info for client-side gating
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "");
      if (data.role === "police") {
        localStorage.setItem("policeRole", data.policeRole || "");
        localStorage.setItem("stationId", data.stationId || "");
        localStorage.setItem("verificationStatus", data.verificationStatus || "");
      } else {
        localStorage.removeItem("policeRole");
        localStorage.removeItem("stationId");
        localStorage.removeItem("verificationStatus");
      }

      // Redirects
      switch (data.role) {
        case "community":
          navigate("/dashboard/community");
          break;
        case "ngo":
          navigate("/dashboard/ngo");
          break;
        case "police":
          navigate("/dashboard/police");
          break;
        case "family":
          navigate("/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
