// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/production.js

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const webpackConfig = require("./webpackConfig");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const productionEnvOnly = (_clientWebpackConfig, _serverWebpackConfig) => {
  // place any code here that is for production only
  _clientWebpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: "css/[name]-[contenthash].css",
    })
  );
};

module.exports = webpackConfig(productionEnvOnly);
