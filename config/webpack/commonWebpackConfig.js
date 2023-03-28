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
    rules: [
      {
        test: /\.module\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[fullhash].css",
    }),
  ],
};

// const commonOptions = {
//   resolve: {
//     extensions: [".css", ".js", ".jsx"],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.module\.scss$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           {
//             loader: "css-loader",
//             options: {
//               modules: {
//                 localIdentName: "[name]__[local]___[hash:base64:5]",
//               },
//               sourceMap: true,
//             },
//           },
//           "sass-loader",
//         ],
//       },
//       {
//         test: /^((?!\.module).)*\.scss$/,
//         use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
//       },
//     ],
//   },
// };

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () =>
  merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;
