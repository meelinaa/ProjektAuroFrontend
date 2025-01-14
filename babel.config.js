// babel.config.js
const { defaults } = require("jest-config");

module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-react',
    ],
  };
  