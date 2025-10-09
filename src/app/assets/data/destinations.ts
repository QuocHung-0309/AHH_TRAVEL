export interface Destination {
  _id: string;
  name: string;
  rating: number;
  reviewCount: number;
  serviceCount: number;
  status: string;
  category: string;
  location: string;
  image?: string;       // ảnh đơn (ví dụ từ DB hoặc local)
  images?: string[];    // nhiều ảnh từ DB
  description: string;
  distance: string;
  gallery: string[];
  lat: number;
  lng: number;
  avgRating: number;    // điểm đánh giá trung bình
}


export const destinations: Destination[] = [
  ];
  