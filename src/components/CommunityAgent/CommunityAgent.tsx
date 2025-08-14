import React, { useState } from 'react';
import { Users, Camera, Shield, Globe, Heart, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { CommunityMember, CameraAccess, AwarenessCampaign } from '../../types';

const CommunityAgent: React.FC = () => {
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      type: 'individual',
      location: 'Mumbai Central',
      cameras: 2,
      status: 'active',
      joinedDate: '2024-01-15',
      contribution: 'high'
    },
    {
      id: '2',
      name: 'Help India NGO',
      type: 'organization',
      location: 'Delhi NCR',
      cameras: 8,
      status: 'active',
      joinedDate: '2024-01-10',
      contribution: 'very-high'
    },
    {
      id: '3',
      name: 'Local Police Station',
      type: 'government',
      location: 'Bangalore South',
      cameras: 15,
      status: 'active',
      joinedDate: '2024-01-05',
      contribution: 'very-high'
    }
  ]);

  const [cameraRequests, setCameraRequests] = useState<CameraAccess[]>([
    {
      id: '1',
      requester: 'Priya Singh',
      location: 'Chennai Metro',
      cameraType: 'IP Camera',
      status: 'pending',
      requestDate: '2024-01-20'
    }
  ]);

  const [awarenessCampaigns, setAwarenessCampaigns] = useState<AwarenessCampaign[]>([
    {
      id: '1',
      title: 'Missing Child Awareness Week',
      location: 'Mumbai',
      participants: 150,
      status: 'active',
      startDate: '2024-01-25',
      endDate: '2024-01-31'
    }
  ]);

  const handleCameraRequest = (requestId: string, status: 'approved' | 'rejected') => {
    setCameraRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const getContributionColor = (contribution: string) => {
    const colors = {
      'low': 'text-gray-600',
      'medium': 'text-blue-600',
      'high': 'text-green-600',
      'very-high': 'text-purple-600'
    };
    return colors[contribution as keyof typeof colors] || 'text-gray-600';
  };

  const getContributionBadge = (contribution: string) => {
    const badges = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-green-100 text-green-800',
      'very-high': 'bg-purple-100 text-purple-800'
    };
    return badges[contribution as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            Community Agent - Collaboration & Awareness
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Community Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{communityMembers.length}</p>
              <p className="text-sm text-blue-800">Active Members</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {communityMembers.reduce((sum, member) => sum + member.cameras, 0)}
              </p>
              <p className="text-sm text-green-800">Total Cameras</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{awarenessCampaigns.length}</p>
              <p className="text-sm text-purple-800">Active Campaigns</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">24/7</p>
              <p className="text-sm text-orange-800">Monitoring</p>
            </div>
          </div>

          {/* Community Members */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Community Members</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Member</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Location</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Cameras</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {communityMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">Joined {member.joinedDate}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.type === 'individual' ? 'bg-blue-100 text-blue-800' :
                          member.type === 'organization' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {member.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{member.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{member.cameras}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getContributionBadge(member.contribution)}`}>
                          {member.contribution}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Camera Access Requests */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Camera Access Requests</h4>
            <div className="space-y-3">
              {cameraRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{request.requester}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{request.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Camera className="w-3 h-3" />
                          <span>{request.cameraType}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCameraRequest(request.id, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleCameraRequest(request.id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awareness Campaigns */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Awareness Campaigns</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awarenessCampaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{campaign.title}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3" />
                      <span>{campaign.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3" />
                      <span>{campaign.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Add Camera Access</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Invite Community Member</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Create Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityAgent;
