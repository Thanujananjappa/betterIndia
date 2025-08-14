import React, { useState } from 'react';
import {
  Header,
  Navigation,
  Dashboard,
  ReportAgent,
  MatchingAgent,
  CommunityAgent,
  AlertAgent,
  CameraNetwork,
  SupportCenter
} from './components';
import { mockCases } from './utils/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard cases={mockCases} />;
      case 'report':
        return <ReportAgent />;
      case 'match':
        return <MatchingAgent />;
      case 'community':
        return <CommunityAgent />;
      case 'alert':
        return <AlertAgent />;
      case 'camera':
        return <CameraNetwork />;
      case 'support':
        return <SupportCenter />;
      default:
        return <Dashboard cases={mockCases} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default App;