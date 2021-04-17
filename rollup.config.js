import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const config = [
    {
        input: 'src/lazy-render.js',
        output: {
            name: 'LazyRender',
            file: 'dist/lazy-render.js',
            format: 'iife'
        },
        plugins: [babel({ babelHelpers: 'bundled' })]
    },
    {
        input: 'src/lazy-render.js',
        output: {
            name: 'LazyRender',
            file: 'dist/lazy-render.min.js',
            format: 'iife',
            plugins: [terser()]
        },
        plugins: [babel({ babelHelpers: 'bundled' })]
    }
];

export default config;
