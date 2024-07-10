# Methods

## downloadImage(name: string)

Return `Promise`, set the filename and download the image.

```js
let qrcode = new QrCodeWithLogo({
  content: "https://github.com/zxpsuper",
  nodeQrCodeOptions: {},
  cornersOptions: {},
  dotsOptions: {},
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4",
  },
});

qrcode.downloadImage("hello-world.png").then(() => {
  // do what you want to do
});
```

## getCanvas()

Return `Promise<HTMLCanvasElement>`, you can use the HTMLCanvasElement to do more things with canvas.

```js
let qrcode = new QrCodeWithLogo({
  content: "https://github.com/zxpsuper",
  width: 380,
  image: document.getElementById("image"),
  nodeQrCodeOptions: {},
  cornersOptions: {},
  dotsOptions: {},
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4",
  },
});

qrcode.getCanvas().then((canvas) => {
  canvas.toDataURL();
  // or do other things with canvas
});
```

## getImage()

Return `Promise<HTMLImageElement>`, you can use the HTMLImageElement to do more things with image.

```js
let qrcode = new QrCodeWithLogo({
  canvas: document.getElementById("canvas"),
  content: "https://github.com/zxpsuper",
  width: 380,
  image: document.getElementById("image"),
  nodeQrCodeOptions: {},
  cornersOptions: {},
  dotsOptions: {},
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4",
  },
});

qrcode.getImage().then((image) => {
  // or do other things with image
});
```

## toCanvas()

- `Deprecated`

## toImage()

- `Deprecated`

<Tongji/>
