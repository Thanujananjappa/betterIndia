import React from 'react';
import { Heart, Phone, MessageSquare, Globe } from 'lucide-react';

const SupportCenter: React.FC = () => {
  const supportSteps = [
    { step: '1', title: 'Report Missing Person', desc: 'Send details via WhatsApp or web form' },
    { step: '2', title: 'AI Processing', desc: 'Our agents process and verify information' },
    { step: '3', title: 'Network Scanning', desc: 'Cameras and databases are searched' },
    { step: '4', title: 'Notifications', desc: 'Families and authorities get updates' }
  ];

  return (
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
              {supportSteps.map((item, idx) => (
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
  );
};

export default SupportCenter;
