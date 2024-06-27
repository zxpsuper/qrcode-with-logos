import { CornerType, DotType } from "./types";

export default {
  logo: {
    bgColor: '#fff',
    borderWidth: 10,
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
    type: 'square' as DotType,
    color: '#000'
  },
  cornersOptions: {
    type: 'square' as CornerType,
    color: '#000'
  }
}
