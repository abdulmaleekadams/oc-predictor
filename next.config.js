/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
      return [
      {
          source: '/api/:path*',
          destination:
          process.env.NODE_ENV === 'development'
              ? 'https://oc-predictor.onrender.com/api/index'
              : 'https://oc-predictor.onrender.com/api/index',
      },
      ]
},
}
