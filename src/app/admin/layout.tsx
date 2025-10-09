"use client";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import SideBar from './SideBar';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <Provider store={store}>
      <div className={`grid grid-cols-[20%_80%] ${inter.variable}`}>
        <div className="border-r border-[#0000001A]">
          <SideBar />
        </div>
        <QueryClientProvider client={queryClient}>
          <main className="flex-1 p-6">{children}</main>
        </QueryClientProvider>
      </div>
    </Provider>
  );
}
