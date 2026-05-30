# Methods

## downloadImage(name: string)

Return `Promise`, set the filename and download the image.

```js
let qrcode = new QrCodeWithLogo({
  content: 'https://github.com/zxpsuper',
  logo: {
    src: 'https://avatars1.githubusercontent.com/u/28730619?s=460&v=4'
  }
})

qrcode.downloadImage('hello-world.png').then(() => {
  // do what you want to do
})
```

## getCanvas()

Return `Promise<HTMLCanvasElement>`, you can use the HTMLCanvasElement to do more things with canvas.

```js
let qrcode = new QrCodeWithLogo({
  content: 'https://github.com/zxpsuper',
  width: 380,
  image: document.getElementById('image'),
  logo: {
    src: 'https://avatars1.githubusercontent.com/u/28730619?s=460&v=4'
  }
})

qrcode.getCanvas().then((canvas) => {
  canvas.toDataURL()
  // or do other things with canvas
})
```

## getImage()

Return `Promise<HTMLImageElement>`, you can use the HTMLImageElement to do more things with image.

```js
let qrcode = new QrCodeWithLogo({
  canvas: document.getElementById('canvas'),
  content: 'https://github.com/zxpsuper',
  width: 380,
  image: document.getElementById('image'),
  logo: {
    src: 'https://avatars1.githubusercontent.com/u/28730619?s=460&v=4'
  }
})

qrcode.getImage().then((image) => {
  // or do other things with image
})
```

## getSvgString()

Return `Promise<string>`, get the generated SVG string. Only available when `renderer: "svg"` is set.

```js
let qrcode = new QrCodeWithLogo({
  content: 'https://github.com/zxpsuper',
  renderer: 'svg',
  logo: {
    src: 'https://avatars1.githubusercontent.com/u/28730619?s=460&v=4'
  }
})

qrcode.getSvgString().then((svg) => {
  // svg is a complete SVG XML string
  console.log(svg) // "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>...</svg>"
  
  // You can embed it directly in HTML
  document.body.innerHTML = svg
  
  // Or use it as a data URL
  const dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svg)
})
```

> [!NOTE]
> When using `renderer: "svg"`, `getCanvas()` still returns a canvas element (for backward compatibility), but it won't contain the QR code drawing. Use `getSvgString()` to get the actual SVG output.

## toCanvas()

- `Deprecated`

## toImage()

- `Deprecated`

<Tongji/>
