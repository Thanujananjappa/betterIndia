import { useState } from "react";
import api from "../utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "community",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      alert("Account created!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        <input name="location" placeholder="Location" onChange={handleChange} className="border w-full p-2 mb-3 rounded" />
        
        <select name="role" onChange={handleChange} className="border w-full p-2 mb-3 rounded">
          <option value="community">Community Member</option>
          <option value="ngo">NGO</option>
          <option value="police">Police</option>
          <option value="family">Family</option>
        </select>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
