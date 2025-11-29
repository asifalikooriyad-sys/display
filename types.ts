
export interface ServiceDetails {
  requirements: string[];
  processingTime: string;
  additionalInfo?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name
  imageKeyword: string;
  customImage?: string; // Optional custom image URL
  background?: string; // Specific high-res background image
  features: string[];
  details?: ServiceDetails; // Added details property
  type: 'standard' | 'golden' | 'kids' | 'hero' | 'partners' | 'contact' | 'reviews';
  videoUrl?: string; // Optional video
}

export interface AppSettings {
  theme: 'wood' | 'galaxy' | 'nebula' | 'flow' | 'custom';
  customColor: string; // Hex/RGB code
  slideDuration: number; // in seconds
  showTicker: boolean;
  tickerText: string;
  tickerSpeed: number; // Animation duration in seconds (lower is faster)
  
  companyName: string;
  companyNameAr: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  location: string;
  logo: string | null; // Base64 string of the uploaded logo
  
  showDate: boolean;
  clockFormat: '12h' | '24h';
  overlayOpacity: number; // 0.1 to 0.9
  
  transitionEffect: 'fade' | 'slide' | 'zoom';
  navDockMode: 'auto' | 'visible' | 'hidden';
  
  hideCursor: boolean;
  showProgressBar: boolean;
  slideShuffle: boolean;
  
  // NEW PERFORMANCE & LAYOUT OPTIONS
  enableParticles: boolean;
  enableBlurEffects: boolean;
  showHeroCTA: boolean;
  
  enabledServices: string[]; // IDs of enabled slides

  // Content Management
  contentOverrides: Record<string, { background?: string; customImage?: string; videoUrl?: string }>;
}

export interface ThemeConfig {
  name: string;
  bgClass: string;
  accentClass: string;
}

export enum ChatSender {
  USER = 'user',
  BOT = 'bot'
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: Date;
}

export interface SlideProps {
  data: ServiceItem;
  theme: ThemeConfig;
  customColor?: string;
  onNavigate: (serviceId: string) => void;
  activeServices: ServiceItem[];
  settings?: AppSettings;
}