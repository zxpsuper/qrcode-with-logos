const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        },
        cache: true, // 开启缓存
        parallel: true, // 允许并发
        sourceMap: false // set to true if you want JS source maps
      }),
    ]
  },
  entry: "./src/index.ts",
  output: {
    filename: "qrcode-with-logos.min.js", //contenthash 若文件内容无变化，则contenthash 名称不变
    path: path.resolve(__dirname, "./lib"),
    library: "QrCodeWithLogo",
    libraryExport: "default",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"]
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
    ]
  },
  mode: "production"
};