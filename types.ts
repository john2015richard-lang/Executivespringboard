
export interface Speaker {
  name: string;
  title: string;
  image: string;
  label: string; // e.g., "HOST" or "SPECIAL GUEST"
  bio?: string;
  badgeBg?: string;
  badgeColor?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  required: boolean;
}

export interface Registration {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  formData: Record<string, string>; // Stores dynamic fields
  timestamp: string;
}

export interface WebinarData {
  id: string;
  topLabel: string;
  title: string;
  titleFontSize: number;
  subtitle: string;
  subtitleFontSize: number;
  date: string;
  timeRange: string;
  duration: string;
  formatType: string;
  registrations: number;
  ctaText: string;
  ctaLink?: string;
  ctaFontSize: number;
  speakers: Speaker[];
  logoImage: string;
  logoHeight: number;
  themeColor: string;
  isActive: boolean;
  zoomLink?: string;
  formFields: FormField[];
  attendees?: Registration[];
}

export type View = 'LANDING' | 'LOGIN' | 'ADMIN';
