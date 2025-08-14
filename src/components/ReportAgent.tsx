import React from 'react';
import { MessageSquare, Phone, Globe } from 'lucide-react';
import { VoiceMessage } from '../types';
import { mockVoiceMessages } from '../utils/mockData';

const ReportAgent: React.FC = () => {
  const supportedLanguages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada'];

  return (
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
                {supportedLanguages.map((lang) => (
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
              {mockVoiceMessages.map((msg, idx) => (
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
  );
};

export default ReportAgent;
