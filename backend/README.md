# Missing Person AI System - Backend

A comprehensive backend API for the Missing Person AI System with blockchain integration, WhatsApp processing, and AI-powered facial recognition.

## 🚀 Features

- **Multi-Language WhatsApp Integration**: Process reports in 12+ Indian languages
- **Blockchain Security**: Store sensitive data hashes on Ethereum blockchain
- **AI-Powered Processing**: Extract information from text and voice messages
- **Real-time Notifications**: SMS, WhatsApp, and email alerts
- **Community Collaboration**: Camera access and awareness campaign management
- **Police Integration**: Direct communication with police stations
- **Facial Recognition**: AI-powered matching with CCTV and databases

## 🏗️ Architecture

```
Backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── middleware/     # Authentication & validation
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── blockchain/     # Blockchain integration
├── dist/               # Compiled JavaScript
└── node_modules/       # Dependencies
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain**: Ethereum (Sepolia testnet)
- **Authentication**: JWT with bcrypt
- **WhatsApp**: Twilio Business API
- **AI/ML**: OpenAI GPT, TensorFlow.js
- **File Storage**: Cloudinary
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- Ethereum wallet with Sepolia testnet ETH
- Twilio account for WhatsApp Business API
- OpenAI API key
- Cloudinary account

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### 4. Blockchain Setup

```bash
# Get Sepolia testnet ETH from faucet
# Update ETHEREUM_PRIVATE_KEY in .env
# Deploy smart contract and update CONTRACT_ADDRESS
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/missing-person-ai` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `AC...` |
| `ETHEREUM_RPC_URL` | Ethereum RPC endpoint | `https://sepolia.infura.io/v3/...` |

### Blockchain Configuration

1. **Network**: Sepolia testnet (recommended for development)
2. **Smart Contract**: Deploy the provided ABI
3. **Gas Fees**: Ensure wallet has sufficient Sepolia ETH

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Reports
- `POST /api/reports` - Create missing person report
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report

### WhatsApp Integration
- `POST /api/whatsapp/webhook` - Twilio webhook
- `GET /api/whatsapp/status` - Service status

### Matching Agent
- `POST /api/matching/search` - Start AI search
- `GET /api/matching/status/:id` - Search status
- `GET /api/matching/results/:id` - Search results

### Community Agent
- `POST /api/community/cameras` - Add camera access
- `GET /api/community/members` - List members
- `POST /api/community/campaigns` - Create awareness campaign

### Alert Agent
- `POST /api/alerts/send` - Send emergency alert
- `GET /api/alerts/history` - Alert history
- `POST /api/alerts/contacts` - Add contact

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### User Roles

- `admin` - Full system access
- `police` - Police station access
- `ngo` - NGO organization access
- `community` - Community member access
- `family` - Family member access

## 🧠 AI Processing

### WhatsApp Message Processing

1. **Language Detection**: Automatically detect language (Hindi, Tamil, Telugu, etc.)
2. **Information Extraction**: Extract name, age, location, clothing details
3. **Priority Calculation**: Determine report priority based on age and medical info
4. **Blockchain Storage**: Store data hash for integrity verification

### Facial Recognition

1. **Image Processing**: Analyze uploaded photos
2. **Feature Extraction**: Extract facial landmarks and features
3. **Database Matching**: Compare with existing missing person database
4. **Confidence Scoring**: Provide match confidence percentage

## 🔗 Blockchain Integration

### Smart Contract Functions

- `storeMissingPersonData()` - Store data hash
- `getMissingPersonData()` - Retrieve data
- `verifyDataIntegrity()` - Verify data integrity

### Data Flow

1. Report data is hashed using SHA-256
2. Hash is stored on Ethereum blockchain
3. Original data remains in MongoDB
4. Blockchain provides immutable audit trail

## 📊 Database Models

### User
- Authentication details
- Role and permissions
- Organization information

### MissingPerson
- Personal details
- Physical characteristics
- Last seen information
- Blockchain hash reference

### AgentActivity
- Track all agent actions
- Timestamp and details
- Audit trail

## 🚨 Security Features

- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Mongoose ODM protection
- **XSS Protection**: Helmet.js security headers
- **Rate Limiting**: API rate limiting
- **CORS Configuration**: Controlled cross-origin access
- **JWT Security**: Secure token handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "User"
```

## 📦 Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Environment

```bash
NODE_ENV=production
PORT=5000
```

### 3. Process Manager

```bash
# Using PM2
npm install -g pm2
pm2 start dist/server.js --name "missing-person-api"
```

### 4. Reverse Proxy

```bash
# Nginx configuration
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Monitoring

### Health Check

```bash
GET /health
```

### Metrics

- Database connection status
- Blockchain connection status
- WhatsApp service status
- API response times
- Error rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- **Email**: support@missingperson-ai.com
- **Documentation**: [API Docs](https://docs.missingperson-ai.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/missing-person-ai/issues)

## 🔮 Roadmap

- [ ] Advanced AI models for better matching
- [ ] Real-time CCTV monitoring
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language voice processing
- [ ] Integration with police databases
- [ ] Community alert system
- [ ] Advanced blockchain features

---

**Built with ❤️ for community safety**
