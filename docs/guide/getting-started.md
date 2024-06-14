# Getting-started

## Installation

Qrcode-with-logos has been published on npm and you can install it with:

::: code-group

```sh [npm]
npm install qrcode-with-logos --save
```

```sh [pnpm]
pnpm add qrcode-with-logos --save
```

```sh [yarn]
yarn add qrcode-with-logos --save
```

:::

## Usage

You can new a QrCodeWithLogo instance with canvas and content to create a qrcode.

```js
import QrCodeWithLogo from 'qrcode-with-logos'

new QrCodeWithLogo({
  canvas: document.getElementById("canvas"),
  content: "https://github.com/zxpsuper",
  width: 380,
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4"
  }
})
```
If you do not need to show the qrcode on the page, try not input the canvas options. And It will create a Canvas element inside to finish it's work!



<Tongji/>