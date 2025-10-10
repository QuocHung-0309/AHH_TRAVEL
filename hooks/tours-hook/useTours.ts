// hooks/tours-hook/useTours.ts
import { useQuery } from "@tanstack/react-query";
import { getTours, type ToursResponse } from "../../apis/tours/tour";

// v5: dùng placeholderData để “giữ dữ liệu cũ” khi chuyển trang
export const useGetTours = (page = 1, limit = 9) =>
  useQuery<ToursResponse, Error, ToursResponse, readonly [string, number, number]>({
    queryKey: ["getTours", page, limit] as const,
    queryFn: () => getTours(page, limit),
    placeholderData: (prev) => prev, // tương đương keepPreviousData
  });
