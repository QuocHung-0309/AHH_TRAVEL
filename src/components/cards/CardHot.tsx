// components/cards/CardHot.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  UsersRound,
  MessageCircle,
  Eye,
} from "lucide-react"; // gọn & ổn định cho App Router

type Stat = { label?: string; value: string | number; icon?: React.ReactNode };

export type CardHotProps = {
  image: string;
  title: string;

  // giá
  originalPrice?: number | string;
  salePrice?: number;          // nếu backend đã tính sẵn
  discountPercent?: number;    // ví dụ 20 nghĩa là -20%
  discountAmount?: number;     // giảm theo số tiền

  href?: string;
  stats?: Stat[];              // sẽ render hàng dưới (3 mục)
};

function formatVND(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/\s?₫$/, "VNĐ"); // theo ảnh là "VNĐ"
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
  // Tính giá còn lại
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

  // Stats mặc định theo ảnh
  const defaultStats: Stat[] = [
    { label: "Đặt và quan tâm:", value: "74.2M", icon: <UsersRound size={18} /> },
    { value: "984k", icon: <Eye size={18} /> },
    { value: "74.6M", icon: <MessageCircle size={18} /> },
  ];
  const s = (stats.length ? stats : defaultStats).slice(0, 3);

  return (
    <article className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-lg">
      {/* Ảnh + ribbon */}
      <div className="relative h-[260px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />
        {/* ribbon - góc phải */}
        {typeof discountPercent === "number" && discountPercent > 0 && (
          <div className="absolute right-3 top-3">
            <div className="relative">
              <div className="rounded-md bg-amber-400 px-4 py-2 text-center shadow-md">
                <div className="text-[13px] font-medium text-white/95">Giá hôm nay:</div>
                <div className="text-[20px] font-extrabold leading-5 text-white">
                  -{discountPercent}%
                </div>
              </div>
              {/* cái “đuôi” ribbon */}
              <div className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[12px] border-l-[10px] border-y-transparent border-l-amber-400" />
            </div>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-5">
        <h3 className="mb-2 line-clamp-2 text-[20px] font-extrabold uppercase text-slate-900">
          {title}
        </h3>

        <div className="mb-3 text-[15px]">
          <span className="text-slate-600">Giá gốc: </span>
          <span className="font-extrabold text-slate-900">
            {typeof originalPrice === "string" ? originalPrice : formatVND(originalNum)}
          </span>

          <span className="mx-2 text-slate-400">|</span>

          <span className="text-slate-600">Còn: </span>
          <span className="font-extrabold text-slate-900">
            {hasSale ? formatVND(finalSale) : (typeof originalPrice === "string" ? originalPrice : formatVND(originalNum))}
          </span>
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
