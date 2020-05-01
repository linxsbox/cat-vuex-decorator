const fs = require('fs'); // nodejs 文件系统
const path = require('path'); // nodejs 路径
const zlib = require('zlib'); // nodejs 压缩
const rollup = require('rollup'); // rollup 核心功能
const terser = require('terser'); // 将 TypeScript 转换成为 ES6+ 标准
const configs = require('./config'); // 配置信息

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

async function build(items = []) {
  for (let index = 0; index < items.length; index++) {
    await buildEntry(items[index]);
  }
}

build(configs);
// buildEntry(configs[0])

function buildEntry({ input, output }) {
  // 结构 output 配置信息
  // file：输出的文件路径
  // banner：版头信息
  const { file: filePath } = output;
  const isPrd = /min\.js$/.test(filePath); // 判断是否为 prd 版本
  return rollup
    .rollup(input)
    .then(bundle => bundle.generate(output))
    .then(result => {
      const codeContent = result.output[0].code; // 生成的代码字符串模板
      if (isPrd) {
        const minified = terser.minify(codeContent, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return writeFile(filePath, minified, true);
      } else {
        return writeFile(filePath, codeContent);
      }
    })
}

function writeFile(filePath, context, isZip) {
  return new Promise((resolve, reject) => {
    const fileSize = code => (code.length / 1024).toFixed(2) + 'kb';
    const report = extra => {
      console.log(
        path.relative(process.cwd(), filePath),
        `(${fileSize(context)})`,
        extra || ''
      );
      resolve();
    };

    fs.writeFile(filePath, context, err => {
      if (err) return reject(err);
      if (isZip) {
        zlib.gzip(context, (err, zipped) => {
          if (err) return reject(err);
          zippedSize = zipped;
          report(`(gzipped: ${fileSize(zippedSize)})`);
        });
      } else {
        report();
      }
    })
  })
}