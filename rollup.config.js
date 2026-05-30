// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'
import rollupTypescript from 'rollup-plugin-typescript'
import polyfills from 'rollup-plugin-node-polyfills'
import replace from '@rollup/plugin-replace'
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'esm',
        },
        {
            file: pkg.main,
            format: 'cjs',
        },
    ],
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                '0.0.0': pkg.version
            }
        }),
        rollupTypescript(),
        polyfills(),
        resolve(),
        common()
    ],
    external: ['qrcode']
}
