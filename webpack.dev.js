const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/server.ts",
  devtool: "inline-source-map",
  devServer: {
    // 开发服务器
    contentBase: "./dist"
  },
  output: {
    // 输出
    filename: "js/[name].[hash].js", // 每次保存 hash 都变化
    path: path.resolve(__dirname, "./dist")
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"]
  },
  plugins: [
    //...省略号
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html")
    })
  ],
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
  mode: "development"
};
