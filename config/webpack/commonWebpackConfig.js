const {
  webpackConfig: baseClientWebpackConfig,
  merge,
} = require("shakapacker");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV === "development";

const commonOptions = {
  resolve: {
    extensions: [".scss", ".module.scss", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.module\.scss$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          // {
          //   loader: "css-loader",
          //   options: {
          //     modules: true,
          //     sourceMap: isDevelopment,
          //   },
          // },
          "sass-loader",
          // {
          //   loader: "sass-loader",
          //   options: {
          //     sourceMap: isDevelopment,
          //   },
          // },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          // {
          //   loader: "sass-loader",
          //   options: {
          //     sourceMap: isDevelopment,
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // filename: isDevelopment ? "[name].css" : "[name].[fullhash].css",
      // chunkFilename: isDevelopment ? "[id].css" : "[id].[fullhash].css",
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
