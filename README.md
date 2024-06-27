# qrcode-with-logos 

![](https://img.shields.io/github/stars/zxpsuper/qrcode-with-logos)  ![](https://img.shields.io/npm/v/qrcode-with-logos.svg?style=flat-square) ![](https://img.shields.io/npm/dt/qrcode-with-logos.svg?style=flat-square) ![](https://img.shields.io/npm/l/qrcode.svg?style=flat-square)

<img src="./images/qr-code.png" width="200">
<img src="./images/qr-code2.png" width="200">
<img src="./images/qr-code3.png" width="200">

## Introduction

Qrcode-with-logos is a library for generating QR codes with a logo and styling in your object.

It depend on `qrcode` dependence and be more powerful than `qrcode`.

It can create a canvas or a image for the QRcode and even you can use the method to download the file that you want.

## Usage

- Install the module

```
npm install qrcode-with-logos --save
```

## Documentation

Visit [https://zxpsuper.github.io/qrcode-with-logos](https://zxpsuper.github.io/qrcode-with-logos/)!
## Example

```html
<canvas id="canvas"></canvas> <img src="" alt="" id="image" />
<img id="image" alt="">
```

```js
import QrCodeWithLogo from "qrcode-with-logos";
let qrcode = new QrCodeWithLogo({
  canvas: document.getElementById("canvas"),
  content: "https://github.com/zxpsuper",
  width: 380,
  //   download: true,
  image: document.getElementById("image"),
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4"
  }
});

qrcode.downloadImage("qrcode.png");
```

## Dependencies

| Project  | Status                             | Description                   |
| -------- | ---------------------------------- | ----------------------------- |
| [qrcode] | [![qrcode-status]][qrcode-package] | QR code/2d barcode generator. |

[qrcode]: https://github.com/soldair/node-qrcode
[qrcode-status]: https://img.shields.io/npm/v/qrcode.svg
[qrcode-package]: https://npmjs.com/package/qrcode

## Questions or advise

If you have some question or advise, you can send me a E-mail(zxpscau@163.com) or open an [issue](https://github.com/zxpsuper/qrcode-with-logos/issues/new).
