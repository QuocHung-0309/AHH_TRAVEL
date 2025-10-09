import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
  hostname: "res.cloudinary.com", // cho phép load ảnh từ Cloudinary
  pathname: "/**", // cho phép tất cả đường dẫn
},
{
  protocol: "https",
  hostname: "upload.wikimedia.org", 
  pathname: "/**",
      },
    ],
  },
};

export default nextConfig;