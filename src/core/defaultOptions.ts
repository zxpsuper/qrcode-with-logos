import { BaseOptions, CornerType, DotType, RendererType } from './types'

interface LogoDefaults {
  bgColor: string
  borderWidth: number
  crossOrigin: string
  borderRadius: number
  logoRadius: number
}

interface DefaultOptions {
  logo: LogoDefaults
  width: number
  download: boolean
  downloadName: string
  nodeQrCodeOptions: {
    margin: number
    color: {
      dark: string
      light: string
    }
  }
  dotsOptions: {
    type: DotType
    color: string
  }
  cornersOptions: {
    type: CornerType
    color: string
  }
  renderer: RendererType
}

const defaultOptions: DefaultOptions = {
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
  },
  renderer: 'canvas' as RendererType
}

export default defaultOptions
