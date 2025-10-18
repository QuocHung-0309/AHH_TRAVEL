import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      // ⬇️ thêm picsum.photos ở đây
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
       {
        protocol: 'https',
        hostname: 'onetour.vn',
        port: '',
        pathname: '/Media/**', // đúng với đường dẫn bạn đang dùng
      },
      {
        protocol: 'https',
        hostname: 'motogo.vn',
        port: '',
        pathname: '/wp-content/uploads/**' , // đúng với đường dẫn bạn đang dùng
      },  
      {
        protocol: 'https',
        hostname: 'cdn3.ivivu.com', // 👈 host đang lỗi
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bazaarvietnam.vn', // 👈 host đang lỗi
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mia.vn', // 👈 host đang lỗi
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dulichviet.com.vn', // 👈 host đang lỗi
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
