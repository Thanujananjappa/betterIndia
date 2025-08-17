import React from "react";
import { Bell, Users, Globe } from "lucide-react";

const CommunityDashboard = () => {
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
    </div>
  );
};

export default CommunityDashboard;
