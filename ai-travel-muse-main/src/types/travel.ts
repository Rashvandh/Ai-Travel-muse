export interface AIDestination {
  id: number;
  name: string;
  location: string;
  description: string;
  budget: string;
  bestTime: string;
  rating: number;
  imageUrl: string;
  nearbyPlaces: AINearbyPlace[];
  hotels: AIHotel[];
  personalizedReason: string;
}

export interface AINearbyPlace {
  name: string;
  distance: string;
  rating: number;
  type: string;
  imageUrl: string;
}

export interface AIHotel {
  name: string;
  stars: number;
  price: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
  ac: boolean;
  wifi: boolean;
  familyFriendly: boolean;
}

export interface FormData {
  preference: string;
  state?: string;
  budget: number;
  duration: string;
  people: string;
  month: string;
  interests: string[];
}
