/** @type {import('next').NextConfig} */
const nextConfig = {
  // The reverse proxy exposes this app at http://localhost:3000/next_prime/.
  basePath: process.env.NEXT_BASE_PATH || '/next_prime',
};

export default nextConfig;
