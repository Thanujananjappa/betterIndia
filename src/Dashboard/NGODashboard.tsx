import React from "react";
import { FileText, Handshake, Globe } from "lucide-react";

const NGODashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">NGO Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-xl shadow">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="font-semibold mt-2">Track Cases</h2>
          <p className="text-gray-600">Monitor ongoing missing person reports.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <Handshake className="w-6 h-6 text-orange-600" />
          <h2 className="font-semibold mt-2">Collaboration</h2>
          <p className="text-gray-600">Work with police and communities.</p>
        </div>

        <div className="p-4 border rounded-xl shadow">
          <Globe className="w-6 h-6 text-green-600" />
          <h2 className="font-semibold mt-2">Campaigns</h2>
          <p className="text-gray-600">Organize awareness drives.</p>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
