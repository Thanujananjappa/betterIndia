import React, { useState } from "react";
import { Bell, Users, Globe, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [cameraAccess, setCameraAccess] = useState(false);

  const handleCameraToggle = () => {
    setCameraAccess(!cameraAccess);
    alert(
      !cameraAccess
        ? "CCTV access shared with authorities."
        : "CCTV access revoked."
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Community Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-xl shadow">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="font-semibold mt-2">Active Members</h2>
          <p className="text-gray-600">View and connect with other volunteers.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <Bell className="w-6 h-6 text-purple-600" />
          <h2 className="font-semibold mt-2">Alerts</h2>
          <p className="text-gray-600">Stay updated with local missing alerts.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <Globe className="w-6 h-6 text-green-600" />
          <h2 className="font-semibold mt-2">Awareness Campaigns</h2>
          <p className="text-gray-600">Join awareness programs in your area.</p>
        </div>
      </div>

      {/* CCTV Access */}
      <div className="p-4 border rounded-xl shadow">
        <Camera className="w-6 h-6 text-red-600" />
        <h2 className="font-semibold mt-2">CCTV Access</h2>
        <p className="text-gray-600">
          Allow authorities to temporarily access your CCTV feed.
        </p>
        <button
          onClick={handleCameraToggle}
          className={`mt-3 px-4 py-2 rounded text-white ${
            cameraAccess ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {cameraAccess ? "Revoke Access" : "Share Access"}
        </button>
      </div>

      {/* Back to Main Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-6 py-2 bg-gray-800 text-white rounded"
      >
        ← Back to Main Dashboard
      </button>
    </div>
  );
};

export default CommunityDashboard;
