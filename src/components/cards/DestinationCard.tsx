'use client';

import React from 'react';
import Image from 'next/image';
import { HiLocationMarker } from 'react-icons/hi';
import { AiFillStar } from 'react-icons/ai';
import Button from '@/components/ui/Button';

type DestinationCardProps = {
  title: string;
  location: string;
  distance: string;
  image: string;
  rating?: number;      
  totalRatings?: number; 
};

const DestinationCard: React.FC<DestinationCardProps> = ({
  title,
  location,
  distance,
  image,
  rating,
  totalRatings,
}) => {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/10 backdrop-blur-[12px] shadow-lg hover:shadow-xl transition border-2 border-white overflow-hidden">
      <div className="relative w-full aspect-[4/3] top-2">
        <Image src={image} alt={title} fill className="object-cover rounded-3xl" />
      </div>
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5">
        <div className="space-y-1.5 sm:space-y-2.5">
          <p className="text-[11px] sm:text-xs text-[var(--gray-3)] flex items-center gap-1">
            <HiLocationMarker className="w-4 h-4 text-blue-500" />
            {location}
          </p>
          <h3 className="text-sm sm:text-lg font-bold text-[var(--black-1)]">
            {title}
          </h3>
          <p className="text-[11px] sm:text-xs text-[var(--gray-3)]">{distance}</p>
          {(rating !== undefined || totalRatings !== undefined) && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              {rating !== undefined && (
                <span className="flex items-center gap-1">
                  <AiFillStar className="text-yellow-400" />
                  {rating.toFixed(1)}
                </span>
              )}
              {totalRatings !== undefined && (
                <span>({totalRatings} lượt)</span>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 sm:mt-4">
          <Button
            variant="outline-primary"
            className="bg-[var(--white)] text-[var(--primary)] text-xs sm:text-sm font-medium px-4 py-1.5 w-full justify-center rounded-none border-none"
          >
            XEM CHI TIẾT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
