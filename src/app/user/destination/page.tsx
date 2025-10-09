
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { destinations, type Destination } from "@/app/assets/data/destinations";
import CardHot, { type CardHotProps } from "@/components/cards/CardHot";

// --- Featured data for CardHot ---
const featured: CardHotProps[] = [
  {
    title: "TOUR ĐỊA ĐẠO CỦ CHI",
    originalPrice: "350.000VNĐ",
    image: "/hot1.jpg",
    stats: [
      { label: "Đặt & quan tâm", value: "Còn 3 chỗ", icon: <></> },
      { label: "", value: "6M", icon: <></> },
      { label: "", value: "57M", icon: <></> },
      { label: "", value: "53.5M", icon: <></> },
    ],
  },
  { title: "TOUR 1 NGÀY MỸ THO - BẾN TRE", originalPrice: "480.000VNĐ", image: "/hot1.jpg" },
  { title: "TOUR 2N1Đ MỸ THO - BẾN TRE - CẦN THƠ", originalPrice: "1.550.000VNĐ", image: "/hot1.jpg" },
  { title: "TOUR 3N2Đ CẦN THƠ - ĐẤT MŨI CÀ MAU", originalPrice: "2.890.000VNĐ", image: "/hot1.jpg" },
  { title: "TOUR NÚI BÀ ĐEN - 1 NGÀY", originalPrice: "1.150.000VNĐ", image: "/hot1.jpg" },
  { title: "TOUR 4N3Đ MIỀN TÂY FULL", originalPrice: "4.180.000VNĐ", image: "/hot1.jpg" },
];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const featuredWithHref = featured.map((t, idx) => ({
  ...t,
  href: `/user/destination/${slugify(t.title)}/${(t as any).id ?? idx + 1}`,
}));



// --- Local card (tránh lệch props với component khác) ---
function DestinationSimpleCard({ d }: { d: Destination }) {
  const href =
    (d as any).href ??
    (d as any).slug
      ? `/destination/${(d as any).slug}`
      : `/destination/${encodeURIComponent(String(d.name ?? "diem-den"))}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={(d as any).image ?? (d as any).cover ?? "/placeholder.jpg"}
          alt={String(d.name ?? "Điểm đến")}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
        {d.rating != null && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-800 shadow">
            ⭐ {d.rating.toFixed?.(1) ?? d.rating}
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
          {d.name ?? "Điểm đến"}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-600">
          {d.subtitle ?? d.location ?? "Khám phá cảnh đẹp & trải nghiệm địa phương"}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="i-lucide-map-pin h-4 w-4" aria-hidden />
            {d.location ?? "Việt Nam"}
          </span>
          {d.reviewCount != null && (
            <span className="inline-flex items-center gap-1">
              <span className="i-lucide-message-square h-4 w-4" aria-hidden />
              {d.reviewCount.toLocaleString?.("vi-VN") ?? d.reviewCount} đánh giá
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DestinationPage() {
  // Không dùng bất kỳ filter/sort nào – tập trung vào trải nghiệm khám phá

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Decor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-[var(--primary,#16a34a)]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-8 translate-y-8 rounded-full bg-emerald-100/50 blur-2xl" />
      </div>

      {/* Hero */}
      <header className="mx-auto w-[92%] max-w-6xl pb-4 pt-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-700/80">AHH travel</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Khám phá & Đặt tour nhanh chóng
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Tuyển chọn điểm đến chất lượng, lịch khởi hành linh hoạt, đội ngũ hướng dẫn tận tâm.
              Lướt xuống để xem những gợi ý nổi bật và tất cả điểm đến.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="#featured"
              className="rounded-xl bg-[var(--primary,#16a34a)] px-4 py-2 text-white shadow-sm transition hover:shadow"
            >
              Xem nổi bật
            </Link>
            <Link
              href="#all"
              className="rounded-xl border px-4 py-2 text-gray-700 transition hover:bg-gray-50"
            >
              Tất cả điểm đến
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[92%] max-w-6xl pb-12">
        {/* Featured */}
        <section id="featured" className="mt-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Bộ sưu tập nổi bật</h2>
            <Link href="/tour" className="text-sm text-[var(--primary,#16a34a)] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {featuredWithHref.map((t) => (
              <CardHot key={t.title} {...t} />
            ))}
          </div>
        </section>

        {/* All destinations */}
        <section id="all" className="mt-12">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Tất cả điểm đến</h2>
            <p className="mt-1 text-sm text-gray-600">
              {Array.isArray(destinations) ? destinations.length : 0} địa điểm đang mở bán/đề xuất
            </p>
          </div>

          {Array.isArray(destinations) && destinations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
              {destinations.map((d) => (
                <DestinationSimpleCard key={(d as any).id ?? (d as any).slug ?? d.name} d={d} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
              Hiện chưa có dữ liệu điểm đến. Vui lòng thêm vào <code>assets/data/destinations</code>.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
