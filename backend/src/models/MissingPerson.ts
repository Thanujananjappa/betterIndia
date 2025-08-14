import mongoose, { Document, Schema } from 'mongoose';

export interface IMissingPerson extends Document {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  lastSeen: Date;
  lastSeenLocation: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: 'missing' | 'investigating' | 'found' | 'closed';
  reportedBy: mongoose.Types.ObjectId;
  reportedByPhone: string;
  reportedByEmail?: string;
  photo: string;
  description: string;
  clothing: {
    color: string;
    type: string;
    details?: string;
  };
  physicalFeatures: {
    height: string;
    weight: string;
    hairColor: string;
    eyeColor: string;
    distinguishingMarks?: string[];
  };
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  languages: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  blockchainHash?: string;
  agentActivity: Array<{
    agent: string;
    action: string;
    timestamp: Date;
    details?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const missingPersonSchema = new Schema<IMissingPerson>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Please add an age'],
    min: [0, 'Age must be positive'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['male', 'female', 'other']
  },
  lastSeen: {
    type: Date,
    required: [true, 'Please specify when the person was last seen']
  },
  lastSeenLocation: {
    type: String,
    required: [true, 'Please specify the last seen location'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['missing', 'investigating', 'found', 'closed'],
    default: 'missing'
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedByPhone: {
    type: String,
    required: [true, 'Please add reporter phone number']
  },
  reportedByEmail: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  photo: {
    type: String,
    required: [true, 'Please add a photo URL']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  clothing: {
    color: {
      type: String,
      required: [true, 'Please specify clothing color']
    },
    type: {
      type: String,
      required: [true, 'Please specify clothing type']
    },
    details: String
  },
  physicalFeatures: {
    height: {
      type: String,
      required: [true, 'Please specify height']
    },
    weight: {
      type: String,
      required: [true, 'Please specify weight']
    },
    hairColor: {
      type: String,
      required: [true, 'Please specify hair color']
    },
    eyeColor: {
      type: String,
      required: [true, 'Please specify eye color']
    },
    distinguishingMarks: [String]
  },
  medicalInfo: {
    conditions: [String],
    medications: [String],
    allergies: [String]
  },
  languages: {
    type: [String],
    required: [true, 'Please specify languages spoken'],
    default: ['English']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  blockchainHash: {
    type: String,
    unique: true,
    sparse: true
  },
  agentActivity: [{
    agent: {
      type: String,
      required: true,
      enum: ['report', 'matching', 'community', 'alert']
    },
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }]
}, {
  timestamps: true
});

// Create indexes for efficient querying
missingPersonSchema.index({ status: 1 });
missingPersonSchema.index({ priority: 1 });
missingPersonSchema.index({ lastSeen: -1 });
missingPersonSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
missingPersonSchema.index({ reportedBy: 1 });
missingPersonSchema.index({ blockchainHash: 1 });

// Text search index
missingPersonSchema.index({
  name: 'text',
  description: 'text',
  'clothing.details': 'text',
  'physicalFeatures.distinguishingMarks': 'text'
});

export default mongoose.model<IMissingPerson>('MissingPerson', missingPersonSchema);
