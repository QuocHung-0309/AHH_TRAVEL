'use client';

import React from 'react';
import DestinationCard from '@/components/cards/DestinationCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';

const tours = [
  { title: 'TOUR ĐỊA ĐẠO CỦ CHI', duration: 'NỬA NGÀY', price: '350.000VNĐ', image: '/hot1.jpg' },
  { title: 'TOUR VŨNG TÀU', duration: '1 NGÀY', price: '1.050.000VNĐ', image: '/hot1.jpg' },
  { title: 'MỸ THO - BẾN TRE - CẦN THƠ', duration: '2 NGÀY 1 ĐÊM', price: '1.550.000VNĐ', image: '/hot1.jpg' },
  { title: 'ĐÀ NẴNG - HỘI AN', duration: '1 NGÀY', price: '480.000VNĐ', image: '/hot1.jpg' },
  { title: 'TOUR TÂY BẮC', duration: '1 NGÀY', price: '480.000VNĐ', image: '/hot1.jpg' },
  { title: 'ĐÀ LẠT', duration: '1 NGÀY', price: '480.000VNĐ', image: '/hot1.jpg' },
];

const HotDestinations = () => {
  return (
    <section className="py-14 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-[#144d7e] mb-8">
          TOUR NỔI BẬT TRONG THÁNG
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          grabCursor
          spaceBetween={16}
          breakpoints={{
            0:   { slidesPerView: 1.1, spaceBetween: 12 },
            640: { slidesPerView: 2,   spaceBetween: 16 },
            1024:{ slidesPerView: 3,   spaceBetween: 18 },
            1280:{ slidesPerView: 4,   spaceBetween: 20 },
          }}
          className="!pb-8"
        >
          {tours.map((t) => (
            <SwiperSlide key={t.title} className="!h-auto">
              <DestinationCard {...t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HotDestinations;
