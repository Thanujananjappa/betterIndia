import React, { useEffect, useState } from "react";
import { Users, Camera, Shield, Globe, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CommunityMember, CameraAccess, AwarenessCampaign } from "../../types";
import {
  getCommunityMembers,
  getCameraRequests,
  getAwarenessCampaigns,
  updateCameraRequestStatus,
} from "../../utils/api";

const getContributionBadge = (contribution: string) => {
  const badges = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-green-100 text-green-800",
    "very-high": "bg-purple-100 text-purple-800",
  };
  return (
    badges[contribution as keyof typeof badges] || "bg-gray-100 text-gray-800"
  );
};

const StatCard: React.FC<{
  icon: JSX.Element;
  value: string | number;
  label: string;
  bg: string;
  text: string;
}> = ({ icon, value, label, bg, text }) => (
  <div className={`${bg} p-4 rounded-lg text-center`}>
    <div className="mx-auto mb-2">{icon}</div>
    <p className={`text-2xl font-bold ${text}`}>{value}</p>
    <p className={`text-sm ${text.replace("600", "800")}`}>{label}</p>
  </div>
);

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${color}`}>{text}</span>
);

const CommunityAgent: React.FC = () => {
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(
    []
  );
  const [cameraRequests, setCameraRequests] = useState<CameraAccess[]>([]);
  const [awarenessCampaigns, setAwarenessCampaigns] = useState<
    AwarenessCampaign[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, requestsRes, campaignsRes] = await Promise.all([
        getCommunityMembers(),
        getCameraRequests(),
        getAwarenessCampaigns(),
      ]);
      setCommunityMembers(membersRes.data);
      setCameraRequests(requestsRes.data);
      setAwarenessCampaigns(campaignsRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraRequest = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updateCameraRequestStatus(id, status);
      setCameraRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error("Error updating request", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Community Agent - Collaboration & Awareness
            </h3>
          </div>

          {/* ✅ Create Account Button (only in Community Dashboard) */}
          <Link
            to="/signup"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
          >
            Create Account
          </Link>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-8 h-8 text-blue-600" />}
              value={communityMembers.length}
              label="Active Members"
              bg="bg-blue-50"
              text="text-blue-600"
            />
            <StatCard
              icon={<Camera className="w-8 h-8 text-green-600" />}
              value={communityMembers.reduce((sum, m) => sum + m.cameras, 0)}
              label="Total Cameras"
              bg="bg-green-50"
              text="text-green-600"
            />
            <StatCard
              icon={<Globe className="w-8 h-8 text-purple-600" />}
              value={awarenessCampaigns.length}
              label="Active Campaigns"
              bg="bg-purple-50"
              text="text-purple-600"
            />
            <StatCard
              icon={<Shield className="w-8 h-8 text-orange-600" />}
              value="24/7"
              label="Monitoring"
              bg="bg-orange-50"
              text="text-orange-600"
            />
          </div>

          {/* Community Members Table */}
          <section>
            <h4 className="font-medium text-gray-900 mb-4">
              Community Members
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    {[
                      "Member",
                      "Type",
                      "Location",
                      "Cameras",
                      "Status",
                      "Contribution",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-4 text-sm font-medium text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {communityMembers.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {m.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {m.joinedDate}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          text={m.type}
                          color={
                            m.type === "individual"
                              ? "bg-blue-100 text-blue-800"
                              : m.type === "organization"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }
                        />
                      </td>
                      <td className="py-3 px-4 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {m.location}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{m.cameras}</td>
                      <td className="py-3 px-4">
                        <Badge
                          text={m.status}
                          color={
                            m.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          text={m.contribution}
                          color={getContributionBadge(m.contribution)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Camera Requests */}
          <section>
            <h4 className="font-medium text-gray-900 mb-4">
              Camera Access Requests
            </h4>
            {cameraRequests.map((req) => (
              <div key={req.id} className="border rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {req.requester}
                    </h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{req.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Camera className="w-3 h-3" />
                        <span>{req.cameraType}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleCameraRequest(req.id, "approved")
                          }
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleCameraRequest(req.id, "rejected")
                          }
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <Badge
                      text={req.status}
                      color={
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Awareness Campaigns */}
          <section>
            <h4 className="font-medium text-gray-900 mb-4">
              Awareness Campaigns
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awarenessCampaigns.map((c) => (
                <div key={c.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{c.title}</h5>
                    <Badge
                      text={c.status}
                      color={
                        c.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3" />
                      <span>{c.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3" />
                      <span>{c.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        {c.startDate} - {c.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommunityAgent;
