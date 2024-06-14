export default {
  logo: {
    logoSize: 0.15,
    borderSize: 0.05,
    borderColor: '#fff',
    crossOrigin: 'anonymous',
    borderRadius: 8,
    logoRadius: 0
  },
  width: 380,
  download: false,
  downloadName: 'qr-code.png',
  nodeQrCodeOptions: {
    margin: 4,
    color: {
      dark: '#000',
      light: '#fff'
    }
  },
  dotsOptions: {
    type: 'square',
    color: '#000'
  },
  cornersOptions: {
    type: 'square',
    color: '#000'
  }
} as const
