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
