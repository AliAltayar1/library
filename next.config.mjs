/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "unlubricant-nonqualitative-colton.ngrok-free.dev",
        pathname: "/media/**",
      },
    ],
  },
};
export default nextConfig;
