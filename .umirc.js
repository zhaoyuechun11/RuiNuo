import { defineConfig } from 'umi';
import { resolve } from 'path';
import routesPage from './config/config.router';
import api from './config/config.api';
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const prodGzipList = ['js', 'css', 'less', 'scss'];
export default defineConfig({
  mock: false,
  nodeModulesTransform: {
    type: 'none',
  },
  //fastRefresh: {},
  //mfsu: {},
  alias: {
    // '@common': resolve(__dirname, 'src/common'),
    // '@common-components': resolve(__dirname, 'src/common/components'),
    '@': resolve(__dirname, 'src'),
    '@components': resolve(__dirname, 'src/components'),
    '@static': resolve(__dirname, 'src/static'),
    '@utils': resolve(__dirname, 'src/utils'),
    '@assets': resolve(__dirname, 'src/assets'),
    '@common': resolve(__dirname, 'src/common'),
    '@page': resolve(__dirname, 'src/pages'),
  },
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  routes: routesPage.routes,
  define: {
    'process.env.baseURL': `${(api || {}).apiurl_web}`,
    'process.env.api_pdf': `${(api || {}).api_pdf}`,
    'process.env.api_pdf_windows': `${(api || {}).api_pdf_windows}`,
    'process.env.apiurl_website': `${(api || {}).apiurl_website}`,
    'process.env.apiurl_three': `${(api || {}).apiurl_three}`,
    'process.env.REACT_APP_ENV': `${(api || {}).REACT_APP_ENV}`,
  },
  hash: true,
  dynamicImport: {
    loading: '@components/Pageloading',
  },
  favicon: '/assets/favicon.ico',
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  theme: {
    '@main': '#007BFF', //蓝色主色调
    '@mainfont': '#303133', // 字体主色
    '@lightfont': '#909399', // 浅色字体
    '@mainbg': '#F5F7FE', // 背景主色-深（例：导航栏选中的背景色）
    '@lightbg': '#FAFCFF', // 背景色-中
  },
  externals: {
    //react: 'window.React',
    //'react-dom': 'window.ReactDOM',
    //'@antv/g2': 'window.G2',
  },
  // 引入被 external 库的 scripts
  // 区分 development 和 production，使用不同的产物
  scripts:
    process.env.NODE_ENV === 'development'
      ? [
          //'https://gw.alipayobjects.com/os/lib/react/16.12.0/umd/react.development.js',
          //'https://gw.alipayobjects.com/os/lib/react-dom/16.12.0/umd/react-dom.development.js',
          //'https://gw.alipayobjects.com/os/lib/antv/g2/3.5.17/dist/g2.min.js',
        ]
      : [
          //'https://gw.alipayobjects.com/os/lib/react/16.12.0/umd/react.production.min.js',
          //'https://gw.alipayobjects.com/os/lib/react-dom/16.12.0/umd/react-dom.production.min.js',
          //'https://gw.alipayobjects.com/os/lib/antv/g2/3.5.17/dist/g2.min.js',
          //'https://unpkg.com/@antv/data-set'
        ],
  ignoreMomentLocale: true,
  // extraPostCSSPlugins: [flexGapPolyfill()],
  chainWebpack(config) {
    console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
    if (process.env.NODE_ENV == 'production') {
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          algorithm: 'gzip', // 指定生成gzip格式
          test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
          threshold: 10240, //对超过10k的数据进行压缩
          minRatio: 0.6, // 压缩比例，值为0 ~ 1
        }),
      );

      config.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 3,
            automaticNameDelimiter: '.',
            cacheGroups: {
              vendor: {
                name: 'vendors',
                test({ resource }) {
                  return /[\\/]node_modules[\\/]/.test(resource);
                },
                priority: 10,
              },
            },
          },
        },
      });
    }
  },
});
