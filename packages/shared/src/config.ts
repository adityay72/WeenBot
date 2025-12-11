/**
 * Shared Configuration
 * 
 * This file contains all configurable values for the entire project.
 * Change values here instead of hardcoding them throughout the codebase.
 */

// Company Information

export const COMPANY_INFO = {
  name: 'Winspiration Energy & Engineering Pvt. Ltd.',
  tagline: 'Empowering Engineering Excellence',
  founded: 2015,
  location: 'Thane (Mumbai), India',
  
  specialties: [
    'Complex Piping Stress Analysis (Static/Dynamic)',
    'Offshore & Onshore Plant Design (FPSO, Refineries)',
    'Green Hydrogen & Bio-Refinery Projects',
    'Vibration Analysis & Troubleshooting',
    'Sustainable Engineering Solutions',
  ],
  
  contact: {
    email: 'info@ween.co.in',
    emailAlt: 'pravin@ween.co.in',
    phone: '+91 84079 79009',
    phoneAlt: '+91 93561 16419',
    website: 'https://ween.co.in',
  },
  
  certifications: [
    'ISO 9001:2015 Certified',
  ],
  
  uniqueValue: 'We are an ISO 9001:2015 certified engineering company dedicated to "Empowering Engineering Excellence." Our approach combines technical innovation with a strong commitment to environmental sustainability and "Make in India" initiatives, ensuring cost-effective and ecologically viable solutions.',
};

// Services Offered

export const SERVICES = [
  'Industrial Piping Engineering',
  'Piping Stress Analysis',
  'Plant Layout Design & 3D Modeling',
  'Pipe Support Design',
  'Project Management Services',
];

export const SERVICES_DETAILED = [
  {
    name: 'Industrial Piping Engineering',
    description: 'Comprehensive piping solutions including plot plan development, equipment layout, and piping material specifications.',
  },
  {
    name: 'Piping Stress Analysis',
    description: 'Static and dynamic stress analysis for critical systems like compressors, pumps, reactors, and steam turbines to ensure safety and reliability.',
  },
  {
    name: 'Plant Layout Design & 3D Modeling',
    description: 'Advanced 3D modeling and design detailing for industrial plants, ensuring optimized layout and clash detection.',
  },
  {
    name: 'Pipe Support Design',
    description: 'Specialized design and Finite Element Analysis (FEA) for pipe supports to maintain structural integrity under various loads.',
  },
  {
    name: 'Project Management Services',
    description: 'End-to-end project conceptual engineering and management to deliver projects on time and within optimum costs.',
  },
];

// Portfolio Projects

export const PROJECTS = [
  {
    name: 'Offshore FPSO Piping (North Sea)',
    url: 'https://ween.co.in/project/offshore-north-sea-fpso-piping-glycol-dehy-package-for-shell-uk-Limited',
    description: 'Piping design for the Penguin field, Shetland, UK (Glycol Dehy package) for Shell UK Limited.',
    industry: 'Oil & Gas / Offshore',
  },
  {
    name: 'Flue-Gas Desulfurization (FGD)',
    url: 'https://ween.co.in/project/flue-gas-desulfurization-fgd',
    description: 'Engineering solutions for emission control systems at Singareni, India.',
    industry: 'Environmental / Power',
  },
  {
    name: 'Waste Heat Recovery',
    url: 'https://ween.co.in/project/waste-heat-recovery-in-piping-stress',
    description: 'Piping stress analysis for waste heat recovery systems in Basrah.',
    industry: 'Power / Energy',
  },
  {
    name: 'GBARAN Single Well HPHT Skid',
    url: 'https://ween.co.in/project/gbaran-single-well-hpht-skid',
    description: 'Specialized high-pressure high-temperature skid design for a project in Yenagoa, Nigeria.',
    industry: 'Oil & Gas',
  },
  {
    name: 'Catalytic Dewaxing Units (CDWU & PPU)',
    url: 'https://ween.co.in/project/catalytic-dewaxing-units-cdwu-and-ppu-for-iocl',
    description: 'Project execution for Indian Oil Corporation Limited (IOCL) in India.',
    industry: 'Petrochemical',
  },
];

// Industries Served

export const INDUSTRIES = [
  'Oil & Gas',
  'Offshore Platforms',
  'Petrochemicals',
  'Power Plants',
  'Pharmaceutical',
  'Environmental Plants',
];

// WhatsApp Configuration

export const WHATSAPP_CONFIG = {
  useSandbox: true,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token_here',
  apiVersion: 'v21.0',
  
  get apiUrl() {
    return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  },
};

// Server Configuration

export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  
  get isProduction() {
    return this.environment === 'production';
  },
  
  get isDevelopment() {
    return this.environment === 'development';
  },
};

// AI Configuration

export const AI_CONFIG = {
  provider: 'openai',
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  systemPrompt: `You are a helpful assistant for ${COMPANY_INFO.name}. Use the provided tools to answer questions about services, projects, and company information. Be friendly, professional, and concise.`,
};

// Logging Configuration

export const LOGGING = {
  verbose: SERVER_CONFIG.isDevelopment,
  colors: {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m',
  },
};

// Helper Functions

export function getConfig(key: string, fallback: any = null): any {
  return process.env[key] || fallback;
}

export function validateConfig(): { valid: boolean; missing: string[] } {
  const required = [
    'OPENAI_API_KEY',
  ];
  
  const missing: string[] = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
