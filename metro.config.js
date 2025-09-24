const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

// Fix for import.meta issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Improve hot reload behavior
config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url;
    }
    return url;
  },
};

// Better error handling for development
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
  // Add support for ES modules
  experimentalImportSupport: false,
  inlineRequires: true,
};

// Ensure proper asset resolution
config.resolver.assetExts.push(
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'
);

// Add module resolution for better ES module support
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config; 