'use client';

import React from 'react';
import BlogCard from '@/components/cards/BlogCard';
import BlogCardFeatured from '@/components/cards/BlogCardFeatured';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
const featured = [
  {
    slug: 'cam-nang-du-lich',
    title: 'CẨM NANG DU LỊCH',
    excerpt:
      'Những ai đã trải nghiệm mùa nước nổi ở miền Tây hẳn sẽ không thể nào quên sắc thiên nhiên và các sản vật khi triền về.',
    image: '/hot1.jpg',
  },
  {
    slug: 'dac-san-mien-tay',
    title: 'ĐẶC SẢN MIỀN TÂY',
    excerpt:
      'Cá linh, bông điên điển và nhiều món đặc trưng thiên nhiên ban tặng cho vùng sông nước.',
    image: '/hot1.jpg',
  },
];

const posts = [
  {
    slug: 'phong-tuc-ngay-tet-mien-tay',
    title: 'PHONG TỤC NGÀY TẾT MIỀN TÂY',
    excerpt:
      'Khám phá phong tục ngày Tết miền Tây: gói bánh tét, chợ nổi xuân, lì xì chùa và nếp đẹp văn hoá sông nước.',
    image: '/hot1.jpg',
  },
  {
    slug: 'kinh-nghiem-di-tour-mien-tay-2n1d',
    title: 'KINH NGHIỆM ĐI TOUR MIỀN TÂY 2 NGÀY 1 ĐÊM: CHUẨN BỊ GÌ, ĂN GÌ, MUA GÌ?',
    excerpt:
      'Lịch trình ngắn nhưng đầy trải nghiệm thú vị với vườn trái cây, chợ nổi, đờn ca tài tử…',
    image: '/hot1.jpg',
  },
  {
    slug: 'tour-mien-tay-2n1d-my-tho-ben-tre-can-tho',
    title: 'TOUR MIỀN TÂY 2 NGÀY 1 ĐÊM | MỸ THO - BẾN TRE - CẦN THƠ',
    excerpt:
      'Khám phá Mỹ Tho – Bến Tre – Cần Thơ: chợ nổi, làng nghề, đờn ca, thuyền ghe, món ngon đặc sản.',
    image: '/hot1.jpg',
  },
  {
    slug: 'phong-tuc-ngay-tet-mien-tay',
    title: 'PHONG TỤC NGÀY TẾT MIỀN TÂY',
    excerpt:
      'Khám phá phong tục ngày Tết miền Tây: gói bánh tét, chợ nổi xuân, lì xì chùa và nếp đẹp văn hoá sông nước.',
    image: '/hot1.jpg',
  },
  {
    slug: 'kinh-nghiem-di-tour-mien-tay-2n1d',
    title: 'KINH NGHIỆM ĐI TOUR MIỀN TÂY 2 NGÀY 1 ĐÊM: CHUẨN BỊ GÌ, ĂN GÌ, MUA GÌ?',
    excerpt:
      'Lịch trình ngắn nhưng đầy trải nghiệm thú vị với vườn trái cây, chợ nổi, đờn ca tài tử…',
    image: '/hot1.jpg',
  },
  {
    slug: 'tour-mien-tay-2n1d-my-tho-ben-tre-can-tho',
    title: 'TOUR MIỀN TÂY 2 NGÀY 1 ĐÊM | MỸ THO - BẾN TRE - CẦN THƠ',
    excerpt:
      'Khám phá Mỹ Tho – Bến Tre – Cần Thơ: chợ nổi, làng nghề, đờn ca, thuyền ghe, món ngon đặc sản.',
    image: '/hot1.jpg',
  },
];

export default function BlogSection() {
  return (
    <section className="py-14 sm:py-16 px-4">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#144d7e] mb-6">
          BLOG
        </h2>

        {/* Hàng 1: 2 bài nổi bật */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5">
          {featured.map((b) => (
            <BlogCardFeatured key={b.slug} {...b} />
          ))}
        </div>

        {/* Hàng 2: 3 bài thường */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          grabCursor
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1.05, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 14 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 3.2, spaceBetween: 18 },
          }}
          className="!pb-8"
        >
          {posts.map((p) => (
            <SwiperSlide key={p.slug} className="!h-auto">
              <BlogCard {...p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
