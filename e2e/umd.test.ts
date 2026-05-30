import { runBundleTests } from './shared'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QrCodeWithLogo = require('../lib/qrcode-with-logos.min.js')

runBundleTests('UMD bundle (webpack, qrcode inlined)', QrCodeWithLogo)
