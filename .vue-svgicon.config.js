const path = require('path');
const svgFilePaths = ['./src/assets/svg'].map((v) => path.resolve(v));
const tagName = 'svg-icon';
console.log('svgFilePaths---', svgFilePaths);
module.exports = {
  tagName,
  svgFilePath: svgFilePaths,
  svgoConfig: {},
  pathAlias: {
    '@svg': svgFilePaths[0]
  }
  // transformAssetUrls: {
  //   [tagName]: ['data'],
  //   video: ['src', 'poster'],
  //   source: 'src',
  //   img: 'src',
  //   image: ['xlink:href', 'href'],
  //   use: ['xlink:href', 'href']
  // }
};
