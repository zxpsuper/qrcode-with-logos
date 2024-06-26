# Options

## content `required`

- Type: `string`

QR Code content.

## width

- Type: `number`

- Default: `380`

QR Code width.

## canvas

- Type: `HTMLCanvasElement`

- Default: a new canvas tag

A canvas tag to show the QR code.

## image

- Type: `HTMLImageElement`

- Default: a new img tag

A img tag to show the QR code.

## download

- Type: `boolean` | `(download: () => Promise<void>) => void`

- Default: `false`

You can set the value to be true to download the file immediately.

if download is a funciton, you can use it like:

```js
new QrCodeWithLogo({
  content: 'https://github.com/zxpsuper',
  logo: {
    src: 'https://avatars1.githubusercontent.com/u/28730619?s=460&v=4'
  },
  download(downloadFn) {
    // you can choose when to start download by downloadFn...
    downloadFn().then(() => {
      // do what you want to do after download image!
    })
  }
})
```

## downloadName

- Type: `string`

- Default: `qr-code.png`

Set the download file name, should be used with the download property.

## onError

- Type: `(err) => void`

- Default: `null`

Catch error and handle it!

## nodeQrCodeOptions

- Type: `object`

### nodeQrCodeOptions.margin

- Type: `number`
- Default: `4`

qrcode margin

### nodeQrCodeOptions.errorCorrectionLevel

- Type: `string`
- Default: according to content length and auto choose.

qrcode errorCorrectionLevel, such as "L", "M", "Q", "H"

### nodeQrCodeOptions.color

- Type `object`

qrcode color

#### nodeQrCodeOptions.color.dark

- Type: `string`
- Default: `#000000`

qrcode color value of dark

#### nodeQrCodeOptions.color.light

- Type: `string`
- Default: `#ffffff`

qrcode color value of light

> [!TIP]
> If you want a transparent background, please set light equal to '#00000000'

## logo

- Type: `object` | `string`

### logo.src `required`

- Type: `string`

### logo.logoRadius

- Type: `number`
- Default: `0`

### logo.logoSize

- `Deprecated`

It can auto calculate logoSize now!

### logo.borderSize

- `Deprecated`

> [!WARNING]
> You are recommended to use **borderWidth** instead of borderSize!


### logo.borderWidth

- Type: `number`
- Default: `10`

### logo.borderRadius

- Type: `number`
- Default: `8`

### logo.bgColor

- Type: `String`
- Default: `#ffffff`

It is the logo background color

### logo.crossOrigin

- Type: `string`
- Default: `Anonymous`

## dotsOptions

- Type: `Object`

### dotsOptions.type

- Type: `"dot"
| "dot-small"
| "tile"
| "rounded"
| "square"
| "diamond"
| "star"
| "fluid"
| "fluid-line"
| "stripe"
| "stripe-column"`
- Default: `square`

### dotsOptions.color

- Type: `string`
- Default: `#000000`

## cornersOptions

- Type: `object`

### cornersOptions.type

- Type: `"square"
| "rounded"
| "circle"
| "rounded-circle"
| "circle-rounded"
| "circle-star"
| "circle-diamond"`

- Default: `square`

### cornersOptions.color

- Type: `string`
- Default: `#000000`

### cornersOptions.radius

- Type: `object` | `number`

It is the corners rounded radius. It is Effective when cornersOptions.type includes 'rounded'.

#### cornersOptions.radius.inner

- Type: `number`
- Default: `dotSize / 4`

#### cornersOptions.radius.outer

- Type: `number`
- Default: `dotSize / 2`

<Tongji/>
