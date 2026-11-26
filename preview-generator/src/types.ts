export type Industry =
  | "fryzjer"
  | "barber"
  | "paznokcie"
  | "kosmetyczka"
  | "groomer";

export interface ServiceItem {
  name: string;
  price: string;
  duration?: string;
  description?: string;
}

export interface ReviewItem {
  author: string;
  text: string;
  rating: number;
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface BusinessInput {
  name: string;
  industry: Industry | string;
  city: string;
  address: string;
  phone: string;
  hours: OpeningHours[];
  services: ServiceItem[];
  reviews: ReviewItem[];
  tagline?: string;
  about?: string;
  email?: string;
  photos?: string[];
}

export interface GenerateResult {
  slug: string;
  outDir: string;
  files: string[];
}
