const {
  webpackConfig: baseClientWebpackConfig,
  merge,
} = require("shakapacker");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonOptions = {
  resolve: {
    extensions: [".css", ".js", ".jsx"],
  },
  module: {
    // rules: [
    //   // SCSS ALL EXCEPT MODULES
    //   {
    //     test: /\.scss$/i,
    //     exclude: /\.module\.scss$/i,
    //     use: [
    //       {
    //         loader: MiniCssExtractPlugin.loader,
    //       },
    //       {
    //         loader: "css-loader",
    //         options: {
    //           importLoaders: 1,
    //           modules: {
    //             mode: "icss",
    //           },
    //         },
    //       },
    //       "postcss-loader",
    //       "sass-loader",
    //     ],
    //   },
    //   // SCSS MODULES
    //   {
    //     test: /\.module\.scss$/i,
    //     use: [
    //       {
    //         loader: MiniCssExtractPlugin.loader,
    //       },
    //       {
    //         loader: "css-loader",
    //         options: {
    //           importLoaders: 1,
    //           modules: {
    //             mode: "local",
    //             localIdentName: "[path][name]__[local]--[hash:base64:5]",
    //           },
    //         },
    //       },
    //       "postcss-loader",
    //       "sass-loader",
    //     ],
    //   },
    // ],
  },
};

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () =>
  merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;
