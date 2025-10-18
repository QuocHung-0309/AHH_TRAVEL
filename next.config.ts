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
    ],
  },
};

export default nextConfig;
