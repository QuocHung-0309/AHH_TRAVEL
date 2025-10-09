export interface Ward {
  _id: string;
  name: string;
  type: 'phường' | 'xã' | 'đặc khu';
  location: {
    type: 'Point';
    coordinates: number[];
  };
}