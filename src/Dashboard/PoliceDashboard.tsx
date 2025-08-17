import React from "react";
import { Shield, Camera, AlertTriangle } from "lucide-react";

const PoliceDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Police Dashboard</h1>

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
    </div>
  );
};

export default PoliceDashboard;
