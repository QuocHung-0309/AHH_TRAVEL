"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin, getOngoingTours, setTourLeader, addTimeline,
  getExpenses, addExpense, updateExpense, deleteExpense,
  type AdminLoginBody, type TimelineEventBody, type Expense
} from "@/lib/admin/adminApi";
export const adminKeys = {
  all: ["admin"] as const,
  ongoing: () => [...adminKeys.all, "ongoing"] as const,
  expenses: (tourId: string) => [...adminKeys.all, "expenses", tourId] as const,
};

export function useAdminLogin(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (body: AdminLoginBody) => adminLogin(body),
    onSuccess: () => onSuccess?.(),
  });
}
export function useOngoingTours() {
  return useQuery({
    queryKey: ["admin","ongoing"],
    queryFn: getOngoingTours,
    staleTime: 30_000,
  });
}

export function useSetLeader(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (leaderId: string | null) => setTourLeader(tourId, leaderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.ongoing() }),
  });
}

export function useAddTimeline(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TimelineEventBody) => addTimeline(tourId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.ongoing() }),
  });
}

export function useExpenses(tourId: string) {
  return useQuery({ queryKey: adminKeys.expenses(tourId), queryFn: () => getExpenses(tourId) });
}
export function useAddExpense(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Expense, "_id">) => addExpense(tourId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.expenses(tourId) }),
  });
}
export function useUpdateExpense(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Expense> }) =>
      updateExpense(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.expenses(tourId) }),
  });
}
export function useDeleteExpense(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.expenses(tourId) }),
  });
}
