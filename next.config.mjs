/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "img.kwcdn.com" },
      { protocol: "https", hostname: "img-eu.kwcdn.com" }
    ]
  }
};

export default nextConfig;
