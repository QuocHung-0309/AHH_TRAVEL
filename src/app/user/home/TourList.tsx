'use client';

import React from 'react';
import CardTourList from '@/components/cards/CardTourList';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';

// helper: biến title thành slug an toàn
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    // @ts-ignore unicode regex
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const data = [
  { title: 'PHAN THIẾT', total: 4, image: '/hot1.jpg' },
  { title: 'ĐÀ LẠT', total: 2, image: '/hot1.jpg' },
  { title: 'ĐÀ NẴNG', total: 2, image: '/hot1.jpg' },
  { title: 'NHA TRANG', total: 2, image: '/hot1.jpg' },
  { title: 'TOUR MÙA HÈ', total: 1, image: '/hot1.jpg' },
  { title: 'PHAN THIẾT', total: 4, image: '/hot1.jpg' },
  { title: 'ĐÀ LẠT', total: 2, image: '/hot1.jpg' },
  { title: 'ĐÀ NẴNG', total: 2, image: '/hot1.jpg' },
  { title: 'NHA TRANG', total: 2, image: '/hot1.jpg' },
  { title: 'TOUR MÙA HÈ', total: 1, image: '/hot1.jpg' },
];

const TourList = () => {
  return (
    <section className="py-14 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#144d7e] mb-8">
          DANH SÁCH TOUR
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          grabCursor
          spaceBetween={16}
          breakpoints={{
            0:   { slidesPerView: 1.2, spaceBetween: 12 },
            480: { slidesPerView: 2,   spaceBetween: 14 },
            768: { slidesPerView: 3,   spaceBetween: 16 },
            1024:{ slidesPerView: 4,   spaceBetween: 18 },
            1280:{ slidesPerView: 5,   spaceBetween: 20 },
          }}
          className="!pb-8"
        >
          {data.map((item, idx) => (
            <SwiperSlide key={`${slugify(item.title)}-${idx}`} className="!h-auto">
              <CardTourList {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TourList;
