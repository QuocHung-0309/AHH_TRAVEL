'use client';

import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Image from 'next/image';
import { badgeApi } from '@/lib/badge/badgeApi';
import { BadgeType } from '@/types/badge';
import { authApi } from '@/lib/auth/authApi';

type BadgeFrontend = BadgeType & {
  title: string;
  progress: number;
  statusText: string;
};

export default function AchievementSection() {
  const [firstName, setFirstName] = useState('Bạn');
  const [badges, setBadges] = useState<BadgeFrontend[]>([]);
  const [selected, setSelected] = useState<BadgeFrontend | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      authApi.getProfile(token)
        .then((res) => {
          if (res.user?.fullName) {
            const nameParts = res.user.fullName.trim().split(" ");
            setFirstName(nameParts[0] || "Bạn");
          }
        })
        .catch((err) => console.error("Profile API error:", err));
    }

    const fetchData = async () => {
      try {
        const badgesData: BadgeType[] = await badgeApi.getUserBadges();

        const badgesFrontend: BadgeFrontend[] = badgesData.map((b) => {
          const current = b.userProgress?.currentPoints || 0;
          const required = b.pointsRequired || 0;
          const isEarned = current >= required;

          const progress = required ? Math.min((current / required) * 100, 100) : 0;
          const statusText = isEarned
            ? 'Đã chinh phục'
            : `Còn thiếu ${Math.max(required - current, 0)} điểm`;

          return {
            ...b,
            title: b.name,
            progress,
            statusText,
            userProgress: {
              ...b.userProgress,
              status: isEarned ? 'earned' : 'in_progress',
            },
          };
        });

        const sortedBadges = [...badgesFrontend].sort(
          (a, b) => (a.pointsRequired || 0) - (b.pointsRequired || 0)
        );

        setBadges(sortedBadges);
        if (sortedBadges.length > 0) setSelected(sortedBadges[0]);
      } catch (err) {
        console.error('Badge API error:', err);
      }
    };

    fetchData();
  }, []);

  const lastEarnedIndex = badges.reduce((maxIdx, b, idx) => {
    if (b.userProgress?.status === 'earned') {
      return idx;
    }
    return maxIdx;
  }, -1);

  const progressPercent =
    badges.length > 0 && lastEarnedIndex >= 0
      ? ((lastEarnedIndex + 1) / badges.length) * 100
      : 0;

  return (
    <div className="p-6 py-18 rounded-xl max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-medium text-gray-500 uppercase">
        Danh hiệu cá nhân
      </h2>
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-1">
        Xin chào, {firstName}
      </h1>

      {/* Thanh tiến trình tổng */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-4 mb-8">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Danh sách badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-20 mb-12">
        {badges.map((item, idx) => {
          const remainingPoints =
            (item.pointsRequired || 0) - (item.userProgress?.currentPoints || 0);
          const isEarned = item.userProgress?.status === 'earned';

          return (
            <div
              key={idx}
              onClick={() => setSelected(item)}
              className="rounded-lg p-4 text-center bg-white transition cursor-pointer border border-gray-300"
            >
              <p
                className={`text-xl font-semibold ${
                  selected?.title === item.title
                    ? 'text-blue-500'
                    : isEarned
                    ? 'text-black'
                    : 'text-gray-400'
                }`}
              >
                {item.title}
              </p>
              <p
                className={`text-xl mt-1 ${
                  isEarned ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                {isEarned
                  ? 'Đã chinh phục'
                  : `Còn thiếu ${Math.max(remainingPoints, 0)} điểm`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Badge chi tiết */}
      {selected && (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="bg-[#F8F8FC] rounded-xl shadow p-4 flex flex-col text-center items-center justify-center w-full lg:w-[250px]">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
              {selected.title}
            </h3>
            <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
              <CircularProgressbar
                value={selected.progress}
                text={`${Math.round(selected.progress)}%`}
                styles={buildStyles({
                  textColor: '#000',
                  pathColor: '#2563EB',
                  trailColor: '#E5E7EB',
                  textSize: '18px',
                })}
              />
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              {selected.progress < 100
                ? `Còn ${Math.round(100 - selected.progress)}% bạn sẽ chinh phục được danh hiệu mới`
                : 'Bạn đã chinh phục danh hiệu này!'}
            </p>
          </div>

          {/* Chi tiết điểm */}
          <div className="bg-[#F8F8FC] rounded-xl shadow p-6 lg:flex-[2]">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              ĐIỂM TỪ HOẠT ĐỘNG
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-6">
              {[
                { img: '/checkin.svg', label: 'Check-in' },
                { img: '/review.svg', label: 'Viết đánh giá' },
                { img: '/blog.svg', label: 'Viết Blog' },
              ].map((act, i) => (
                <div key={i} className="flex items-center">
                  <Image
                    src={act.img}
                    alt={act.label}
                    width={36}
                    height={36}
                    className="mr-2"
                  />
                  <div>
                    <p className="text-sm sm:text-base text-gray-700">
                      {act.label}
                    </p>
                    <p className="text-sm sm:text-base text-[var(--black-1)] font-medium">
                      {selected.userProgress?.currentPoints || 0} /{' '}
                      {selected.pointsRequired || 0} ĐIỂM
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 sm:space-y-6">
              {[
                { name: 'Check-in', color: '#76A7FE' },
                { name: 'Viết đánh giá', color: '#FEECBA' },
                { name: 'Viết Blog', color: '#8ACA90' },
              ].map((act, idx) => {
                const points = selected.userProgress?.currentPoints || 0;
                const maxPoints = selected.pointsRequired || 0;
                const cappedPoints = Math.min(points, maxPoints);
                const scorePercent = maxPoints
                  ? (cappedPoints / maxPoints) * 100
                  : 0;

                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm sm:text-xl text-gray-700">
                        {act.name}
                      </span>
                      <span className="text-sm sm:text-base text-gray-500">
                        {points} / {maxPoints} ĐIỂM
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${scorePercent}%`,
                          backgroundColor: act.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
