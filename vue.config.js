// vue.config.js
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
console.log('isProd--', isProd);
module.exports = {
  configureWebpack: {
    devtool: isProd ? 'none' : 'eval-source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: false,
    proxy: {
      '/api/v1/': {
        // 目标接口域名
        target: 'http://123.60.10.61:9527/',
        // target: 'http://192.168.1.12:8080',
        // pathRewrite: {
        //   '^/api/v2': '/'
        // },
        // 以下解决https 访问问题。上面的可以访问http
        changeOrigin: true,
        secure: false,
        // webSocket
        ws: true,
        // 突破host和origin的限制
        headers: {
          referer: 'http://123.60.10.61:9527/',
          origin: 'http://123.60.10.61:9527/'
        }
      }
    }
  },
  // chainWebpack链式配置规则
  // https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // 修改它的选项...
        options.transformAssetUrls = {
          'svg-icon': 'data', // 全局注册的标签名，默认是 icon
          video: ['src', 'poster'],
          source: 'src',
          img: 'src',
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href']
        };
        return options;
      });
  }
};
