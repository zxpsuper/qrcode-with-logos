// rollup.config.js
import json from 'rollup-plugin-json'
// import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'
import rollupTypescript  from 'rollup-plugin-typescript'
import polyfills from 'rollup-plugin-node-polyfills'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json';
// const pkg = require('./package.json')

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
    plugins: [ rollupTypescript(), json(), polyfills(), resolve(), common()],
    external: ['qrcode']
}
