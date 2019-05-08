const path = require('path')
// html-webpack-plugin来创建html页面，并自动引入打包生成的js文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  mode: 'development',// 打包模式
  entry: {// 入口文件
    main: ["@babel/polyfill",path.resolve(__dirname, '../src/main.js')]
  },
  output: {
    // 打包文件输出目录
    path: path.resolve(__dirname, '../dist'),
    // 生成的js文件名称
    filename: 'js/[name].[hash:8].js',
    // 生成的chunk名称
    /***
     * chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
     * 比如在main.js文件中,require.ensure([],function(require){alert(11);}),这样不会打包块文件
     * 只有这样才会打包生成块文件require.ensure([],function(require){alert(11);require('./greeter')})
     * 或者这样require.ensure('./greeter',function(require){alert(11);})
     * chunk的hash值只有在require.ensure中引入的模块发生变化,hash值才会改变
     * 注意:对于不是在ensure方法中引入的模块,此属性不会生效,只能用CommonsChunkPlugin插件来提取

     *  */
    chunkFilename: 'js/[name].[hash:8].js',
    // 资源引用路径
    publicPath: './'
  },
  devServer: {
    hot: true,
    port: 8000,
    contentBase: './dist'
  },
  resolve:{
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    extensions: [
      '.js',
      '.vue'
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // 配置 webpack 打包 图片、媒体、字体等文件
      // file-loader 解析文件url，并将文件复制到输出的目录中
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                oprions: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          },
        ]
      },
      /*
      url-loader 功能与 file-loader 类似，如果文件小于限制的大小。
      则会返回 base64 编码，否则使用 file-loader 将文件复制到输出的目录中 */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          // cache-loader 用于缓存loader编译的结果
          // {
          //   loader: 'cache-loader'
          // },
          // thread-loader 使用worker池来运行loader，每个worker都是一个 node.js 进程。
          {
            loader: 'thread-loader',
          },
          // vue-loader 用于解析.vue文件 vue-template-compiler 用于编译模板
          {
            loader: 'vue-loader',
            options: {
              compilerOptions:{
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader'
          },
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin()
  ]
}