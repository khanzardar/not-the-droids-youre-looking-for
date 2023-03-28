// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/clientWebpackConfig.js

const commonWebpackConfig = require("./commonWebpackConfig");
const { merge } = require("shakapacker");

const clientWebpackConfig = () => {
  const config = commonWebpackConfig();

  // Set the config name to 'client'
  config.name = "client";

  // Remove server-bundle entry
  delete config.entry["server-bundle"];

  return merge(config, {
    entry: {
      application: "./client/application.js",
    },
    output: {
      filename: "js/[name]-[contenthash].js",
    },
  });
};

module.exports = clientWebpackConfig;
