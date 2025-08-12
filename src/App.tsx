import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Users, 
  Camera, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Globe,
  Database,
  Zap,
  Shield,
  Heart,
  Settings
} from 'lucide-react';

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  status: 'missing' | 'investigating' | 'found';
  reportedBy: string;
  photo: string;
  description: string;
  agentActivity: string[];
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases] = useState<MissingPerson[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 24,
      lastSeen: '2 hours ago',
      location: 'Downtown Mumbai',
      status: 'investigating',
      reportedBy: 'Family via WhatsApp',
      photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150&h=150&fit=crop&crop=face',
      description: 'Brown hair, wearing blue jacket',
      agentActivity: ['Voice message processed in Hindi', 'Facial recognition scanning active', '3 camera feeds checking']
    },
    {
      id: '2',
      name: 'Raj Patel',
      age: 16,
      lastSeen: '6 hours ago',
      location: 'Railway Station, Delhi',
      status: 'missing',
      reportedBy: 'Local Police',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop&crop=face',
      description: 'School uniform, red backpack',
      agentActivity: ['Police database updated', 'NGO alerts sent', 'Social media monitoring active']
    },
    {
      id: '3',
      name: 'Maria Santos',
      age: 45,
      lastSeen: '1 day ago',
      location: 'Bus Terminal, Bangalore',
      status: 'found',
      reportedBy: 'NGO Report',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=face',
      description: 'Green saree, carrying yellow bag',
      agentActivity: ['Match found via CCTV', 'Family notified', 'GPS location shared']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missing': return 'bg-red-100 text-red-800 border-red-200';
      case 'investigating': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'found': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'missing': return <AlertTriangle className="w-4 h-4" />;
      case 'investigating': return <Clock className="w-4 h-4" />;
      case 'found': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SafeFind AI</h1>
                  <p className="text-xs text-gray-500">Missing Person Recovery System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Eye },
              { id: 'report', label: 'Report Agent', icon: MessageSquare },
              { id: 'match', label: 'Match Agent', icon: Search },
              { id: 'camera', label: 'Camera Network', icon: Camera },
              { id: 'support', label: 'Support Center', icon: Heart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Active Cases', value: '47', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50', icon: AlertTriangle },
                { title: 'Found Today', value: '8', change: '+25%', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
                { title: 'Camera Feeds', value: '1,247', change: '+18%', color: 'text-purple-600', bg: 'bg-purple-50', icon: Camera },
                { title: 'Response Time', value: '4.2m', change: '-15%', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last week</p>
                    </div>
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Agent Status */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  AI Agents Status
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Report Agent', status: 'Active', processed: '156 reports', icon: MessageSquare, color: 'text-green-600' },
                    { name: 'Match Agent', status: 'Scanning', processed: '2.4k images/min', icon: Search, color: 'text-blue-600' },
                    { name: 'Notification Agent', status: 'Active', processed: '23 alerts sent', icon: Bell, color: 'text-purple-600' },
                    { name: 'Support Agent', status: 'Active', processed: '12 cameras added', icon: Camera, color: 'text-orange-600' }
                  ].map((agent, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-white p-2 rounded-lg">
                        <agent.icon className={`w-5 h-5 ${agent.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.status}</p>
                        <p className="text-xs text-gray-500 mt-1">{agent.processed}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Cases */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Cases</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Case</span>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {cases.map((person) => (
                  <div key={person.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">{person.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(person.status)}`}>
                            {getStatusIcon(person.status)}
                            <span className="ml-1 capitalize">{person.status}</span>
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Age: {person.age}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {person.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {person.lastSeen}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-700">{person.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Reported by: {person.reportedBy}</p>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">AI Agent Activity:</p>
                          <div className="space-y-1">
                            {person.agentActivity.map((activity, idx) => (
                              <div key={idx} className="flex items-center text-xs text-gray-600">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                {activity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report Agent View */}
        {activeTab === 'report' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                  Report Agent - Multi-Language Processing
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">WhatsApp Integration</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">+91 98765 43210</span>
                      </div>
                      <p className="text-sm text-green-700">Send missing person details via text or voice message in any language</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Supported Languages</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada'].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span>{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Voice Messages Processed</h4>
                  <div className="space-y-3">
                    {[
                      { lang: 'Hindi', text: 'मेरा बेटा गुम हो गया है...', translation: 'My son is missing...', status: 'Processed' },
                      { lang: 'Tamil', text: 'என் மகள் காணவில்லை...', translation: 'My daughter is missing...', status: 'Processing' },
                      { lang: 'English', text: 'Lost my mother at railway station...', translation: 'Lost my mother at railway station...', status: 'Processed' }
                    ].map((msg, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{msg.lang}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${msg.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{msg.text}</p>
                        <p className="text-xs text-gray-500">{msg.translation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match Agent View */}
        {activeTab === 'match' && (
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
                  {[
                    { title: 'Police Database', count: '12,456', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Social Media', count: '45,789', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
                    { title: 'NGO Reports', count: '3,241', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' }
                  ].map((source, idx) => (
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
                      {['Mumbai Railway Station', 'Delhi Bus Terminal', 'Bangalore Metro', 'Chennai Airport'].map((location, idx) => (
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
                        {[
                          { confidence: '94%', location: 'Platform 3, Delhi', time: '5 min ago', status: 'verified' },
                          { confidence: '87%', location: 'Bus Stop, Mumbai', time: '12 min ago', status: 'pending' },
                          { confidence: '91%', location: 'Metro Station, Bangalore', time: '18 min ago', status: 'verified' }
                        ].map((match, idx) => (
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
        )}

        {/* Camera Network View */}
        {activeTab === 'camera' && (
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
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                        {[
                          { location: 'Central Railway Station - Platform 1', org: 'Mumbai Police', status: 'Active', time: '2 hours ago' },
                          { location: 'Bus Terminal Gate 3', org: 'Help India NGO', status: 'Active', time: '4 hours ago' },
                          { location: 'Metro Station Exit A', org: 'Delhi Police', status: 'Testing', time: '6 hours ago' },
                          { location: 'Airport Arrival Hall', org: 'Bangalore Airport', status: 'Active', time: '1 day ago' }
                        ].map((camera, idx) => (
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
        )}

        {/* Support Center View */}
        {activeTab === 'support' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Heart className="w-5 h-5 text-red-600 mr-2" />
                  Support Center - Community Assistance
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">For Families</h4>
                    <p className="text-blue-800 text-sm mb-4">Get immediate assistance and updates about your missing loved one</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Family Support
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">For NGOs</h4>
                    <p className="text-green-800 text-sm mb-4">Join our network and help expand our search capabilities</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                      NGO Partnership
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">For Police</h4>
                    <p className="text-purple-800 text-sm mb-4">Access advanced tools and collaborate with our AI agents</p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                      Police Portal
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">How to Get Started</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { step: '1', title: 'Report Missing Person', desc: 'Send details via WhatsApp or web form' },
                      { step: '2', title: 'AI Processing', desc: 'Our agents process and verify information' },
                      { step: '3', title: 'Network Scanning', desc: 'Cameras and databases are searched' },
                      { step: '4', title: 'Notifications', desc: 'Families and authorities get updates' }
                    ].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-bold">{item.step}</span>
                        </div>
                        <h5 className="font-medium text-gray-900 mb-2">{item.title}</h5>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Phone className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Emergency Helpline</p>
                      <p className="text-sm text-gray-600">+91 1800-MISSING</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <MessageSquare className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">WhatsApp Support</p>
                      <p className="text-sm text-gray-600">+91 98765-43210</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Globe className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Web Portal</p>
                      <p className="text-sm text-gray-600">safefind.ai/report</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;