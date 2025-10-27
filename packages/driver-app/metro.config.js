const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the shared package to the watchFolders
config.watchFolders = [
  path.resolve(__dirname, '../../packages/shared'),
];

// Add the shared package to the resolver
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

// Configure the resolver to handle the shared package
config.resolver.alias = {
  '@shared': path.resolve(__dirname, '../../packages/shared/src'),
};

// Disable symlink resolution to avoid issues
config.resolver.unstable_enableSymlinks = false;

module.exports = config;