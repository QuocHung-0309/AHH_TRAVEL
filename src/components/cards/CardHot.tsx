// components/cards/CardHot.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UsersRound, MessageCircle, Eye } from "lucide-react";

type Stat = { label?: string; value: string | number; icon?: React.ReactNode };

export type CardHotProps = {
  image: string;
  title: string;

  // Giá
  originalPrice?: number | string;
  salePrice?: number;        // nếu backend đã tính sẵn
  discountPercent?: number;  // ví dụ 20 → -20%
  discountAmount?: number;   // giảm theo số tiền

  href?: string;
  stats?: Stat[];            // 3 mục thống kê dưới
};

function formatVND(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  // Bảo đảm luôn hiển thị "VNĐ"
  return `${n.toLocaleString("vi-VN")} VNĐ`;
}

function toNumber(x: number | string | undefined): number | undefined {
  if (typeof x === "number") return x;
  if (typeof x === "string") {
    const num = Number(x.replace(/[^\d]/g, ""));
    return Number.isNaN(num) ? undefined : num;
  }
  return undefined;
}

export default function CardHot({
  image,
  title,
  originalPrice,
  salePrice,
  discountPercent,
  discountAmount,
  href = "#",
  stats = [],
}: CardHotProps) {
  // --- Tính giá còn lại ---
  const originalNum = toNumber(originalPrice);
  let finalSale: number | undefined = salePrice;

  if (finalSale == null && originalNum != null) {
    if (typeof discountPercent === "number") {
      finalSale = Math.max(0, Math.round(originalNum * (1 - discountPercent / 100)));
    } else if (typeof discountAmount === "number") {
      finalSale = Math.max(0, Math.round(originalNum - discountAmount));
    }
  }
  const hasSale = originalNum != null && finalSale != null && finalSale < originalNum;

  // --- Tính % giảm để hiển thị trên ribbon ---
  let percentToShow: number | undefined = discountPercent;
  if (percentToShow == null && originalNum && finalSale != null && finalSale < originalNum) {
    percentToShow = Math.round((1 - finalSale / originalNum) * 100);
  }
  const showRibbon = typeof percentToShow === "number" && percentToShow > 0;

  // --- Stats mặc định ---
  const defaultStats: Stat[] = [
    { label: "Đặt và quan tâm:", value: "74.2M", icon: <UsersRound size={18} /> },
    { value: "984k", icon: <Eye size={18} /> },
    { value: "74.6M", icon: <MessageCircle size={18} /> },
  ];
  const s = (stats.length ? stats : defaultStats).slice(0, 3);

  return (
    <article className="h-full flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-lg">
      {/* Ảnh + ribbon */}
      <div className="relative h-[260px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />

        {showRibbon && (
          <div className="absolute right-3 top-3 z-10">
            <div className="relative">
              <div className="rounded-md bg-amber-400 px-4 py-2 text-center shadow-md">
                <div className="text-[13px] font-medium text-white/95">Giá hôm nay:</div>
                <div className="text-[20px] font-extrabold leading-5 text-white">-{percentToShow}%</div>
              </div>
              {/* “đuôi” ribbon */}
              <div className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[12px] border-l-[10px] border-y-transparent border-l-amber-400" />
            </div>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex-1 p-5 min-w-0">
        <h3 className="mb-2 line-clamp-2 text-[20px] font-extrabold uppercase text-slate-900">
          {title}
        </h3>

        {/* Giá: gọn, không bị wrap lung tung */}
        <div className="mt-2 mb-3 min-w-0">
          <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap md:flex-nowrap">
            <span className="shrink-0 text-slate-500 text-[12px]">Giá gốc:</span>
            <span className="shrink-0 text-[12px] font-semibold text-slate-500 line-through">
              {typeof originalPrice === "string" ? originalPrice : formatVND(originalNum)}
            </span>

            <span aria-hidden className="shrink-0 h-4 w-px bg-slate-300 mx-1" />

            <span className="shrink-0 text-slate-600">Còn lại:</span>
            <span
              className={`shrink-0 font-extrabold text-[15px] ${
                hasSale ? "text-emerald-700" : "text-slate-900"
              }`}
            >
              {hasSale
                ? formatVND(finalSale)
                : (typeof originalPrice === "string" ? originalPrice : formatVND(originalNum))}
            </span>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex items-center rounded-full bg-orange-500 px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
        >
          ĐẶT TOUR
        </Link>
      </div>

      {/* gạch chấm + stats */}
      <div className="mx-5 border-t-2 border-dashed border-sky-200" />
      <div className="px-5 py-3">
        <div className="grid grid-cols-3 items-center text-sky-900">
          {s.map((it, i) => (
            <div key={i} className="flex items-center justify-start gap-2 text-[15px]">
              <span className="text-sky-600">{it.icon}</span>
              <div className="flex items-center gap-1">
                {it.label && <span className="font-semibold text-sky-900">{it.label}</span>}
                <span className="font-bold text-sky-900/80">{it.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
