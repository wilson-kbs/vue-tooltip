const { readFileSync, writeFileSync } = require('fs');
const { rollup } = require('rollup');
const { minify } = require('uglify-js');
const commonjs = require('@rollup/plugin-commonjs');
const pretty = require('pretty-bytes');
const { sync } = require('gzip-size');
const pkg = require('./package.json');
const vue = require('rollup-plugin-vue');
const buble = require('@rollup/plugin-buble');
const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss')

const name = 'KsTooltip'
const date = new Date();

const banner = `/*
 * wavify v${pkg.version}
 * (c) ${date.getFullYear()} Wilson Kabalisa
 * Released under the MIT license
 * https://github.com/wilson-kbs/wavify
 */
`;

console.info('Compiling... 😤');

rollup({
  input: 'src/wrapper.ts',
  plugins: [
    typescript({ check: false }),
    vue({
      css: false, // Injecte dynamiquement notre CSS dans une balise <style>
      compileTemplate: true, // Converti notre template en fonction de rendu Vue
      preprocessStyles: true
    }),
    commonjs(),
    postcss(),
    buble({ babelHelpers: 'bundled' }), // Traduit en ES5
  ]
}).then(async bun => {
  await bun.write({
    banner,
    format: 'umd',
    name,
    exports: 'named',
    file: pkg.main
  });

  await bun.write({
    banner,
    format: 'es',
    name,
    exports: 'named',
    file: pkg.module
  });

  await bun.write({
    banner,
    file: pkg.unpkg,
    name,
    exports: 'named',
    format: 'iife',
  }).then(_ => {
    const data = readFileSync(pkg.unpkg, 'utf8');

    // produce minified output
    const { code } = minify(data);
    writeFileSync(pkg.unpkg, `${banner}\n${code}`); // with banner

    // output gzip size
    const int = sync(code);
    console.info('Compilation was a success! 👍');
    console.info(`~> gzip size: ${pretty(int)}`);
  }).catch(console.error);
}).catch(console.error);