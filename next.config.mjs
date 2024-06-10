/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "my-app-buckets.s3.ap-southeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },

      // TODO: UPDATE LAter
    ],
  },
  transpilePackages: ["react-hook-mousetrap"],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};
export default nextConfig;
