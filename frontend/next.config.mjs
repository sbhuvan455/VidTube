// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*', 
          destination: 'https://vidtube-hxjy.onrender.com/api/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;
  