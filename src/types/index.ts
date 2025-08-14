// Core Missing Person Types
export interface MissingPerson {
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

export interface MissingPersonReport {
  id: string;
  person: MissingPerson;
  reportDate: string;
  source: 'whatsapp' | 'web' | 'phone';
  language: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'processing' | 'sent-to-matching' | 'completed';
  blockchainHash?: string;
}

// Agent Types
export interface StatCard {
  title: string;
  value: string;
  change: string;
  color: string;
  bg: string;
  icon: any;
}

export interface AgentStatus {
  name: string;
  status: string;
  processed: string;
  icon: any;
  color: string;
}

export interface VoiceMessage {
  lang: string;
  text: string;
  translation: string;
  status: string;
}

export interface DataSource {
  title: string;
  count: string;
  icon: any;
  color: string;
  bg: string;
}

export interface CameraLocation {
  location: string;
  org: string;
  status: string;
  time: string;
}

export interface MatchResult {
  confidence: string;
  location: string;
  time: string;
  status: string;
}

// Enhanced Agent Types
export interface FacialRecognitionMatch {
  id: string;
  reportId: string;
  confidence: number;
  location: string;
  timestamp: string;
  imageUrl: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface SearchRadius {
  min: number;
  max: number;
  unit: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  type: 'individual' | 'organization' | 'government';
  location: string;
  cameras: number;
  status: 'active' | 'inactive';
  joinedDate: string;
  contribution: 'low' | 'medium' | 'high' | 'very-high';
}

export interface CameraAccess {
  id: string;
  requester: string;
  location: string;
  cameraType: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export interface AwarenessCampaign {
  id: string;
  title: string;
  location: string;
  participants: number;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate: string;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  target: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  location: string;
  contact: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  status: 'notified' | 'pending' | 'failed';
  lastContact: string;
}

// Blockchain Types
export interface BlockchainRecord {
  hash: string;
  timestamp: string;
  data: any;
  previousHash: string;
  nonce: number;
}

export interface SmartContract {
  address: string;
  name: string;
  version: string;
  functions: string[];
  events: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search and Filter Types
export interface SearchFilters {
  ageRange?: [number, number];
  location?: string;
  timeWindow?: [string, string];
  clothingColor?: string;
  height?: string;
  gender?: string;
}

export interface SearchResult {
  id: string;
  reportId: string;
  matchType: 'facial' | 'clothing' | 'location' | 'behavioral';
  confidence: number;
  source: string;
  timestamp: string;
  details: any;
}
