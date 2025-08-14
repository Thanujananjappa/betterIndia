import { MissingPerson, VoiceMessage, CameraLocation, MatchResult } from '../types';

export const mockCases: MissingPerson[] = [
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
];

export const mockVoiceMessages: VoiceMessage[] = [
  { lang: 'Hindi', text: 'मेरा बेटा गुम हो गया है...', translation: 'My son is missing...', status: 'Processed' },
  { lang: 'Tamil', text: 'என் மகள் காணவில்லை...', translation: 'My daughter is missing...', status: 'Processing' },
  { lang: 'English', text: 'Lost my mother at railway station...', translation: 'Lost my mother at railway station...', status: 'Processed' }
];

export const mockCameraLocations: CameraLocation[] = [
  { location: 'Central Railway Station - Platform 1', org: 'Mumbai Police', status: 'Active', time: '2 hours ago' },
  { location: 'Bus Terminal Gate 3', org: 'Help India NGO', status: 'Active', time: '4 hours ago' },
  { location: 'Metro Station Exit A', org: 'Delhi Police', status: 'Testing', time: '6 hours ago' },
  { location: 'Airport Arrival Hall', org: 'Bangalore Airport', status: 'Active', time: '1 day ago' }
];

export const mockMatchResults: MatchResult[] = [
  { confidence: '94%', location: 'Platform 3, Delhi', time: '5 min ago', status: 'verified' },
  { confidence: '87%', location: 'Bus Stop, Mumbai', time: '12 min ago', status: 'pending' },
  { confidence: '91%', location: 'Metro Station, Bangalore', time: '18 min ago', status: 'verified' }
];
