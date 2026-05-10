---
title: qrcode-with-logos
editLink: true
layout: home
head:
  - - meta
    - name: keywords
      content: qrcode, qr code, qr code with logo, qrcode with logo, logo qr code, generate qr code, qr code generator, javascript qr code, qr code styling, colorful qr code, custom qr code
  - - meta
    - name: description
      content: qrcode-with-logos is a powerful JavaScript library for generating QR codes with custom logos, styling options, and colorful designs.
  - - meta
    - property: og:title
      content: qrcode-with-logos - Generate QR codes with logo and styling
  - - meta
    - property: og:description
      content: A powerful JavaScript library for creating QR codes with logos, custom colors, and various styling options.
  - - meta
    - property: og:type
      content: website
  - - meta
    - name: twitter:card
      content: summary
  - - meta
    - name: twitter:title
      content: qrcode-with-logos
  - - meta
    - name: twitter:description
      content: Generate QR codes with logo and styling in JavaScript
hero:
  name: qrcode-with-logos
  # text: QRcode-with-logos is a tool for creating a QRcode with a logo.
  tagline: A library for generating QR codes with a logo and styling.
  # image:
  #   src: /logo.png
  #   alt: qrcode-with-logos
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/zxpsuper/qrcode-with-logos
---

![](https://img.shields.io/github/stars/zxpsuper/qrcode-with-logos?style=flat&logo=github) ![](https://img.shields.io/github/forks/zxpsuper/qrcode-with-logos?style=flat&logo=github) ![](https://img.shields.io/npm/v/qrcode-with-logos.svg?style=flat&logo=npm) ![](https://img.shields.io/npm/dt/qrcode-with-logos.svg?style=flat&logo=npm) ![](https://img.shields.io/npm/dm/qrcode-with-logos) ![](https://img.shields.io/npm/l/qrcode.svg?style=flat)

Qrcode-with-logos is a library for generating QR codes with a logo and styling in your object.

It depend on `qrcode@1.5.3` and be more powerful than qrcode.

It can create a canvas or a image for the QRcode and even you can use the method to download the file if you want.

> [!TIP]
> qrcode-with-logos use canvas to draw qrcode which is colorful and styleful, so it only can be use in browser but not nodejs！

You can set the colors of dots and corners respectively.

You also can set the different type of dots and corners respectively!

<el-row :gutter="20">
  <el-col :span="12"><img id="image" style="width: 280px"/></el-col>
  <el-col :span="12" v-if="isClient">
    <el-collapse v-model="activeCollapse">
      <el-collapse-item title="Content" name="content">
        <div>
          content:
          <el-input v-model="content" @change="createQrcode1" placeholder="https://github.com/zxpsuper"></el-input>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Width" name="width">
        <div>
          width:
          <el-input-number v-model="width" :min="100" :max="2048" @change="createQrcode1"></el-input-number>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Dots Options" name="dots">
        <div>
          dots.color: <el-color-picker v-model="dotColor" @change="createQrcode1"></el-color-picker>
        </div>
        <div style="margin-top: 16px">
          dots.type: 
          <el-select v-model="dotType" placeholder="Select" style="width: 200px" @change="createQrcode1">
            <el-option
              v-for="item in dotTypes"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Corners Options" name="corners">
        <div>
          corners.color: <el-color-picker v-model="cornerColor" @change="createQrcode1"></el-color-picker>
        </div>
        <div style="margin-top: 16px">
          corners.type: 
          <el-select v-model="cornerType" placeholder="Select" style="width: 200px" @change="createQrcode1">
            <el-option
              v-for="item in cornerTypes"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Logo Options" name="logo">
        <div>
          logo: 
          <el-upload
            class="upload-demo"
            :before-upload="beforeUpload"
            style="display: inline-block"
          >
            <el-button type="primary">Click to change logo</el-button>
          </el-upload>
        </div>
        <div style="margin-top: 16px">
          logo.borderWidth:
          <el-input-number v-model="logoOptions.borderWidth" :min="0" :max="100" @change="createQrcode1"></el-input-number>
        </div>
        <div style="margin-top: 16px">
          logo.borderColor:
          <el-color-picker v-model="logoOptions.borderColor" @change="createQrcode1"></el-color-picker>
        </div>
        <div style="margin-top: 16px">
          logo.bgColor:
          <el-color-picker v-model="logoOptions.bgColor" @change="createQrcode1"></el-color-picker>
        </div>
        <div style="margin-top: 16px">
          logo.borderRadius:
          <el-input-number v-model="logoOptions.borderRadius" :min="0" :max="100" @change="createQrcode1"></el-input-number>
        </div>
        <div style="margin-top: 16px">
          logo.logoRadius:
          <el-input-number v-model="logoOptions.logoRadius" :min="0" :max="100" @change="createQrcode1"></el-input-number>
        </div>
      </el-collapse-item>
      <el-collapse-item title="Node QR Code Options" name="nodeQrCode">
        <div>
          nodeQrCodeOptions.margin:
          <el-input-number v-model="nodeQrCodeOptions.margin" :min="0" :max="100" @change="createQrcode1"></el-input-number>
        </div>
        <div style="margin-top: 16px">
          nodeQrCodeOptions.color.dark:
          <el-color-picker v-model="nodeQrCodeOptions.color.dark" @change="createQrcode1"></el-color-picker>
        </div>
        <div style="margin-top: 16px">
          nodeQrCodeOptions.color.light:
          <el-color-picker v-model="nodeQrCodeOptions.color.light" @change="createQrcode1"></el-color-picker>
        </div>
        <div style="margin-top: 16px">
          nodeQrCodeOptions.errorCorrectionLevel:
          <el-select v-model="nodeQrCodeOptions.errorCorrectionLevel" placeholder="Select" style="width: 200px" @change="createQrcode1">
            <el-option label="L" value="L"></el-option>
            <el-option label="M" value="M"></el-option>
            <el-option label="Q" value="Q"></el-option>
            <el-option label="H" value="H"></el-option>
          </el-select>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div style="margin-top: 20px">
      download: 
      <el-button type="primary" @click="createQrcode1(true)">Click to download</el-button>
    </div>
  </el-col>
</el-row>

## Dependencies

| Project  | Status                             | Description                   |
| -------- | ---------------------------------- | ----------------------------- |
| [qrcode] | [![qrcode-status]][qrcode-package] | QR code/2d barcode generator. |

[qrcode]: https://github.com/soldair/node-qrcode
[qrcode-status]: https://img.shields.io/npm/v/qrcode.svg
[qrcode-package]: https://npmjs.com/package/qrcode

## Questions or advise

If you have some question or advise, you can send me a E-mail(zxpscau@163.com) or open an [issue](https://github.com/zxpsuper/qrcode-with-logos/issues/new).

<script>
  // import QrCodeWithLogo from '../src/index'
  import QrCodeWithLogo from '../lib/qrcode-with-logos.esm'
  import avatar from './avatar.jpg'
  function getBlobURL(blob) {
    if (!blob) return ''
    var url = null
    // @ts-ignore
    if ('createObjectURL' in window && isFunction(window.createObjectURL)) {
      // @ts-ignore
      url = window.createObjectURL(blob)
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(blob)
    } else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(blob)
    }
    return url
  }

  function isFunction(fn) {
    return typeof fn === 'function'
  }

  export default {
    data() {
      return {
        isClient: false,
        activeCollapse: ['dots', 'corners'],
        content: 'https://github.com/zxpsuper',
        width: 1024,
        logo: avatar,
        logoOptions: {
          borderWidth: 10,
          borderColor: '#000',
          bgColor: '#fff',
          borderRadius: 8,
          logoRadius: 0
        },
        dotType: 'square',
        dotColor: '#000',
        dotTypes: [
          'square',
          'dot',
          'dot-small',
          'tile',
          'rounded',
          'diamond',
          'star',
          'fluid',
          'fluid-line',
          'stripe',
          'stripe-row',
          'stripe-column'
        ],
        cornerType: 'square',
        cornerColor: '#000',
        cornerTypes: [
          'square',
          'rounded',
          'circle',
          'rounded-circle',
          'circle-rounded',
          'circle-diamond',
          'circle-star'
        ],
        nodeQrCodeOptions: {
          margin: 20,
          color: {
            dark: '#000',
            light: '#fff'
          },
          errorCorrectionLevel: 'Q'
        }
      }
    },
    mounted() {
      this.isClient = true
      this.createQrcode1()

    },
    methods: {
      createQrcode1(download = false) {
        try {
          let qrcode = new QrCodeWithLogo({
            content: this.content,
            width: this.width,
            image: document.getElementById("image"),
            download,
            logo: {
              src: this.logo,
              ...this.logoOptions
            },
            dotsOptions: {
              color: this.dotColor,
              type: this.dotType
            },
            cornersOptions: {
              color: this.cornerColor,
              type: this.cornerType
            },
            nodeQrCodeOptions: this.nodeQrCodeOptions
          });

          qrcode.getImage().then(image => {
            console.log('open image is:' , image)
          })
        } catch (err) {
          console.log(err)
        }
      },
      beforeUpload(file) {
        const url = getBlobURL(file)
        this.logo = url
        this.createQrcode1()
        return false
      }
    }
  }
</script>

<style scoped>
  .vp-doc img {
    display: inline-block 
  }
</style>

<Tongji/>
