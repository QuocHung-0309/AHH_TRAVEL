import axiosInstance from "@/lib/axiosInstance"; // dùng cùng instance bạn đang có
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const STORAGE_KEY = "admin_access_token";
export const setAdminToken = (t: string | null) => {
  if (!t) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, t);
};
export const getAdminToken = () => (typeof window !== "undefined"
  ? localStorage.getItem(STORAGE_KEY)
  : null);

export const adminApi = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  timeout: 15_000,
});

adminApi.interceptors.request.use((cfg) => {
  const token = getAdminToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});
export type AdminLoginBody = { identifier: string; password: string };
export type AdminLoginResp = { accessToken: string; admin: { id: string; name: string } };

export async function adminLogin(body: AdminLoginBody) {
  const { data } = await axiosInstance.post<AdminLoginResp>("/admin/login", body);
  return data;
}

/** Tours đang/chuẩn bị chạy cho dashboard */
export async function getOngoingTours() {
  const { data } = await axiosInstance.get<any[]>("/admin/tours/ongoing");
  return data ?? [];
}

/** Gán/cập nhật leader cho tour */
export async function setTourLeader(tourId: string, leaderId: string | null) {
  const { data } = await axiosInstance.patch(`/admin/tours/${tourId}/leader`, { leaderId });
  return data;
}

/** Thêm sự kiện timeline */
export type TimelineEventBody = {
  type: "departed" | "arrived" | "checkpoint" | "note" | "finished";
  note?: string;
};
export async function addTimeline(tourId: string, body: TimelineEventBody) {
  const { data } = await axiosInstance.post(`/admin/tours/${tourId}/timeline`, body);
  return data;
}

/** Chi phí tour */
export type Expense = {
  _id: string;
  title: string;
  amount: number;
  occurredAt: string;
  note?: string;
};

export async function getExpenses(tourId: string) {
  const { data } = await axiosInstance.get<Expense[]>(`/admin/tours/${tourId}/expenses`);
  return data ?? [];
}
export async function addExpense(tourId: string, payload: Omit<Expense, "_id">) {
  const { data } = await axiosInstance.post(`/admin/tours/${tourId}/expenses`, payload);
  return data;
}
export async function updateExpense(expenseId: string, patch: Partial<Expense>) {
  const { data } = await axiosInstance.patch(`/admin/expenses/${expenseId}`, patch);
  return data;
}
export async function deleteExpense(expenseId: string) {
  const { data } = await axiosInstance.delete(`/admin/expenses/${expenseId}`);
  return data;
}
