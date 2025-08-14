import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Globe, Mic, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { VoiceMessage, MissingPersonReport } from '../../types';
import { mockVoiceMessages } from '../../utils/mockData';

const ReportAgent: React.FC = () => {
  const [reports, setReports] = useState<MissingPersonReport[]>([]);
  const [processingReports, setProcessingReports] = useState<string[]>([]);
  const [whatsappStatus, setWhatsappStatus] = useState('connected');

  const supportedLanguages = [
    'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 
    'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese'
  ];

  const handleNewReport = async (report: MissingPersonReport) => {
    setProcessingReports(prev => [...prev, report.id]);
    
    try {
      // Simulate API call to process report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send to matching agent
      await sendToMatchingAgent(report);
      
      setReports(prev => [report, ...prev]);
      setProcessingReports(prev => prev.filter(id => id !== report.id));
    } catch (error) {
      console.error('Error processing report:', error);
      setProcessingReports(prev => prev.filter(id => id !== report.id));
    }
  };

  const sendToMatchingAgent = async (report: MissingPersonReport) => {
    // API call to matching agent service
    console.log('Sending report to matching agent:', report.id);
  };

  const getLanguageIcon = (lang: string) => {
    const langIcons: { [key: string]: string } = {
      'Hindi': '🇮🇳',
      'English': '🇺🇸',
      'Tamil': '🇮🇳',
      'Telugu': '🇮🇳',
      'Marathi': '🇮🇳',
      'Bengali': '🇮🇳',
      'Gujarati': '🇮🇳',
      'Kannada': '🇮🇳',
      'Malayalam': '🇮🇳',
      'Punjabi': '🇮🇳',
      'Odia': '🇮🇳',
      'Assamese': '🇮🇳'
    };
    return langIcons[lang] || '🌐';
  };

  return (
    <div className="space-y-8">
      {/* WhatsApp Integration Status */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
            Report Agent - Multi-Language Processing
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">WhatsApp Integration</h4>
              <div className={`border rounded-lg p-4 ${
                whatsappStatus === 'connected' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className={`w-4 h-4 ${
                    whatsappStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    whatsappStatus === 'connected' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    +91 98765 43210
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    whatsappStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {whatsappStatus === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <p className={`text-sm ${
                  whatsappStatus === 'connected' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {whatsappStatus === 'connected' 
                    ? 'Send missing person details via text or voice message in any language'
                    : 'Connection lost. Please check WhatsApp Business API status.'
                  }
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Supported Languages</h4>
              <div className="grid grid-cols-2 gap-2">
                {supportedLanguages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="text-lg">{getLanguageIcon(lang)}</span>
                    <span>{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Processing Status */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Report Processing Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{processingReports.length}</p>
                <p className="text-sm text-blue-800">Processing</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{reports.length}</p>
                <p className="text-sm text-green-800">Processed</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">24/7</p>
                <p className="text-sm text-purple-800">Active</p>
              </div>
            </div>
          </div>

          {/* Recent Voice Messages */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Recent Voice Messages Processed</h4>
            <div className="space-y-3">
              {mockVoiceMessages.map((msg, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getLanguageIcon(msg.lang)}</span>
                      <span className="text-sm font-medium text-gray-900">{msg.lang}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      msg.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Mic className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-700">{msg.text}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">{msg.translation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Queue */}
          {processingReports.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Currently Processing</h4>
              <div className="space-y-2">
                {processingReports.map((reportId) => (
                  <div key={reportId} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                    <span className="text-sm text-gray-700">Processing Report #{reportId}</span>
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

export default ReportAgent;
