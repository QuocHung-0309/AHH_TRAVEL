"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import CardHot from "@/components/cards/CardHot";
import { useGetTours } from "#/hooks/tours-hook/useTours";

/* Helpers */
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    // @ts-ignore unicode regex
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
const titleFromSlug = (s?: string) => (s ? s.replace(/-/g, " ") : "");
const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("vi-VN") : "");

// % giảm nếu backend chưa trả
function computePercent(t: any): number | undefined {
  if (typeof t.discountPercent === "number" && t.discountPercent > 0) return Math.round(t.discountPercent);
  const origin =
    typeof t.priceAdult === "number"
      ? t.priceAdult
      : typeof t.priceAdult === "string"
      ? Number(t.priceAdult.replace(/[^\d]/g, ""))
      : undefined;
  if (!origin || origin <= 0) return undefined;
  let sale = t.salePrice;
  if (sale == null && typeof t.discountAmount === "number") sale = Math.max(0, origin - t.discountAmount);
  if (typeof sale === "number" && sale < origin) return Math.round((1 - sale / origin) * 100);
  return undefined;
}

const PAGE_SIZE = 9;
const DEFAULT_PERCENT = 0;

export default function DestinationPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetTours(page, PAGE_SIZE);
  const tours = data?.data ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageNumbers = useMemo(() => {
    const arr: (number | "...")[] = [];
    const win = 1;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
      return arr;
    }
    arr.push(1);
    if (currentPage - win > 2) arr.push("...");
    for (let i = Math.max(2, currentPage - win); i <= Math.min(totalPages - 1, currentPage + win); i++) arr.push(i);
    if (currentPage + win < totalPages - 1) arr.push("...");
    arr.push(totalPages);
    return arr;
  }, [currentPage, totalPages]);

  return (
    <div className="relative min-h-screen">
      {/* ===== Clean background (no grid, no blue→orange gradient) ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* base: trắng với một radial emerald rất nhẹ */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(16,185,129,0.10),transparent_60%)]" />
        {/* optional: một blob xanh cực nhẹ để tạo chiều sâu (có thể xoá nếu muốn hoàn toàn phẳng) */}
        <div className="absolute -top-24 -left-24 h-[24rem] w-[24rem] rounded-full bg-emerald-200/25 blur-3xl" />
      </div>

      {/* ===== Hero ===== */}
      <header className="mx-auto w-[92%] max-w-6xl pb-4 pt-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-700/80">AHH Travel</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Danh sách tour</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Chọn tour ưng ý và đặt ngay.</p>
          </div>
          <Link
            href="#list"
            className="rounded-2xl bg-[var(--primary,#16a34a)] px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition hover:brightness-110"
          >
            Xem tour
          </Link>
        </div>
      </header>

      {/* ===== Content ===== */}
      <main id="list" className="mx-auto w-[92%] max-w-6xl pb-14">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Bộ sưu tập nổi bật</h2>
          <span className="text-sm text-slate-600">
            Trang {currentPage}/{totalPages} · Tổng {total.toLocaleString("vi-VN")} tour
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-6 shadow-sm backdrop-blur">
            Đang tải…
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-6 shadow-sm backdrop-blur">
            Không tải được dữ liệu tour.
          </div>
        ) : tours.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-6 shadow-sm backdrop-blur">Chưa có tour.</div>
        ) : (
          <>
            <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t: any) => {
                const percent = computePercent(t) ?? DEFAULT_PERCENT;
                return (
                  <CardHot
                    key={t._id}
                    title={t.title}
                    image={t.image ?? t.cover ?? "/hot1.jpg"}
                    originalPrice={t.priceAdult}
                    salePrice={t.salePrice}
                    discountPercent={percent}
                    discountAmount={t.discountAmount}
                    href={`/user/destination/${t.destinationSlug ?? slugify(t.title)}/${t._id}`}
                    stats={[
                      { value: `Còn ${t.quantity ?? 0} chỗ` },
                      { value: t.time ?? "—" },
                      { value: titleFromSlug(t.destinationSlug) || fmtDate(t.startDate) },
                    ]}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </button>

              {pageNumbers.map((n, idx) =>
                n === "..." ? (
                  <span key={`dots-${idx}`} className="select-none px-2 text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`rounded-2xl px-3 py-2 text-sm transition ${
                      n === currentPage
                        ? "bg-[var(--primary,#16a34a)] text-white shadow"
                        : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

              <button
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-50"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
