const {
  webpackConfig: baseClientWebpackConfig,
  merge,
} = require("shakapacker");

const commonOptions = {
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {},
  plugins: [],
};

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () =>
  merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;
