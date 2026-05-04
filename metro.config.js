const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * We are fetching the default configuration first to extend it.
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // We add 'html' to assetExts so Metro treats .html files as static assets
    // instead of trying to parse them as JavaScript code.
    assetExts: [...defaultConfig.resolver.assetExts, 'html'],
  },
};

// mergeConfig combines our custom 'html' setting with the rest of the React Native defaults.
module.exports = mergeConfig(defaultConfig, config);