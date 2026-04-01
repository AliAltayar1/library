/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "book-shelf-project-gs7l.onrender.com",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "unlubricant-nonqualitative-colton.ngrok-free.dev",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
