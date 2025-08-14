import React, { useState, useEffect } from 'react';
import { Search, Database, Globe, Heart, Camera, Eye, Shield, Zap, MapPin, Clock } from 'lucide-react';
import { DataSource, MatchResult, FacialRecognitionMatch, SearchRadius } from '../../types';
import { mockMatchResults } from '../../utils/mockData';

const MatchingAgent: React.FC = () => {
  const [activeSearches, setActiveSearches] = useState<string[]>([]);
  const [searchRadius, setSearchRadius] = useState<SearchRadius>({ min: 5, max: 10, unit: 'km' });
  const [facialRecognitionStatus, setFacialRecognitionStatus] = useState('active');
  const [processingPower, setProcessingPower] = useState(85);

  const dataSources: DataSource[] = [
    { title: 'Police Database', count: '12,456', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'NGO Database', count: '3,241', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Social Media', count: '45,789', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'CCTV Network', count: '1,247', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const activeLocations = [
    'Mumbai Railway Station', 'Delhi Bus Terminal', 'Bangalore Metro', 
    'Chennai Airport', 'Kolkata Metro', 'Hyderabad Bus Stand'
  ];

  const facialRecognitionFeatures = [
    'Age Estimation', 'Gender Detection', 'Facial Landmarks', 'Expression Analysis',
    'Hair Color Detection', 'Eye Color Analysis', 'Face Shape Classification'
  ];

  const searchParameters = [
    'Facial Recognition', 'Age Range', 'Clothing Color', 'Height & Build',
    'Last Known Location', 'Time Window', 'Behavioral Patterns'
  ];

  useEffect(() => {
    // Simulate processing power fluctuations
    const interval = setInterval(() => {
      setProcessingPower(prev => Math.max(70, Math.min(95, prev + (Math.random() - 0.5) * 10)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startSearch = (reportId: string) => {
    setActiveSearches(prev => [...prev, reportId]);
    // Simulate search completion after 5-10 seconds
    setTimeout(() => {
      setActiveSearches(prev => prev.filter(id => id !== reportId));
    }, 5000 + Math.random() * 5000);
  };

  const getSearchStatus = (reportId: string) => {
    return activeSearches.includes(reportId) ? 'searching' : 'idle';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Search className="w-5 h-5 text-purple-600 mr-2" />
            Matching Agent - AI-Powered Recognition & Search
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Search Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Search Radius Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <label htmlFor="min-radius" className="text-sm text-gray-600">Min Radius:</label>
                  <input
                    id="min-radius"
                    type="number"
                    value={searchRadius.min}
                    onChange={(e) => setSearchRadius(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    min="1"
                    max="50"
                    aria-label="Minimum search radius in kilometers"
                  />
                  <span className="text-sm text-gray-500">km</span>
                </div>
                <div className="flex items-center space-x-3">
                  <label htmlFor="max-radius" className="text-sm text-gray-600">Max Radius:</label>
                  <input
                    id="max-radius"
                    type="number"
                    value={searchRadius.max}
                    onChange={(e) => setSearchRadius(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    min="1"
                    max="50"
                    aria-label="Maximum search radius in kilometers"
                  />
                  <span className="text-sm text-gray-500">km</span>
                </div>
                <div className="text-xs text-gray-500">
                  Search will cover CCTV cameras and databases within this radius
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">AI Processing Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Processing Power:</span>
                  <span className="text-sm font-medium text-gray-900">{processingPower.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingPower}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Facial Recognition:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    facialRecognitionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {facialRecognitionStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Data Sources & Coverage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>

          {/* Facial Recognition Features */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Facial Recognition Capabilities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {facialRecognitionFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Parameters */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Search Parameters</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {searchParameters.map((param, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">{param}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Scanning Locations */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Active Scanning Locations</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">CCTV Monitoring</h5>
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
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          match.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{match.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Queue */}
          {activeSearches.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Active Searches</h4>
              <div className="space-y-2">
                {activeSearches.map((reportId) => (
                  <div key={reportId} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-700">Searching Report #{reportId}</span>
                    <span className="text-xs text-blue-600">AI Processing...</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingAgent;
