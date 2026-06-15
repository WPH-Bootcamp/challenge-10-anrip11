export interface Restaurant {
  id: string | number;
  name: string;
  star?: number; // Menggunakan star
  place?: string; // Menggunakan place
  images?: string[]; // Array of strings untuk kumpulan banner
  logo?: string;
  category?: string;
  isRecommended?: boolean;
  isBestSeller?: boolean;
  deliveryTime?: number;
  reviewCount?: number;
  menuCount?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface RestoResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
}

export interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

export interface ReviewItem {
  id: string | number;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

// Gabungkan data dasar Restaurant dengan arrays menus & reviews
export interface RestaurantDetail extends Restaurant {
  menus?: MenuItem[];
  reviews?: ReviewItem[];
}
