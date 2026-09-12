export interface Listing {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  imageUrl: string;
  beds: number;
  baths: number;
  garage: number;
  sqft: number;
  type: 'residential' | 'condo' | 'townhome' | 'commercial';
  status: 'for-sale' | 'for-rent' | 'for-lease' | 'sold';
  description: string;
  features: string[];
  yearBuilt: number;
  images?: string[];
  isLiveMLS?: boolean;
}

export interface EvaluationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  urgency: 'immediate' | '1-3-months' | '3-6-months' | 'just-curious';
  additionalInfo?: string;
}

export interface AreaAlertRequest {
  name: string;
  email: string;
  phone: string;
  cities: string[];
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
