'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import {
  AiOutlineEye,
  AiOutlineLike,
  AiOutlineShoppingCart,
  AiOutlineComment,
} from 'react-icons/ai';

type Stat = { label: string; value: string; icon: React.ReactNode };

export type CardHotProps = {
  image: string;
  title: string;
  originalPrice: string; // Ví dụ: "1.550.000VNĐ"
  href?: string;
  stats?: Stat[]; // 4 mục thống kê
};

const CardHot: React.FC<CardHotProps> = ({
  image,
  title,
  originalPrice,
  href = '#',
  stats = [],
}) => {
  // fallback 4 mục nếu bạn chưa truyền vào
  const defaultStats: Stat[] = [
    { label: 'Đặt & quan tâm', value: '56.6M', icon: <AiOutlineShoppingCart /> },
    { label: '', value: '6M', icon: <AiOutlineLike /> },
    { label: '', value: '57M', icon: <AiOutlineComment /> },
    { label: '', value: '53.5M', icon: <AiOutlineEye /> },
  ];

  const finalStats = stats.length ? stats : defaultStats;

  return (
    <article
      className="
        group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200
        shadow-sm hover:shadow-lg transition hover:-translate-y-[2px]
      "
    >
      {/* Ảnh */}
      <div className="relative w-full h-[220px] sm:h-[240px] rounded-t-2xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* Nội dung */}
      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-800 text-[15px] sm:text-[16px]">
          {title}
        </h3>

        <p className="mt-1 text-[13px] text-slate-500">
          <span className="font-medium">Giá gốc:</span> {originalPrice}
        </p>

        <div className="mt-2">
          <Link
            href={href}
            className="
              inline-flex items-center rounded-md bg-orange-500 px-3 py-1.5
              text-white text-[12px] font-semibold shadow hover:bg-orange-600
              focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70
            "
          >
            XEM CHI TIẾT
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-slate-200 px-3 sm:px-4 py-2.5">
        <div className="grid grid-cols-4 gap-2 text-[12px] text-slate-600">
          {finalStats.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-sky-600">{s.icon}</span>
              <span className="font-medium text-slate-700">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* viền nhấn xanh nhạt khi hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-sky-200 group-hover:ring-2 transition" />
    </article>
  );
  
};

export default CardHot;
