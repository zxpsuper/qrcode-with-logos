import { runBundleTests } from './shared'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QrCodeWithLogo = require('../lib/qrcode-with-logos.common.js')

runBundleTests('CJS bundle (rollup, qrcode external)', QrCodeWithLogo)
