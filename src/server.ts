/*
 * @Author: super
 * @Date: 2019-06-27 16:29:26
 * @Last Modified by: super
 * @Last Modified time: 2019-07-01 15:51:26
 */
// import QrCodeWithLogo from "./index";
import QrCodeWithLogo from "../lib/qrcode-with-logos.esm";
//@ts-ignore
const Logo = require("./super.jpg");

window.demo = new QrCodeWithLogo({
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  content: "https://github.com/zxpsuper",
  width: 380,
  download: true,
  image: document.getElementById("image") as HTMLImageElement,
  logo: {
    src: Logo
  },
  nodeQrCodeOptions: {
    color: {
      light: '#00000000'
    }
  }
})

// demo.downloadImage('haha.png')

