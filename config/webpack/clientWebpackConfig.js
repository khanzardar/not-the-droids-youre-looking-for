// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/clientWebpackConfig.js

const commonWebpackConfig = require("./commonWebpackConfig");
const { merge } = require("shakapacker");

const clientWebpackConfig = () => {
  const config = commonWebpackConfig();

  if (config.name !== "client") {
    throw new Error("clientWebpackConfig name must be 'client'");
  }

  // Remove server-bundle entry
  delete config.entry["server-bundle"];

  return merge(config, {
    entry: {
      application: "./app/javascript/packs/application.js",
    },
    output: {
      filename: "js/[name]-[contenthash].js",
    },
  });
};

module.exports = clientWebpackConfig;
