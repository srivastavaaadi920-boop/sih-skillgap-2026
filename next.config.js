/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for @xenova/transformers - externalize ONNX runtime
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('onnxruntime-node', 'sharp');
    }

    // Ignore native .node files
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
