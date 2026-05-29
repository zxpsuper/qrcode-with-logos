const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        },
        parallel: true,
        extractComments: false
      }),
    ]
  },
  entry: "./src/index.ts",
  output: {
    filename: "qrcode-with-logos.min.js",
    path: path.resolve(__dirname, "./lib"),
    library: "QrCodeWithLogo",
    libraryExport: "default",
    libraryTarget: "umd",
    globalObject: "this"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
    ]
  },
  mode: "production"
};
