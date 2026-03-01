export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: 'wigs' | 'bundles' | 'frontal' | 'closure' | 'revamp';
  description: string;
  images: string[];
  stockStatus: 'inStock' | 'outOfStock';
  reviews: Review[];
  createdAt: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  total: number;
  pickupDate: string;
  paymentProof?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  hairType: string;
  preferredDate: string;
  notes?: string;
  createdAt: string;
}

export type Page = 'home' | 'shop' | 'gallery' | 'essence' | 'book' | 'admin' | 'cart' | 'product';

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'Sparkles' },
  { id: 'wigs', label: 'Wigs', icon: 'Crown' },
  { id: 'bundles', label: 'Bundles', icon: 'Layers' },
  { id: 'frontal', label: 'Frontal', icon: 'Scan' },
  { id: 'closure', label: 'Closure', icon: 'Square' },
  { id: 'revamp', label: 'Revamp', icon: 'RefreshCw' },
] as const;
