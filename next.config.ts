import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Run ESLint separately via `npm run lint` (avoids deprecated next lint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Transpile web3 packages
  transpilePackages: [
    '@privy-io/react-auth',
    '@privy-io/wagmi',
  ],
  
  webpack: (config, { isServer }) => {
    // Stub optional peer deps from @standard-community/standard-json
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };
    
    // Fix for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Silence the async-storage warning
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
      });
    }
    
    return config;
  },
};

export default nextConfig;