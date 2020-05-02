const path = require('path'); // nodejs 路径
const buble = require('@rollup/plugin-buble'); // Convert ES2015 with buble. 将 ES6+ 代码编译成 ES2015 标准
const cjs = require('@rollup/plugin-commonjs'); // commonjs 模块标准支持
const rplc = require('@rollup/plugin-replace'); // 编译过程中动态替换代码中的内容
const nresolve = require('@rollup/plugin-node-resolve'); // 编译过程中帮助 rollup 查找外部的模块并支持合并
const flow = require('rollup-plugin-flow-no-whitespace'); // 编译过程中 将 flow 静态类型检查进行忽略
const rts = require('rollup-plugin-typescript2'); // 将 TypeScript 转换成为 ES6+ 标准
const packageInfo = require('../package.json');
const projectName = packageInfo.name; // 项目名
const version = packageInfo.version; // 版本号
const license = packageInfo.license; // 开源协议

const banner = // 版本信息 & 作者 & 开源协议
`/**!
 * ${projectName} v${version}
 * Author: Lin.xs | Email: yunfax@outlook.com
 * (c) ${new Date().getFullYear()} Lin.xs
 * @license ${license}
 */`;

const resolve = _path => path.resolve(__dirname, '../', _path);

const configs = [
  { // Universal Module Definition dev
    file: resolve(`dist/${projectName}.js`),
    format: 'umd',
    env: 'development'
  },
  { // Universal Module Definition prd
    file: resolve(`dist/${projectName}.min.js`),
    format: 'umd',
    env: 'production'
  },
  { // Commonjs Modules dev
    file: resolve(`dist/${projectName}.common.js`),
    format: 'cjs',
    env: 'development'
  },
  { // Commonjs Modules prd
    file: resolve(`dist/${projectName}.common.min.js`),
    format: 'cjs',
    env: 'production'
  },
  { // ESM dev
    file: resolve(`dist/${projectName}.esm.js`),
    format: 'es',
    env: 'development'
  },
  { // ESM prd
    file: resolve(`dist/${projectName}.esm.min.js`),
    format: 'es',
    env: 'production'
  },
].map(buildConfig);

function buildConfig(item) {
  const input = {
    input: resolve('src/index.ts'),
    plugins: [
      rts({
        tsconfig: resolve('tsconfig.json')
      }),
      flow(),
      nresolve(),
      cjs(),
      rplc({
        __VERSION__: version
      }),
      buble()
    ]
  };
  const output = {
    file: item.file,
    format: item.format,
    banner,
    name: 'CatVuexDecorator',
    indent: ' ',
  };

  if (item.env) {
    input.plugins.unshift(rplc({
      'process.env.NODE_ENV': JSON.stringify(item.env)
    }));
  }

  return {
    input,
    output,
  };
}

module.exports = configs;