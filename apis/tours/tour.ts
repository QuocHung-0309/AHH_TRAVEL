// apis/tours/tour.ts
import axios from "#/apis/api-constant";

/** Kiểu tour danh sách (đang dùng ở list) */
export type Tour = {
  _id: string | number;
  title: string;
  image?: string;
  cover?: string;
  destinationSlug?: string;
  priceAdult?: number | string;
  priceChild?: number | string;
  salePrice?: number;
  discountPercent?: number;
  discountAmount?: number;
  quantity?: number | string;
  time?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
};

/** Kiểu chi tiết tour (theo swagger bạn gửi) */
export type TourDetail = Tour & {
  tourId?: string | number;               // backend có thể trả tourId
  description?: string;
  images?: string[];                      // nếu backend có mảng ảnh
  itinerary?: Array<{
    day: number;                          // 1,2,3...
    title: string;
    content: string;                      // mô tả lịch trình ngày
    image?: string;
  }>;
};

export type ToursResponse = {
  data: Tour[];
  total: number;
  page: number;
  limit: number;
};

export const getTours = async (page = 1, limit = 9): Promise<ToursResponse> => {
  const res = await axios.get<ToursResponse>("/api/tours", { params: { page, limit } });
  return res.data;
};

/** Lấy chi tiết tour theo id */
export const getTourById = async (id: string | number): Promise<TourDetail> => {
  const res = await axios.get<TourDetail>(`/api/tours/${id}`);
  return res.data;
};
