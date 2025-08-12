# Missing Person AI Agent System

A comprehensive platform that uses multiple AI agents to help find missing persons through various channels and technologies.

## Features

- **Multi-Agent Dashboard**: Report, Match, Notification, and Support agents working together
- **Multi-Language Support**: Process reports in Hindi, English, Tamil, Telugu, and other Indian languages
- **Camera Network Integration**: Allow NGOs, police, and locals to add their cameras
- **Real-time Matching**: AI-powered facial recognition across databases and CCTV feeds
- **Family Communication**: GPS location sharing and real-time updates
- **Professional Interface**: Modern, responsive design optimized for all devices

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── index.css        # Global styles with Tailwind
└── vite-env.d.ts    # TypeScript definitions

public/
└── vite.svg         # Default Vite icon

Configuration files:
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.ts   # Vite configuration
└── eslint.config.js # ESLint configuration
```

## Key Components

### Dashboard
- Real-time case overview
- AI agent status monitoring
- Recent activity tracking
- Statistics and metrics

### Report Agent
- WhatsApp integration for text/voice messages
- Multi-language processing (Hindi, English, Tamil, etc.)
- Automatic translation and case creation

### Match Agent
- Facial recognition across multiple databases
- Police database integration
- Social media monitoring
- NGO report scanning

### Camera Network
- Camera feed management
- Organization partnerships
- Real-time monitoring status

### Support Center
- Family assistance portal
- NGO partnership program
- Police collaboration tools
- Community engagement

## Future Enhancements

- Real AI integration with facial recognition APIs
- WhatsApp Business API integration
- Database connectivity (PostgreSQL/MongoDB)
- Real-time notifications (WebSocket/Server-Sent Events)
- GPS tracking and mapping
- Multi-language voice processing
- Advanced search and filtering
- Mobile app development

## Contributing

This is a demonstration project showcasing how AI agents can work together for social good. Contributions and suggestions for real-world implementation are welcome.

## License

MIT License - Feel free to use this code for educational or humanitarian purposes.