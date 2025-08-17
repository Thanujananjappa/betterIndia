import React from "react";
import { Users, Camera, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-xl shadow">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="font-semibold mt-2">Manage Community Members</h2>
          <p className="text-gray-600">Add/remove members and assign roles.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <Camera className="w-6 h-6 text-green-600" />
          <h2 className="font-semibold mt-2">CCTV Database</h2>
          <p className="text-gray-600">Monitor and manage connected cameras.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h2 className="font-semibold mt-2">Incident Reports</h2>
          <p className="text-gray-600">Review and escalate missing cases.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
