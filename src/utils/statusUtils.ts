import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'missing': return 'bg-red-100 text-red-800 border-red-200';
    case 'investigating': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'found': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'missing': return AlertTriangle;
    case 'investigating': return Clock;
    case 'found': return CheckCircle;
    default: return Clock;
  }
};
