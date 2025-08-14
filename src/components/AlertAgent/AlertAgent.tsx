import React, { useState, useEffect } from 'react';
import { Bell, Phone, MessageSquare, Mail, Shield, Clock, CheckCircle, AlertTriangle, MapPin, Users } from 'lucide-react';
import { Alert, Notification, PoliceStation, FamilyMember } from '../../types';

const AlertAgent: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([
    {
      id: '1',
      name: 'Mumbai Central Police Station',
      location: 'Mumbai Central',
      contact: '+91 22 2308 1234',
      status: 'active',
      lastContact: '2024-01-20 14:30'
    },
    {
      id: '2',
      name: 'Delhi NCR Police Station',
      location: 'Delhi NCR',
      contact: '+91 11 2345 6789',
      status: 'active',
      lastContact: '2024-01-20 15:45'
    }
  ]);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Priya Patel',
      relation: 'Mother',
      phone: '+91 98765 43210',
      email: 'priya.patel@email.com',
      status: 'notified',
      lastContact: '2024-01-20 16:00'
    }
  ]);

  const [alertStats, setAlertStats] = useState({
    pending: 3,
    sent: 12,
    delivered: 10,
    failed: 1
  });

  useEffect(() => {
    // Simulate incoming alerts
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: 'high-priority',
        message: 'New missing person report received',
        target: 'police-station',
        status: 'pending',
        timestamp: new Date().toISOString(),
        priority: 'high'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const sendAlert = async (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'sending' } : alert
      )
    );

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'sent' } : alert
        )
      );

      // Update stats
      setAlertStats(prev => ({ ...prev, sent: prev.sent + 1, pending: prev.pending - 1 }));
    } catch (error) {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'failed' } : alert
        )
      );
      setAlertStats(prev => ({ ...prev, failed: prev.failed + 1, pending: prev.pending - 1 }));
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-gray-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600',
      'critical': 'text-purple-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800',
      'critical': 'bg-purple-100 text-purple-800'
    };
    return badges[priority as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 text-red-600 mr-2" />
            Alert Agent - Notification & Communication
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Alert Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{alertStats.pending}</p>
              <p className="text-sm text-yellow-800">Pending</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{alertStats.sent}</p>
              <p className="text-sm text-blue-800">Sent</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{alertStats.delivered}</p>
              <p className="text-sm text-green-800">Delivered</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{alertStats.failed}</p>
              <p className="text-sm text-red-800">Failed</p>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Active Alerts</h4>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{alert.message}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.status === 'pending' && (
                        <button
                          onClick={() => sendAlert(alert.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                        >
                          Send Alert
                        </button>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        alert.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                        alert.status === 'sent' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target: {alert.target}</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Police Station Contacts */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Police Station Contacts</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Station</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Location</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Contact</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Last Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {policeStations.map((station) => (
                    <tr key={station.id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">{station.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{station.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{station.contact}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {station.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{station.lastContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Family Member Notifications */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Family Member Notifications</h4>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{member.name}</h5>
                      <p className="text-sm text-gray-600">{member.relation}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.status === 'notified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Last contacted: {member.lastContact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Channels */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Communication Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">SMS Alerts</p>
                  <p className="text-sm text-green-700">Instant text notifications</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">WhatsApp</p>
                  <p className="text-sm text-blue-700">Rich media messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Email</p>
                  <p className="text-sm text-purple-700">Detailed reports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Bell className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Send Emergency Alert</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Add Family Contact</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Add Police Station</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertAgent;
