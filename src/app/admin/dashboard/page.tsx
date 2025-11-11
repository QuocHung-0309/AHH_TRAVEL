"use client";

import Link from "next/link";
import { useOngoingTours } from "@/app/admin/hooks/useAdmin";

export default function AdminDashboard() {
  const { data, isLoading } = useOngoingTours();

  return (
    <div className="mx-auto w-[92%] max-w-6xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Tours đang hoạt động</h1>
      {isLoading ? (
        <div className="rounded border bg-white p-4 shadow">Đang tải…</div>
      ) : data?.length === 0 ? (
        <div className="rounded border bg-white p-4 shadow">
          Chưa có tour nào
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left">Tour</th>
                <th className="px-4 py-2 text-left">Khởi hành</th>
                <th className="px-4 py-2 text-left">Leader</th>
                <th className="px-4 py-2 text-left">Khách</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((t: any) => (
                <tr key={t._id} className="border-t">
                  <td className="px-4 py-2">{t.title}</td>
                  <td className="px-4 py-2">
                    {t.startDate
                      ? new Date(t.startDate).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{t.leader?.name ?? "Chưa gán"}</td>
                  <td className="px-4 py-2">
                    {t.current_guests ?? 0}/{t.quantity ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      className="rounded bg-emerald-600 px-3 py-1.5 text-white"
                      href={`/admin/tours/${t._id}`}
                    >
                      Quản trị
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
