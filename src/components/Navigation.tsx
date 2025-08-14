import React from 'react';
import { Eye, MessageSquare, Search, Users, Bell, Camera, Heart } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Eye },
    { id: 'report', label: 'Report Agent', icon: MessageSquare },
    { id: 'match', label: 'Matching Agent', icon: Search },
    { id: 'community', label: 'Community Agent', icon: Users },
    { id: 'alert', label: 'Alert Agent', icon: Bell },
    { id: 'camera', label: 'Camera Network', icon: Camera },
    { id: 'support', label: 'Support Center', icon: Heart }
  ];

  return (
    <div className="mb-8">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
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
  );
};

export default Navigation;
