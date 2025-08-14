import React from 'react';
import { Search, Database, Globe, Heart, Camera } from 'lucide-react';
import { DataSource, MatchResult } from '../types';
import { mockMatchResults } from '../utils/mockData';

const MatchAgent: React.FC = () => {
  const dataSources: DataSource[] = [
    { title: 'Police Database', count: '12,456', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Social Media', count: '45,789', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'NGO Reports', count: '3,241', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  const activeLocations = ['Mumbai Railway Station', 'Delhi Bus Terminal', 'Bangalore Metro', 'Chennai Airport'];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Search className="w-5 h-5 text-purple-600 mr-2" />
            Match Agent - AI-Powered Recognition
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dataSources.map((source, idx) => (
              <div key={idx} className="text-center">
                <div className={`${source.bg} w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <source.icon className={`w-8 h-8 ${source.color}`} />
                </div>
                <h4 className="font-medium text-gray-900">{source.title}</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{source.count}</p>
                <p className="text-sm text-gray-500">Records scanning</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Facial Recognition Activity</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">Active Scanning Locations</h5>
                {activeLocations.map((location, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">Recent Matches</h5>
                <div className="space-y-3">
                  {mockMatchResults.map((match, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{match.confidence} Match</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${match.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {match.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{match.location}</p>
                      <p className="text-xs text-gray-500">{match.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchAgent;
