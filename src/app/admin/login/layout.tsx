// src/app/admin/login/layout.tsx
"use client"; // Bắt buộc vì dùng Provider

import { Provider } from 'react-redux';
import { store } from '@/app/admin/store/store';
import SlideshowLayout from '@/components/ui/SlideshowLayout';
import React from 'react';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <SlideshowLayout>{children}</SlideshowLayout>
    </Provider>
  );
}
