/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "book-shelf-project-gs7l.onrender.com",
        pathname: "/media/**",
      },
      // ngrok — http (local dev fallback)
      {
        protocol: "http",
        hostname: "unlubricant-nonqualitative-colton.ngrok-free.dev",
        pathname: "/media/**",
      },
      // ngrok — https (standard ngrok tunnel protocol)
      {
        protocol: "https",
        hostname: "unlubricant-nonqualitative-colton.ngrok-free.dev",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
