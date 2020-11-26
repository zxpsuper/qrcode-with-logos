/*
 * @Author: super
 * @Date: 2019-06-27 16:29:26
 * @Last Modified by: super
 * @Last Modified time: 2019-07-01 15:51:26
 */
import QrCodeWithLogo from "./index";
// @ts-ignore
import Logo = require("./super.jpg");
let demo = new QrCodeWithLogo({
  canvas: document.getElementById("canvas"),
  content: "https://github.com/zxpsuper",
  width: 380,
  // download: true,
  image: document.getElementById("image"),
  logo: {
    src: Logo
  }
}).toImage();

// demo.toCanvas().then(() => {
//   demo.toImage().then(() => {
//     setTimeout(() => {
//       demo.downloadImage("hello world");
//     }, 2000);
//   });
// });
