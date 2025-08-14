import React from 'react';
import { Camera } from 'lucide-react';
import { CameraLocation } from '../types';
import { mockCameraLocations } from '../utils/mockData';

const CameraNetwork: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Camera className="w-5 h-5 text-green-600 mr-2" />
            Camera Network Management
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Add New Camera Feed</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Camera Location Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Camera Feed URL/IP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Select Organization Type"
                >
                  <option>Select Organization Type</option>
                  <option>Police Department</option>
                  <option>NGO</option>
                  <option>Local Community</option>
                  <option>Transportation Hub</option>
                </select>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Camera Feed
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Network Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-blue-800">Total Cameras</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">1,198</p>
                  <p className="text-sm text-green-800">Active Now</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">156</p>
                  <p className="text-sm text-purple-800">Police Cams</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">89</p>
                  <p className="text-sm text-orange-800">NGO Cams</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Recent Camera Additions</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Location</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Organization</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockCameraLocations.map((camera, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 text-sm text-gray-900">{camera.location}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{camera.org}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${camera.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {camera.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{camera.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraNetwork;
