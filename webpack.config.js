const path = require("path");
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "QRcode-with-logo.js", //contenthash 若文件内容无变化，则contenthash 名称不变
    path: path.resolve(__dirname, "./dist"),
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
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 5000,
              // 分离图片至imgs文件夹
              name: "imgs/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  mode: "production"
};
