import twilio from 'twilio';
import MissingPerson from '../models/MissingPerson';
import { BlockchainService } from '../blockchain/blockchainService';

export interface WhatsAppMessage {
  from: string;
  body: string;
  mediaUrl?: string;
  timestamp: Date;
  language?: string;
}

export interface ProcessedReport {
  success: boolean;
  reportId?: string;
  message: string;
  confidence: number;
}

export class WhatsAppService {
  private client: twilio.Twilio;
  private blockchainService: BlockchainService;
  private supportedLanguages: string[] = [
    'hi', 'en', 'ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'or', 'as'
  ];

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.warn('⚠️ Twilio credentials not found. WhatsApp service will be limited.');
      this.client = null as any;
    } else {
      this.client = twilio(accountSid, authToken);
      console.log('✅ WhatsApp service initialized with Twilio');
    }

    // Initialize blockchain service
    this.blockchainService = new BlockchainService({
      rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id',
      privateKey: process.env.ETHEREUM_PRIVATE_KEY || 'mock-key',
      contractAddress: process.env.CONTRACT_ADDRESS || 'mock-address',
      chainId: parseInt(process.env.CHAIN_ID || '11155111')
    });
  }

  /**
   * Process incoming WhatsApp message and extract missing person information
   */
  async processMessage(message: WhatsAppMessage): Promise<ProcessedReport> {
    try {
      console.log(`📱 Processing WhatsApp message from ${message.from}`);

      // Detect language
      const detectedLanguage = this.detectLanguage(message.body);
      
      // Extract information using NLP/AI
      const extractedInfo = await this.extractInformation(message.body, detectedLanguage);
      
      if (!extractedInfo.isValid) {
        return {
          success: false,
          message: this.getResponseMessage('invalid_format', detectedLanguage),
          confidence: 0
        };
      }

      // Create missing person report
      const missingPerson = new MissingPerson({
        name: extractedInfo.name,
        age: extractedInfo.age,
        gender: extractedInfo.gender,
        lastSeen: extractedInfo.lastSeen,
        lastSeenLocation: extractedInfo.location,
        reportedByPhone: message.from,
        photo: message.mediaUrl || '',
        description: extractedInfo.description,
        clothing: {
          color: extractedInfo.clothingColor || 'unknown',
          type: extractedInfo.clothingType || 'unknown'
        },
        physicalFeatures: {
          height: extractedInfo.height || 'unknown',
          weight: extractedInfo.weight || 'unknown',
          hairColor: extractedInfo.hairColor || 'unknown',
          eyeColor: extractedInfo.eyeColor || 'unknown'
        },
        languages: [detectedLanguage],
        priority: this.calculatePriority(extractedInfo),
        agentActivity: [{
          agent: 'report',
          action: 'whatsapp_report_received',
          timestamp: new Date(),
          details: `Report received via WhatsApp in ${detectedLanguage}`
        }]
      });

      // Store on blockchain
      try {
        const dataHash = this.blockchainService.generateDataHash(missingPerson.toObject());
        const metadata = JSON.stringify({
          type: 'missing_person_report',
          timestamp: new Date().toISOString(),
          source: 'whatsapp'
        });
        
        await this.blockchainService.storeDataHash(dataHash, metadata);
        missingPerson.blockchainHash = dataHash;
        
        console.log(`🔗 Report stored on blockchain with hash: ${dataHash}`);
      } catch (blockchainError) {
        console.warn('⚠️ Failed to store on blockchain, continuing with database storage');
      }

      // Save to database
      await missingPerson.save();

      // Send confirmation message
      await this.sendConfirmationMessage(message.from, (missingPerson._id as any).toString(), detectedLanguage);

      return {
        success: true,
        reportId: (missingPerson._id as any).toString(),
        message: this.getResponseMessage('report_created', detectedLanguage),
        confidence: extractedInfo.confidence
      };

    } catch (error) {
      console.error('❌ Error processing WhatsApp message:', error);
      return {
        success: false,
        message: this.getResponseMessage('error_occurred', 'en'),
        confidence: 0
      };
    }
  }

  /**
   * Extract information from message text using AI/NLP
   */
  private async extractInformation(text: string, language: string): Promise<any> {
    // This would integrate with OpenAI or other NLP service
    // For now, using basic pattern matching
    
    const patterns = {
      name: /(?:name|नाम|பெயர்|పేరు)\s*[:\-]?\s*([^\n,]+)/i as RegExp,
      age: /(?:age|उम्र|வயது|వయస్సు)\s*[:\-]?\s*(\d+)/i as RegExp,
      gender: /(?:gender|लिंग|பாலினம்|లింగం)\s*[:\-]?\s*(male|female|पुरुष|महिला|ஆண்|பெண்|మగ|అమ్మాయి)/i as RegExp,
      location: /(?:location|स्थान|இடம்|ప్రదేశం)\s*[:\-]?\s*([^\n,]+)/i as RegExp,
      lastSeen: /(?:last seen|last|अंतिम|கடைசி|చివరి)\s*[:\-]?\s*([^\n,]+)/i as RegExp
    } as const;

    const extracted = {
      name: '',
      age: 0,
      gender: 'unknown',
      location: '',
      lastSeen: new Date(),
      description: text,
      clothingColor: 'unknown',
      clothingType: 'unknown',
      height: 'unknown',
      weight: 'unknown',
      hairColor: 'unknown',
      eyeColor: 'unknown',
      isValid: false,
      confidence: 0
    };

    let confidence = 0;
    let validFields = 0;

    // Extract name
    const nameMatch = text.match(patterns.name);
    if (nameMatch) {
      extracted.name = (nameMatch[1] as string).trim();
      confidence += 25;
      validFields++;
    }

    // Extract age
    const ageMatch = text.match(patterns.age);
    if (ageMatch) {
      extracted.age = parseInt(ageMatch[1] as string);
      confidence += 20;
      validFields++;
    }

    // Extract location
    const locationMatch = text.match(patterns.location);
    if (locationMatch) {
      extracted.location = (locationMatch[1] as string).trim();
      confidence += 25;
      validFields++;
    }

    // Basic validation
    if (validFields >= 2) {
      extracted.isValid = true;
      extracted.confidence = Math.min(confidence, 100);
    }

    return extracted;
  }

  /**
   * Detect language from message text
   */
  private detectLanguage(text: string): string {
    // Simple language detection based on common words
    const languagePatterns = {
      hi: /(?:है|का|की|में|से|को|पर|के|हैं|था|थी)/,
      ta: /(?:உள்ளது|இருக்கிறது|செய்து|போகிறது|வருகிறது)/,
      te: /(?:ఉంది|ఉన్న|చేస్తున్న|వెళ్తున్న|వస్తున్న)/,
      mr: /(?:आहे|चा|ची|मध्ये|पासून|ला|वर|चे|आहेत|होता|होती)/,
      bn: /(?:আছে|এর|এর|মধ্যে|থেকে|কে|উপর|এর|আছেন|ছিল|ছিলো)/
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return 'en'; // Default to English
  }

  /**
   * Calculate priority based on extracted information
   */
  private calculatePriority(info: any): 'low' | 'medium' | 'high' | 'critical' {
    let score = 0;
    
    if (info.age && info.age < 18) score += 3; // Child
    if (info.age && info.age > 65) score += 2; // Elderly
    if (info.medicalInfo) score += 2; // Medical condition
    
    if (score >= 5) return 'critical';
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  /**
   * Send confirmation message to user
   */
  private async sendConfirmationMessage(phone: string, reportId: string, language: string): Promise<void> {
    if (!this.client) {
      console.warn('⚠️ Twilio client not available, skipping confirmation message');
      return;
    }

    try {
      const message = this.getResponseMessage('report_created', language);
      
      await this.client.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phone}`
      });

      console.log(`✅ Confirmation message sent to ${phone}`);
    } catch (error) {
      console.error('❌ Failed to send confirmation message:', error);
    }
  }

  /**
   * Get response message in appropriate language
   */
  private getResponseMessage(type: 'report_created' | 'invalid_format' | 'error_occurred', language: string): string {
    const messages: Record<'report_created' | 'invalid_format' | 'error_occurred', Record<string, string>> = {
      report_created: {
        en: 'Thank you! Your missing person report has been received and is being processed. We will contact you soon.',
        hi: 'धन्यवाद! आपकी गुमशुदा व्यक्ति की रिपोर्ट प्राप्त हो गई है और प्रोसेस की जा रही है। हम जल्द ही आपसे संपर्क करेंगे।',
        ta: 'நன்றி! உங்கள் காணாமல் போன நபர் அறிக்கை பெறப்பட்டு செயலாக்கப்படுகிறது. நாங்கள் விரைவில் உங்களை தொடர்பு கொள்வோம்.',
        te: 'ధన్యవాదాలు! మీ కనిపించని వ్యక్తి నివేదిక స్వీకరించబడింది మరియు ప్రాసెస్ చేయబడుతోంది. మేము త్వరలో మిమ్మల్ని సంప్రదిస్తాము.'
      },
      invalid_format: {
        en: 'Please provide the missing person\'s name, age, and last seen location. For example: "Name: John, Age: 25, Location: Mumbai Central"',
        hi: 'कृपया गुमशुदा व्यक्ति का नाम, उम्र और अंतिम देखे जाने का स्थान प्रदान करें। उदाहरण: "नाम: जॉन, उम्र: 25, स्थान: मुंबई सेंट्रल"',
        ta: 'தயவுசெய்து காணாமல் போன நபரின் பெயர், வயது மற்றும் கடைசியாக பார்க்கப்பட்ட இடத்தை வழங்கவும். எடுத்துக்காட்டு: "பெயர்: ஜான், வயது: 25, இடம்: மும்பை சென்ட்ரல்"',
        te: 'దయచేసి కనిపించని వ్యక్తి పేరు, వయస్సు మరియు చివరిగా చూసిన స్థానాన్ని అందించండి. ఉదాహరణ: "పేరు: జాన్, వయస్సు: 25, స్థానం: ముంబై సెంట్రల్"'
      },
      error_occurred: {
        en: 'Sorry, an error occurred while processing your report. Please try again or contact our support team.',
        hi: 'क्षमा करें, आपकी रिपोर्ट को प्रोसेस करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें या हमारी सहायता टीम से संपर्क करें।',
        ta: 'மன்னிக்கவும், உங்கள் அறிக்கையை செயலாக்கும்போது பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது எங்கள் ஆதரவு குழுவை தொடர்பு கொள்ளவும்.',
        te: 'క్షమించండి, మీ నివేదికను ప్రాసెస్ చేస్తున్నప్పుడు లోపం జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మా మద్దతు జట్టాన్ని సంప్రదించండి.'
      }
    };

    return messages[type]?.[language] || messages[type]?.en || 'Message not available';
  }

  /**
   * Get service status
   */
  getStatus(): { connected: boolean; twilio: boolean; blockchain: boolean } {
    return {
      connected: true,
      twilio: !!this.client,
      blockchain: this.blockchainService.getConnectionStatus()
    };
  }
}
