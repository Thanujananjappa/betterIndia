import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Camera, 
  Clock, 
  Plus, 
  Users, 
  MapPin, 
  Zap 
} from 'lucide-react';
import { MissingPerson, StatCard, AgentStatus } from '../types';
import { getStatusColor, getStatusIcon } from '../utils/statusUtils';

interface DashboardProps {
  cases: MissingPerson[];
}

const Dashboard: React.FC<DashboardProps> = ({ cases }) => {
  const stats: StatCard[] = [
    { title: 'Active Cases', value: '47', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50', icon: AlertTriangle },
    { title: 'Found Today', value: '8', change: '+25%', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
    { title: 'Camera Feeds', value: '1,247', change: '+18%', color: 'text-purple-600', bg: 'bg-purple-50', icon: Camera },
    { title: 'Response Time', value: '4.2m', change: '-15%', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock }
  ];

  const agents: AgentStatus[] = [
    { name: 'Report Agent', status: 'Active', processed: '156 reports', icon: Users, color: 'text-green-600' },
    { name: 'Match Agent', status: 'Scanning', processed: '2.4k images/min', icon: Camera, color: 'text-blue-600' },
    { name: 'Notification Agent', status: 'Active', processed: '23 alerts sent', icon: Clock, color: 'text-purple-600' },
    { name: 'Support Agent', status: 'Active', processed: '12 cameras added', icon: Camera, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            {agents.map((agent, index) => (
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
                      {(() => {
                        const IconComponent = getStatusIcon(person.status);
                        return <IconComponent className="w-4 h-4" />;
                      })()}
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
  );
};

export default Dashboard;
