'use client';

import React from 'react';
import CardHot, { CardHotProps } from '@/components/cards/CardHot';

const data: CardHotProps[] = [
  {
    title: 'TOUR ĐỊA ĐẠO CỦ CHI',
    originalPrice: '350.000VNĐ',
    image: '/hot1.jpg',
    stats: [
      { label: 'Đặt & quan tâm', value: '56.6M', icon: <></> },
      { label: '', value: '6M',    icon: <></> },
      { label: '', value: '57M',   icon: <></> },
      { label: '', value: '53.5M', icon: <></> },
    ],
  },
  {
    title: 'TOUR 1 NGÀY MỸ THO - BẾN TRE',
    originalPrice: '480.000VNĐ',
    image: '/hot1.jpg',
  },
  {
    title: 'TOUR 2 NGÀY 1 ĐÊM MỸ THO - BẾN TRE - CẦN THƠ',
    originalPrice: '1.550.000VNĐ',
    image: '/hot1.jpg',
  },
  {
    title: 'TOUR 3 NGÀY 2 ĐÊM CẦN THƠ - ĐẤT MŨI CÀ MAU',
    originalPrice: '2.890.000VNĐ',
    image: '/hot1.jpg',
  },
  {
    title: 'TOUR NÚI BÀ ĐEN - 1 NGÀY',
    originalPrice: '1.150.000VNĐ',
    image: '/hot1.jpg',
  },
  {
    title: 'TOUR 4 NGÀY 3 ĐÊM MỸ THO - BẾN TRE - CHÂU ĐỐC - CẦN THƠ - CÀ MAU',
    originalPrice: '4.180.000VNĐ',
    image: '/hot1.jpg',
  },
];

const HotSearchSection = () => {
  return (
    <section className="px-4 pb-12 pt-6">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-center text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#1b4c75] tracking-wide mb-5">
          TOUR CHÍNH
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data.map((t) => (
            <CardHot key={t.title} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotSearchSection;
