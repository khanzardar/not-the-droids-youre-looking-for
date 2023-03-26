// The source code including full typescript support is available at:
// https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/commonWebpackConfig.js

// Common configuration applying to client and server configuration
const {
  webpackConfig: baseClientWebpackConfig,
  merge,
} = require("shakapacker");

const { isEnvProduction } = require("shakapacker/helpers/webpackHelpers");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssLoader = isEnvProduction
  ? { loader: MiniCssExtractPlugin.loader }
  : "style-loader";

const commonOptions = {
  resolve: {
    extensions: [".css", ".ts", ".tsx", ".modules.scss"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // {
      //   test: /\.modules\.scss$/,
      //   use: [
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         modules: {
      //           localIdentName: "[name]__[local]___[hash:base64:5]",
      //         },
      //       },
      //     },
      //     "postcss-loader",
      //     "sass-loader",
      //   ],
      // },
      {
        test: /^((?!\.modules).)*\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
};

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () =>
  merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;
