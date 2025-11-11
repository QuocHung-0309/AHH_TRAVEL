import axiosInstance from "@/lib/axiosInstance";

export async function adminListBookings(params: {
  tourId?: string;
  status?: "p" | "c" | "x" | "f";
  deposit?: "paid" | "unpaid";
  page?: number; limit?: number;
}) {
  const { data } = await axiosInstance.get("/admin/bookings", { params });
  return data;
}

export async function adminConfirmTour(tourId: string) {
  const { data } = await axiosInstance.put(`/admin/tours/${tourId}/confirm`);
  return data;
}

export async function adminMarkPaid(code: string, payload: { amount: number; ref?: string }) {
  const { data } = await axiosInstance.post(`/admin/bookings/${encodeURIComponent(code)}/mark-paid`, payload);
  return data;
}
