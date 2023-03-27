const {
  webpackConfig: baseClientWebpackConfig,
  merge,
} = require("shakapacker");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isProduction = process.env.NODE_ENV === "production";

const commonOptions = {
  resolve: {
    extensions: [".css", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.modules\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]",
              },
              importLoaders: 1,
              sourceMap: !isProduction,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /^((?!\.modules).)*scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
};

// Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
const commonWebpackConfig = () =>
  merge({}, baseClientWebpackConfig, commonOptions);

module.exports = commonWebpackConfig;

// // The source code including full typescript support is available at:
// // https://github.com/shakacode/react_on_rails_demo_ssr_hmr/blob/master/config/webpack/commonWebpackConfig.js

// // Common configuration applying to client and server configuration
// const {
//   webpackConfig: baseClientWebpackConfig,
//   merge,
// } = require("shakapacker");

// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// // const commonOptions = {
// //   resolve: {
// //     extensions: [".css", ".ts", ".tsx", ".modules.scss"],
// //   },
// // };

// // const sassLoaderConfig = {
// //   loader: "sass-resources-loader",
// //   options: {
// //     resources: "./client/app/assets/styles/app-variables.scss",
// //   },
// // };

// // const ignoreWarningsConfig = {
// //   ignoreWarnings: [
// //     /Module not found: Error: Can't resolve 'react-dom\/client'/,
// //   ],
// // };

// // const scssConfigIndex = baseClientWebpackConfig.module.rules.findIndex(
// //   (config) => ".scss".match(config.test)
// // );

// // baseClientWebpackConfig.module.rules[scssConfigIndex].use.push(
// //   sassLoaderConfig
// // );

// // const commonWebpackConfig = () =>
// //   merge({}, baseClientWebpackConfig, commonOptions, ignoreWarningsConfig);

// const commonOptions = {
//   resolve: {
//     extensions: [".css", ".ts", ".tsx", ".modules.scss"],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [
//           process.env.NODE_ENV === "production"
//             ? MiniCssExtractPlugin.loader
//             : "style-loader",
//           "css-loader",
//           "postcss-loader",
//         ],
//       },
//       {
//         test: /\.modules\.scss$/,
//         use: [
//           process.env.NODE_ENV === "production"
//             ? MiniCssExtractPlugin.loader
//             : "style-loader",
//           {
//             loader: "css-loader",
//             options: {
//               modules: {
//                 localIdentName: "[name]__[local]___[hash:base64:5]",
//               },
//             },
//           },
//           "postcss-loader",
//           "sass-loader",
//         ],
//       },
//       {
//         test: /^((?!\.modules).)*\.scss$/,
//         use: [
//           process.env.NODE_ENV === "production"
//             ? MiniCssExtractPlugin.loader
//             : "style-loader",
//           "css-loader",
//           "postcss-loader",
//           "sass-loader",
//         ],
//       },
//     ],
//   },
// };

// //Copy the object using merge b/c the baseClientWebpackConfig and commonOptions are mutable globals
// const commonWebpackConfig = () =>
//   merge({}, baseClientWebpackConfig, commonOptions);

// module.exports = commonWebpackConfig;
