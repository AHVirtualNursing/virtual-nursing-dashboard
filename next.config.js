/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  test: /hammerjs/,
  loader: "bundle-loader",
  options: {
    lazy: true,
  },
};

module.exports = nextConfig
